import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../../lib/prisma";
import Question from "@/app/types/question";

interface QuestionRequest {
	studentID: string;
	questionID: string;
	chosenAnswerID: string;
	isCorrect: boolean;
	timeToAnswer: number;
}

interface QuestionInfo {
	topicID: Question["topicID"];
	categoryID: Question["categoryID"];
	modifiedDifficulty: Question["modifiedDifficulty"];
}

interface QuestionStatistics {
	numberOfAttempts: string;
	correctAttemptsFraction: string;
}

interface MasteryValue {
	mastery: number;
}

const MASTERY_CONFIG = {
	CORRECT_INCREASE: 0.05,
	INCORRECT_DECREASE: -0.04,
	MAX: 1,
	MIN: 0,
};

const DIFFICULTY_CONFIG = {
	SIGMOID_THRESHOLD: 10,
	SCALE_FACTOR: 5,
};

const calculateSigmoid = (attempts: number): number =>
	1 / (1 + Math.exp(DIFFICULTY_CONFIG.SIGMOID_THRESHOLD - attempts));

const calculateNewDifficulty = (
	currentDifficulty: number,
	correctAttemptsFraction: number,
	numberOfAttempts: number
): number => {
	const sigmoid = calculateSigmoid(numberOfAttempts);
	const rawDifficulty =
		currentDifficulty * (1 - sigmoid) +
		(1 - correctAttemptsFraction) *
		DIFFICULTY_CONFIG.SCALE_FACTOR *
		sigmoid;
	return Math.round(rawDifficulty);
};

async function getCurrentMastery(
	studentID: string,
	topicID: string,
	categoryID: string
): Promise<number> {
	const result = await prisma.$queryRaw<MasteryValue[]>`
    SELECT mastery
    FROM studentKnowledge
    WHERE studentID = UUID_TO_BIN(${studentID})
    AND topicID = UUID_TO_BIN(${topicID})
    AND categoryID = UUID_TO_BIN(${categoryID})
  `;

	if (!result.length) {
		throw new Error("No mastery value found for student");
	}

	return result[0].mastery;
}

async function getQuestionInfo(questionID: string): Promise<QuestionInfo> {
	const questions = await prisma.$queryRaw<QuestionInfo[]>`
    SELECT 
      BIN_TO_UUID(topicID) AS topicID,
      BIN_TO_UUID(categoryID) AS categoryID,
      modifiedDifficulty
    FROM question 
    WHERE questionID = UUID_TO_BIN(${questionID})
  `;

	if (questions.length !== 1) {
		throw new Error(`Expected 1 question, got ${questions.length}`);
	}

	return questions[0];
}

async function getQuestionStatistics(
	questionID: string
): Promise<QuestionStatistics> {
	const statistics = await prisma.$queryRaw<QuestionStatistics[]>`
    SELECT 
      COUNT(questionID) AS numberOfAttempts,
      CAST(
        COALESCE(
          SUM(CASE WHEN isCorrect = 1 THEN 1 ELSE 0 END) / COUNT(questionID),
          0.0
        ) AS DECIMAL(10,5)
      ) AS correctAttemptsFraction
    FROM statistic 
    WHERE questionID = UUID_TO_BIN(${questionID})
    LIMIT 1
  `;

	return statistics[0];
}

async function recordStatistic(
	data: QuestionRequest,
	statisticID: string
): Promise<void> {
	await prisma.$queryRaw`
    INSERT INTO statistic (
      statID, studentID, questionID, chosenAnswerID, isCorrect, timeToAnswer
    ) VALUES (
      UUID_TO_BIN(${statisticID}),
      UUID_TO_BIN(${data.studentID}),
      UUID_TO_BIN(${data.questionID}),
      UUID_TO_BIN(${data.chosenAnswerID}),
      ${data.isCorrect},
      ${data.timeToAnswer}
    )
  `;
}

async function updateQuestionDifficulty(
	questionID: string,
	difficulty: number
): Promise<void> {
	await prisma.$queryRaw`
    UPDATE question 
    SET modifiedDifficulty = ${difficulty} 
    WHERE questionID = UUID_TO_BIN(${questionID})
  `;
}

