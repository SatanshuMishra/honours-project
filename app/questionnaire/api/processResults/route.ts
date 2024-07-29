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

/**
 * Get categoryID for given category name
 * @param {string} name: Name of Category
 * @returns {Promise<String | undefined>} Returns categoryID else undefined if not found.
 */

async function getCategoryID(name: string): Promise<String | undefined> {
	try {
		let category: TaxonomyCategory[] =
			await prisma.$queryRaw`SELECT BIN_TO_UUID(categoryID) AS categoryID FROM taxonomyCategory WHERE name = ${name}`;

		if (category.length === 0)
			throw new Error(`No category by the name of ${name} found!`);

		return category[0].categoryID;
	} catch (error) { }
}
/**
 * UpdateIRT difficulty offset for given student, topic and category combination.
 * @param {string} studentID: ID of student
 * @param {string} topicID: ID of topic
 * @param {string} categoryID: ID of the category
 * @param {number} difficultyOffset: New Difficulty offset value
 * @returns {Promise<boolean>} Return true if successful. Else false.
 */

async function updateIRTDifficulty(
	studentID: string,
	topicID: string,
	categoryID: string,
	difficultyOffset: number
): Promise<Boolean> {
	try {
		await prisma.$queryRaw`UPDATE studentKnowledge SET difficultyOffset = ${difficultyOffset} WHERE studentID = UUID_TO_BIN(${studentID}) AND topicID = UUID_TO_BIN(${topicID}) AND categoryID = UUID_TO_BIN(${categoryID})`;

		await prisma.$queryRaw`INSERT INTO studentLogOffset (studentLogID, studentID, topicID, categoryID, difficultyOffset) VALUES (UUID_TO_BIN(${uuidv4()}), UUID_TO_BIN(${studentID}), UUID_TO_BIN(${topicID}), UUID_TO_BIN(${categoryID}), ${difficultyOffset})`;

		return true;
	} catch (error) {
		console.error(
			"Something went wrong with updating difficultyOffset.\nError: ",
			error
		);
		return false;
	}
}

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody: {
			studentID: string;
			topicID: string;
		} = JSON.parse(requestText);

		//  DEBUG:
		console.info(`Request Body: ${requestBody}`);

		//  DOCUMENTATION: FETCH STATISTICS FOR IRT MODEL

		let statistics: {
			isCorrect: number;
			categoryName: string;
		}[] =
			await prisma.$queryRaw`SELECT statistic.isCorrect AS isCorrect, taxonomyCategory.name AS categoryName
									FROM statistic
									JOIN question ON statistic.questionID = question.questionID
									JOIN taxonomyCategory ON question.categoryID = taxonomyCategory.categoryID
									WHERE statistic.studentID = UUID_TO_BIN(${requestBody.studentID}) AND question.topicID = UUID_TO_BIN(${requestBody.topicID})`;

		if (statistics.length === 0)
			throw new Error(
				`No statistics returned for Student ID ${requestBody.studentID} and Topic ID ${requestBody.topicID}`
			);

		console.info(
			`---STATISTICS RETURNED---\n${JSON.stringify(statistics)}`
		);

		interface IRTData {
			[categoryName: string]: number[];
		}

		//  DOCUMENTATION: FORMAT STATISTICS FOR INPUT INTO IRT MODEL

		const irtData: IRTData = {};

		statistics.forEach((item) => {
			const { categoryName, isCorrect } = item;

			if (!irtData[categoryName]) {
				irtData[categoryName] = [0, 1];
			}

			irtData[categoryName].push(isCorrect);
		});

		//  DEBUG:
		console.info(`IRT DATA: ${JSON.stringify(irtData)}`);

		//  DOCUMENTATION: DERTMINE THE ARRAY WITH THE MAXIMUM LENGTH FOR PADDING

		let maxLength = 0;
		for (const categoryName in irtData) {
			maxLength = Math.max(maxLength, irtData[categoryName].length);
		}

		//  DOCUMENTATION: PAD ARRAYS

		for (const categoryName in irtData) {
			const currentLength = irtData[categoryName].length;
			if (currentLength < maxLength) {
				const paddingNeeded = maxLength - currentLength;
				irtData[categoryName] = [
					...irtData[categoryName],
					...Array(paddingNeeded).fill(null),
				];
			}
		}

		//  DEBUG:
		console.info(`IRT DATA W/ PADDING: ${JSON.stringify(irtData)}`);

		//  DOCUMENTATION: OPTIONS FOR PYTHON SHELL

		const options = {
			pythonOptions: ["-u"],
			args: [JSON.stringify(irtData)],
			pythonPath: "./app/questionnaire/api/irt/venv37/bin/python",
		};

		//  DOCUMENTATION: IRT MODEL

		PythonShell.run(
			"./app/questionnaire/api/irt/irt_analysis.py",
			options
		).then(async (messages) => {
			//  DOCUMENTATION: HANDLE IRT MODEL RESPONSE

			const parameterData: ParameterData[] = JSON.parse(messages[0]);
			const results: Record<string, ParameterData> = {};
			const categories = Object.keys(irtData);

			for (let i = 0; i < categories.length; i++) {
				const categoryName = categories[i];
				results[categoryName] = parameterData[i];
			}

			//  DOCUMENTATION: UPDATE DIFFICULTY OFFSET

			for (const result in results) {
				//  DEBUG:
				console.log(`Category: ${result}`);
				console.log(results[result]);

				let categoryID = await getCategoryID(result);

				if (!categoryID) throw new Error("No Category ID removed");

				//  DEBUG:
				console.info("Category ID: ", categoryID);

				const normalizedDifficulty =
					Math.max(-10, Math.min(10, results[result]["b"]))

				console.info(
					`Difficulty: ${results[result]["b"]}\nNormalized Difficulty: ${(results[result]["b"] / 10) * 5}`
				);

				let updateStatus = await updateIRTDifficulty(
					requestBody.studentID,
					requestBody.topicID,
					categoryID,
					normalizedDifficulty
				);
				if (!updateStatus)
					throw new Error("Updating difficultyOffset failed.");
			}
		});

		return new Response(
			JSON.stringify({
				data: null,
				status: 200,
			})
		);
	} catch (e) {
		console.log(e);
		return new Response(
			JSON.stringify({
				data: null,
				status: 400,
			})
		);
	}
}
