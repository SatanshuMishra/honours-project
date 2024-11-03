import prisma from "../../../lib/prisma";
import { PythonShell } from "python-shell";
import { NextRequest } from "next/server";
import TaxonomyCategory from "@/app/types/taxonomyCategory";
import { v4 as uuidv4 } from "uuid";

interface ParameterData {
	a: number;
	b: number;
	g: number;
	u: number;
}

interface RequestBody {
	studentID: string;
	topicID: string;
}

interface Statistics {
	isCorrect: number;
	categoryName: string;
}

interface IRTData {
	[categoryName: string]: number[];
}

interface StudentParameters {
	mastery: number;
}

interface CategoryWPT {
	categoryName: string;
	wpt: number;
}

interface WPTResult {
	categoryWPTs: CategoryWPT[];
	topicWPT: number;
}

const PYTHON_PATH = "./app/questionnaire/api/irt/venv39/bin/python";
const IRT_SCRIPT_PATH = "./app/questionnaire/api/irt/irt_analysis.py";
const DIFFICULTY_BOUNDS = {
	MIN: -4,
	MAX: 4
};
const WEIGHTS = {
	DIFFICULTY: 0.7,
	MASTERY: 0.3
};

const debugLog = (stage: string, data: any) => {
	console.log('\n=== DEBUG:', stage, '===');
	console.log(JSON.stringify(data, null, 2));
	console.log('========================\n');
};

const normalizeValue = (value: number, min: number, max: number): number => {
	return Math.max(min, Math.min(max, value));
};

const calculateIdealDifficulty = (scaledDifficulty: number, mastery: number): number => {
	const weightedRawDifficulty = (WEIGHTS.DIFFICULTY * scaledDifficulty) + (WEIGHTS.MASTERY * mastery);
	return Math.round(1 + (weightedRawDifficulty * 4));
};

function calculateCategoryWPT(
	irtParameters: ParameterData,
	normalizedDifficulty: number,
	mastery: number
): number {
	// Normalize discrimination parameter (typically 0 to 2) to [0,1]
	const normalizedDiscrimination = Math.min(1, irtParameters.a / 2);

	// Convert difficulty from [-4,4] to [0,1]
	const scaledDifficulty = (normalizedDifficulty + 4) / 8;

	// Calculate WPT with normalized values
	const wpt = (
		(normalizedDiscrimination * scaledDifficulty +
			2 * mastery +
			irtParameters.g * mastery) / 4
	);

	// Ensure result is between 0 and 1
	return Math.min(1, Math.max(0, wpt));
}


function calculateTopicWPT(categoryWPTs: CategoryWPT[]): number {
	if (categoryWPTs.length === 0) return 0;
	return (
		categoryWPTs.reduce((sum, category) => sum + category.wpt, 0) /
		categoryWPTs.length
	);
}

/**
 * Get categoryID for given category name
 */
async function getCategoryID(name: string): Promise<string> {
	const category: TaxonomyCategory[] = await prisma.$queryRaw`
    SELECT BIN_TO_UUID(categoryID) AS categoryID 
    FROM taxonomyCategory 
    WHERE name = ${name}
  `;

	if (category.length === 0) {
		throw new Error(`No category found with name: ${name}`);
	}

	if (category[0].categoryID === undefined)
		throw new Error("Category ID is undefined");

	return category[0].categoryID;
}

/**
 * Update IRT difficulty offset and log the change
 */
async function updateIRTDifficulty(
	studentID: string,
	topicID: string,
	categoryID: string,
	scaledDifficulty: number,
	idealDifficulty: number
): Promise<boolean> {
	try {
		await prisma.$transaction([
			prisma.$queryRaw`
        UPDATE studentKnowledge 
        SET scaledDifficulty = ${scaledDifficulty}, 
            idealDifficulty = ${idealDifficulty} 
        WHERE studentID = UUID_TO_BIN(${studentID}) 
        AND topicID = UUID_TO_BIN(${topicID}) 
        AND categoryID = UUID_TO_BIN(${categoryID})
      `,
			prisma.$queryRaw`
        INSERT INTO student_topic_category_difficulty_log (
          studentLogID, 
          studentID, 
          topicID, 
          categoryID, 
          scaledDifficulty
        ) VALUES (
          UUID_TO_BIN(${uuidv4()}), 
          UUID_TO_BIN(${studentID}), 
          UUID_TO_BIN(${topicID}), 
          UUID_TO_BIN(${categoryID}), 
          ${scaledDifficulty}
        )
      `
		]);
		return true;
	} catch (error) {
		console.error("Failed to update difficultyOffset:", error);
		return false;
	}
}