async function updateStudentMasteryAndGetNew(
	studentID: string,
	topicID: string,
	categoryID: string,
	isCorrect: boolean
): Promise<number> {
	const masteryUpdate = isCorrect ? MASTERY_CONFIG.CORRECT_INCREASE : MASTERY_CONFIG.INCORRECT_DECREASE;

	// Start a transaction
	return await prisma.$transaction(async (prisma) => {
		// First do the update
		await prisma.$executeRaw`
      UPDATE studentKnowledge 
      SET mastery = CASE
        WHEN mastery + ${masteryUpdate} > ${MASTERY_CONFIG.MAX} THEN ${MASTERY_CONFIG.MAX}
        WHEN mastery + ${masteryUpdate} < ${MASTERY_CONFIG.MIN} THEN ${MASTERY_CONFIG.MIN}
        ELSE mastery + ${masteryUpdate}
      END 
      WHERE studentID = UUID_TO_BIN(${studentID})
      AND topicID = UUID_TO_BIN(${topicID})
      AND categoryID = UUID_TO_BIN(${categoryID})
    `;

		// Then get the new value
		const result = await prisma.$queryRaw<{ mastery: number }[]>`
      SELECT mastery
      FROM studentKnowledge
      WHERE studentID = UUID_TO_BIN(${studentID})
      AND topicID = UUID_TO_BIN(${topicID})
      AND categoryID = UUID_TO_BIN(${categoryID})
    `;

		if (!result.length) {
			throw new Error('No mastery record found after update');
		}

		return result[0].mastery;
	});
}


async function recordLogs(
	questionID: string,
	difficulty: number,
	studentID: string,
	topicID: string,
	categoryID: string,
	masteryUpdate: number,
	masteryValue: number
): Promise<void> {
	const [questionLogID, studentLogID] = [uuidv4(), uuidv4()];

	await Promise.all([
		prisma.$queryRaw`
      INSERT INTO questionLogsDifficulty (questionLogID, questionID, difficulty)
      VALUES (UUID_TO_BIN(${questionLogID}), UUID_TO_BIN(${questionID}), ${difficulty})
    `,
		prisma.$queryRaw`
      INSERT INTO mastery_logs (mastery_log_id, studentID, topicID, categoryID, mastery_change, mastery_value)
      VALUES (
        UUID_TO_BIN(${studentLogID}),
        UUID_TO_BIN(${studentID}),
        UUID_TO_BIN(${topicID}),
        UUID_TO_BIN(${categoryID}),
        ${masteryUpdate},
		${masteryValue}
      )
    `,
	]);
}

export async function POST(request: NextRequest) {
	try {
		const requestBody: QuestionRequest = JSON.parse(await request.text());

		const [questionInfo, statistics] = await Promise.all([
			getQuestionInfo(requestBody.questionID),
			getQuestionStatistics(requestBody.questionID),
		]);

		const modifedDifficulty: string | undefined =
			questionInfo.modifiedDifficulty;
		if (modifedDifficulty === undefined)
			throw new Error("Modifed Difficulty is undefined.");

		const newDifficulty = calculateNewDifficulty(
			parseFloat(modifedDifficulty),
			parseFloat(statistics.correctAttemptsFraction),
			parseInt(statistics.numberOfAttempts)
		);

		await Promise.all([
			recordStatistic(requestBody, uuidv4()),
			updateQuestionDifficulty(requestBody.questionID, newDifficulty)
		]);

		const masteryChange = requestBody.isCorrect ?
			MASTERY_CONFIG.CORRECT_INCREASE :
			MASTERY_CONFIG.INCORRECT_DECREASE;

		const topicID: string | undefined = questionInfo.topicID;
		if (topicID === undefined) throw new Error("Topic ID is undefined.");

		const categoryID: string | undefined = questionInfo.categoryID;
		if (categoryID === undefined)
			throw new Error("Category ID is undefined.");

		const newMasteryValue = await updateStudentMasteryAndGetNew(
			requestBody.studentID,
			topicID,
			categoryID,
			requestBody.isCorrect
		);

		await recordLogs(
			requestBody.questionID,
			newDifficulty,
			requestBody.studentID,
			topicID,
			categoryID,
			masteryChange,
			newMasteryValue
		);

		return new Response(
			JSON.stringify({
				data: null,
				status: 200,
				message: "Question Difficulty and Student Mastery were updated successfully!",
				pgError: null
			})
		);
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({
				data: null,
				status: 400,
				message: "Something went wrong",
				pgError: error
			})
		);
	}
}
