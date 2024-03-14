import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

async function getQuestionInfo(questionID: string): Promise<string | void> {
	const question: {
		topicID: number;
		categoryID: number;
		modDifficulty: number;
	}[] =
		await prisma.$queryRaw`SELECT BIN_TO_UUID(topicID) AS topicID, BIN_TO_UUID(categoryID) AS categoryID, modifiedDifficulty FROM question WHERE questionID = UUID_TO_BIN(${questionID})`;

	if (question.length === 0 || question.length > 1)
		throw new Error("0 or more than 1 question rows returned.");

	return JSON.stringify(question[0]);
}

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody: {
			studentID: string;
			questionID: string;
			chosenAnswerID: string;
			isCorrect: boolean;
			timeToAnswer: number;
			recordedDifficulty: number | null;
		} = JSON.parse(requestText);

		console.info("[addStatistic] Data Received: ", requestBody);

		const questionRequest = await getQuestionInfo(requestBody.questionID);

		// [GUARD]
		if (!questionRequest)
			throw new Error("No question information returned");

		const question: {
			topicID: string;
			categoryID: string;
			modDifficulty: string;
		} = JSON.parse(questionRequest);

		console.info("[addStatistic] Question: ", question);

		const currentDifficulty: number = parseFloat(question.modDifficulty);

		const difficultyUpdate = requestBody.isCorrect ? -0.1 : 0.1;

		const newDifficulty = Math.max(
			0.5,
			currentDifficulty + difficultyUpdate
		);

		console.log("[addStatistic] Updated Difficulty: ", newDifficulty);

		const statisticID = uuidv4();

		await prisma.$queryRaw`INSERT INTO statistic (statID, studentID, questionID, chosenAnswerID, isCorrect, timeToAnswer, recordedDifficulty) VALUES (UUID_TO_BIN(${statisticID}), UUID_TO_BIN(${requestBody.studentID}), UUID_TO_BIN(${requestBody.questionID}), UUID_TO_BIN(${requestBody.chosenAnswerID}), ${requestBody.isCorrect}, ${requestBody.timeToAnswer}, ${requestBody.recordedDifficulty})`;

		await prisma.$queryRaw`UPDATE question SET modDifficulty = ${newDifficulty} WHERE questionID = UUID_TO_BIN(${requestBody.questionID})`;

		const masteryUpdate = requestBody.isCorrect ? 0.1 : -0.1;

		await prisma.$queryRaw`UPDATE studentKnowledge SET masteryProbability = masteryProbability + ${masteryUpdate} WHERE studentID = UUID_TO_BIN(${requestBody.studentID}) AND topicID = UUID_TO_BIN(${question.topicID}) AND categoryID = UUID_TO_BIN(${question.categoryID})`;

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