/**
 * Fetch and format statistics for IRT model
 */
async function getFormattedStatistics(studentID: string, topicID: string): Promise<IRTData> {
	const statistics: Statistics[] = await prisma.$queryRaw`
    SELECT 
      statistic.isCorrect AS isCorrect, 
      taxonomyCategory.name AS categoryName
    FROM statistic
    JOIN question ON statistic.questionID = question.questionID
    JOIN taxonomyCategory ON question.categoryID = taxonomyCategory.categoryID
    WHERE statistic.studentID = UUID_TO_BIN(${studentID}) 
    AND question.topicID = UUID_TO_BIN(${topicID})
  `;

	if (statistics.length === 0) {
		throw new Error(`No statistics found for Student ID ${studentID} and Topic ID ${topicID}`);
	}

	const irtData: IRTData = {};
	statistics.forEach(({ categoryName, isCorrect }) => {
		if (!irtData[categoryName]) {
			irtData[categoryName] = [0, 1];
		}
		irtData[categoryName].push(isCorrect);
	});

	return padIRTData(irtData);
}

/**
 * Pad IRT data arrays to ensure equal length
 */
function padIRTData(irtData: IRTData): IRTData {
	const maxLength = Math.max(...Object.values(irtData).map(arr => arr.length));

	return Object.fromEntries(
		Object.entries(irtData).map(([category, data]) => [
			category,
			[...data, ...Array(maxLength - data.length).fill(null)]
		])
	);
}

async function logWPTScores(
	studentID: string,
	topicID: string,
	categoryWPTs: CategoryWPT[],
	topicWPT: number
): Promise<void> {
	try {
		// First, insert the topic-level WPT
		const topicLogID = uuidv4();
		await prisma.$queryRaw`
      INSERT INTO weighted_topic_performance_log (
        performance_log_id,
        student_id,
        topic_id,
        weighted_performance_score
      ) VALUES (
        UUID_TO_BIN(${topicLogID}),
        UUID_TO_BIN(${studentID}),
        UUID_TO_BIN(${topicID}),
        ${topicWPT}
      )
    `;

		// Then, insert category-level WPTs
		for (const categoryWPT of categoryWPTs) {
			const categoryLogID = uuidv4();
			const categoryID = await getCategoryID(categoryWPT.categoryName);

			await prisma.$queryRaw`
        INSERT INTO weighted_topic_category_performance_log (
          performance_log_id,
          student_id,
          topic_id,
          category_id,
          weighted_performance_score
        ) VALUES (
          UUID_TO_BIN(${categoryLogID}),
          UUID_TO_BIN(${studentID}),
          UUID_TO_BIN(${topicID}),
          UUID_TO_BIN(${categoryID}),
          ${categoryWPT.wpt}
        )
      `;
		}

		console.log('\n======= WPT LOGGING SUCCESS =======');
		console.log(`Topic WPT (${topicWPT}) logged with ID: ${topicLogID}`);
		console.log(`${categoryWPTs.length} category WPTs logged`);
		console.log('==================================\n');
	} catch (error) {
		console.error('Failed to log WPT scores:', error);
		throw error;
	}
}

/**
 * Process IRT model results
 */
