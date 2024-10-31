import Question from "@/app/types/question";
import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

/**
 * This function gets the topicID, categoryID and modifiedDifficulty for a given QuestionID.
 * @param {string} questionID - The question ID of the question you need information on.
 * @returns {Promise<string>} Returns topicID, categoryID and modifiedDifficulty of Question.
 */
async function getQuestionInfo(questionID: string): Promise<string> {
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
		const questionRequest: string = await getQuestionInfo(requestBody.questionID);

		if (!questionRequest)
			throw new Error("No question information returned");

		const question: {
			topicID: Question["topicID"];
			categoryID: Question["categoryID"];
			modifiedDifficulty: Question["modifiedDifficulty"];
		} = JSON.parse(questionRequest);

		if (!question.topicID || !question.categoryID || !question.modifiedDifficulty)
			throw new Error("Question information has missing data.");

		//  DOCUMENTATION: SELECT ATTEMPT STATISTICS DATA FOR QUESTION
		const questionAttempts: {
			numberOfAttempts: string;
			correctAttemptsFraction: string;
		}[] = await prisma.$queryRaw`SELECT COUNT(questionID) AS numberOfAttempts, CAST(COALESCE(SUM(CASE WHEN isCorrect = 1 THEN 1 ELSE 0 END) / COUNT(questionID), 0.0) AS DECIMAL(10,5)) AS correctAttemptsFraction FROM statistic WHERE statistic.questionID = UUID_TO_BIN(${requestBody.questionID}) LIMIT 1`;

		//eslint-disable-next-line @typescript-eslint/no-unused-vars
		interface BigInt {
			/** Convert to BigInt to string form in JSON.stringify */
			toJSON: () => string;
		}
		BigInt.prototype.toJSON = function() {
			return this.toString();
		};


		//  DOCUMENTATION: CALCULATE NEW QUESTION DIFFICULTY
		const sigmoid = 1 / (1 + Math.exp(10 - parseInt(questionAttempts[0].numberOfAttempts)));
		console.log(`Correct Attempts Fraction: ${parseFloat(questionAttempts[0].correctAttemptsFraction)}`);
		const rawDifficulty = parseFloat(question.modifiedDifficulty) * (1 - sigmoid) + ((1 - parseFloat(questionAttempts[0].correctAttemptsFraction)) * 5 * sigmoid);

		const difficulty = Math.round(rawDifficulty);

		// if(difficulty > 0)
		// 	difficulty = Math.min(difficulty, 10.0);
		//
		// if(difficulty < 0)
		// 	difficulty = Math.max(difficulty, -10.0);

		//  DEBUG:
		console.log(`QuestionID: ${requestBody.questionID}\nNew Difficulty: ${difficulty}`);

		const statisticID = uuidv4();

		//  DOCUMENTATION: ADD ATTEMPT TO STATISTICS TABLE

		await prisma.$queryRaw`INSERT INTO statistic (statID, studentID, questionID, chosenAnswerID, isCorrect, timeToAnswer) VALUES (UUID_TO_BIN(${statisticID}), UUID_TO_BIN(${requestBody.studentID}), UUID_TO_BIN(${requestBody.questionID}), UUID_TO_BIN(${requestBody.chosenAnswerID}), ${requestBody.isCorrect}, ${requestBody.timeToAnswer})`;

		//  DOCUMENTATION: UPDATE QUESTION DIFFICULTY

		await prisma.$queryRaw`UPDATE question SET modifiedDifficulty = ${difficulty} WHERE questionID = UUID_TO_BIN(${requestBody.questionID})`;

		//  DOCUMENTATION: UPDATE MASTERY

		const masteryUpdate = requestBody.isCorrect ? 0.05 : -0.04;
		await prisma.$queryRaw`UPDATE studentKnowledge SET mastery = CASE
                 WHEN mastery + ${masteryUpdate} > 1 THEN 1
                 WHEN mastery + ${masteryUpdate} < 0 THEN 0
                 ELSE mastery + ${masteryUpdate} 
             END WHERE studentID = UUID_TO_BIN(${requestBody.studentID}) AND topicID = UUID_TO_BIN(${question.topicID}) AND categoryID = UUID_TO_BIN(${question.categoryID})`;

		//  DOCUMENTATION: ADD QUESTION DIFFICULTY CHANGE LOGS

		const questionLogID = uuidv4(), studentLogID = uuidv4();
		await prisma.$queryRaw`INSERT INTO questionLogsDifficulty (questionLogID, questionID, difficulty) VALUES (UUID_TO_BIN(${questionLogID}), UUID_TO_BIN(${requestBody.questionID}), ${difficulty})`;

		const masteryLog = masteryUpdate > 1 ? 1 : masteryUpdate < 0 ? 0 : masteryUpdate;

		// DOCUMENTATION: ADD MASTERY CHANGE LOG

		await prisma.$queryRaw`INSERT INTO studentLogMastery (studentLogID, studentID, topicID, categoryID, mastery) VALUES (UUID_TO_BIN(${studentLogID}), UUID_TO_BIN(${requestBody.studentID}), UUID_TO_BIN(${question.topicID}), UUID_TO_BIN(${question.categoryID}), ${masteryLog})`;

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
