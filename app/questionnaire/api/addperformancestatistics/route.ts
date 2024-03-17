import Question from "@/app/types/question";
import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

async function getQuestionInfo(questionID: string): Promise<string | void> {
	const question: {
		topicID: Question["topicID"];
		categoryID: Question["categoryID"];
		modifiedDifficulty: Question["modifiedDifficulty"];
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
		} = JSON.parse(requestText);

		//  DOCUMENTATION: GET QUESTION DATA
		const questionRequest = await getQuestionInfo(requestBody.questionID);

		if (!questionRequest)
			throw new Error("No question information returned");

		const question: {
			topicID: Question["topicID"];
			categoryID: Question["categoryID"];
			modifiedDifficulty: Question["modifiedDifficulty"];
		} = JSON.parse(questionRequest);

		//  DOCUMENTATION: SELECT ATTEMPT STATISTICS DATA FOR QUESTION
		const questionAttempts: {
			numberOfAttempts: number;
			correctAttemptsFraction: string;
		}[] = await prisma.$queryRaw`SELECT COUNT(questionID) AS numberOfAttempts, CAST(SUM(CASE WHEN isCorrect = 1 THEN 1 ELSE 0 END) AS DECIMAL(10,5)) / COUNT(questionID) AS correctAttemptsFraction FROM statistic WHERE statistic.questionID = UUID_TO_BIN(${requestBody.questionID})`;

		if(questionAttempts.length !== 1) throw new Error("Something went wrong fetching questionAttempts data.");

		//  DOCUMENTATION: CALCULATE NEW QUESTION DIFFICULTY
		const sigmoid = 1 / (1 + Math.exp(10 - Number(questionAttempts[0].numberOfAttempts)));
		const difficulty = parseFloat(question.modifiedDifficulty) / (1 - sigmoid) + parseFloat(questionAttempts[0].correctAttemptsFraction) * sigmoid;

		//  DEBUG:
		console.log(`QuestionID: ${requestBody.questionID}\nNew Difficulty: ${difficulty}`);

		const statisticID = uuidv4();

		//  DOCUMENTATION: ADD ATTEMPT TO STATISTICS TABLE

		await prisma.$queryRaw`INSERT INTO statistic (statID, studentID, questionID, chosenAnswerID, isCorrect, timeToAnswer, recordedDifficulty) VALUES (UUID_TO_BIN(${statisticID}), UUID_TO_BIN(${requestBody.studentID}), UUID_TO_BIN(${requestBody.questionID}), UUID_TO_BIN(${requestBody.chosenAnswerID}), ${requestBody.isCorrect}, ${requestBody.timeToAnswer}, ${requestBody.recordedDifficulty})`;

		//  DOCUMENTATION: UPDATE QUESTION DIFFICULTY

		await prisma.$queryRaw`UPDATE question SET modifiedDifficulty = ${difficulty} WHERE questionID = UUID_TO_BIN(${requestBody.questionID})`;

		//  DOCUMENTATION: UPDATE MASTERY

		const masteryUpdate = requestBody.isCorrect ? 0.05 : -0.04;
		await prisma.$queryRaw`UPDATE studentKnowledge SET mastery = CASE
                 WHEN mastery + ${masteryUpdate} > 1.7 THEN 1.7
                 WHEN mastery + ${masteryUpdate} < -1.7 THEN -1.7
                 ELSE mastery + ${masteryUpdate} 
             END WHERE studentID = UUID_TO_BIN(${requestBody.studentID}) AND topicID = UUID_TO_BIN(${question.topicID}) AND categoryID = UUID_TO_BIN(${question.categoryID})`;

		return new Response(
			JSON.stringify({
				data: null,
				status: 200,
				message: "Question Difficulty and Student Mastery were updated successfully!",
				pgError: null
			})
		);
	} catch (e) {
		console.log(e);
		return new Response(
			JSON.stringify({
				data: null,
				status: 400,
				message: "Something went wrong",
				pgError: e
			})
		);
	}
}