async function processIRTResults(
	irtData: IRTData,
	parameterData: ParameterData[],
	studentID: string,
	topicID: string
): Promise<WPTResult> {
	debugLog('Python Script Output (Parameter Data)', parameterData);

	const categories = Object.keys(irtData);
	const results: Record<string, ParameterData> = {};
	const categoryWPTs: CategoryWPT[] = [];
	const finalOffsets: Record<string, {
		categoryName: string;
		rawDifficulty: number;
		normalizedDifficulty: number;
		scaledDifficulty: number;
		mastery: number;
		idealDifficulty: number;
		wpt: number;
		irtParams: ParameterData;  // Added to store IRT parameters
	}> = {};

	categories.forEach((categoryName, i) => {
		results[categoryName] = parameterData[i];
	});

	debugLog('Mapped Results by Category', results);

	for (const [categoryName, result] of Object.entries(results)) {
		const categoryID = await getCategoryID(categoryName);
		const normalizedDifficulty = normalizeValue(result.b, DIFFICULTY_BOUNDS.MIN, DIFFICULTY_BOUNDS.MAX);

		const [studentParameter]: StudentParameters[] = await prisma.$queryRaw`
      SELECT mastery 
      FROM studentKnowledge 
      WHERE studentID = UUID_TO_BIN(${studentID}) 
      AND topicID = UUID_TO_BIN(${topicID}) 
      AND categoryID = UUID_TO_BIN(${categoryID})
    `;

		if (!studentParameter) {
			throw new Error("Student parameter not found");
		}

		const scaledDifficulty = (normalizedDifficulty + 4) / 8;
		const idealDifficulty = calculateIdealDifficulty(scaledDifficulty, studentParameter.mastery);

		// Calculate WPT for this category
		const categoryWPT = calculateCategoryWPT(
			result,
			normalizedDifficulty,
			studentParameter.mastery
		);

		categoryWPTs.push({
			categoryName,
			wpt: categoryWPT
		});

		// Store the final values for this category
		finalOffsets[categoryName] = {
			categoryName,
			rawDifficulty: result.b,
			normalizedDifficulty,
			scaledDifficulty,
			mastery: studentParameter.mastery,
			idealDifficulty,
			wpt: categoryWPT,
			irtParams: result  // Store IRT parameters for logging
		};

		const updateStatus = await updateIRTDifficulty(
			studentID,
			topicID,
			categoryID,
			scaledDifficulty,
			idealDifficulty
		);

		if (!updateStatus) {
			throw new Error(`Failed to update difficulty offset for category: ${categoryName}`);
		}
	}

	const topicWPT = calculateTopicWPT(categoryWPTs);

	console.log('\n======= FINAL DIFFICULTY OFFSETS =======');
	console.table(finalOffsets);
	console.log('=======================================\n');

	// Detailed calculations breakdown
	console.log('\n======= DETAILED CALCULATIONS =======');
	Object.values(finalOffsets).forEach(({
		categoryName,
		rawDifficulty,
		normalizedDifficulty,
		scaledDifficulty,
		mastery,
		idealDifficulty,
		wpt,
		irtParams
	}) => {
		console.log(`\nCategory: ${categoryName}`);
		console.log('----------------------------------------');
		console.log(`Raw Difficulty (from IRT): ${rawDifficulty.toFixed(4)}`);
		console.log(`Normalized Difficulty [-4,4]: ${normalizedDifficulty.toFixed(4)}`);
		console.log(`Scaled Difficulty [0,1]: ${scaledDifficulty.toFixed(4)}`);
		console.log(`Student Mastery: ${mastery.toFixed(4)}`);
		console.log(`Weighted Calculation for Ideal Difficulty:`);
		console.log(`  ${WEIGHTS.DIFFICULTY} × ${scaledDifficulty.toFixed(4)} (difficulty) +`);
		console.log(`  ${WEIGHTS.MASTERY} × ${mastery.toFixed(4)} (mastery)`);
		console.log(`Final Ideal Difficulty: ${idealDifficulty}`);
		console.log('\nWPT Calculation:');
		console.log(`  (${irtParams.a.toFixed(4)} × ${scaledDifficulty.toFixed(4)} + `);
		console.log(`   2 × ${mastery.toFixed(4)} + `);
		console.log(`   ${irtParams.g.toFixed(4)} × ${mastery.toFixed(4)}) / 4`);
		console.log(`Final Category WPT: ${wpt.toFixed(4)}`);
	});
	console.log('====================================\n');

	console.log('\n======= TOPIC LEVEL WPT =======');
	console.log(`Average WPT across all categories: ${topicWPT.toFixed(4)}`);
	console.log('===============================\n');


	const wptResult = {
		categoryWPTs,
		topicWPT
	};

	await logWPTScores(studentID, topicID, categoryWPTs, topicWPT);

	return wptResult;
}

export async function POST(request: NextRequest) {
	try {
		const requestBody: RequestBody = await request.json();
		const irtData = await getFormattedStatistics(requestBody.studentID, requestBody.topicID);

		const pythonOptions = {
			pythonOptions: ["-u"],
			args: [JSON.stringify(irtData)],
			pythonPath: PYTHON_PATH,
		};

		const messages = await PythonShell.run(IRT_SCRIPT_PATH, pythonOptions);
		const parameterData: ParameterData[] = JSON.parse(messages[0]);

		await processIRTResults(irtData, parameterData, requestBody.studentID, requestBody.topicID);

		return new Response(JSON.stringify({ data: null, status: 200 }));
	} catch (error) {
		console.error("IRT analysis failed:", error);
		return new Response(JSON.stringify({ data: null, status: 400 }));
	}
}
