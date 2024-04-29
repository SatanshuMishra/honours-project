import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
	try {
		//  NOTE: PARSE REQUEST DATA
		const requestText = await request.text();
		const requestBody: {
			questionID: string;
			answer: string;
			explanation: string;
			isCorrect: string;
		} = JSON.parse(requestText);

		//  NOTE: GENERATE UUID TO INSERT ANSWER
		const uuid = uuidv4();

		//  NOTE: USE PRISMA TO INSERT ANSWER
		await prisma.$queryRaw`INSERT INTO answer (answerID, questionID, answerDescription, answerExplanation, isCorrect) VALUES (UUID_TO_BIN(${uuid}), UUID_TO_BIN(${requestBody.questionID}), ${requestBody.answer}, ${requestBody.explanation}, ${requestBody.isCorrect})`;

		//  NOTE: RETURN 201 IF SUCCESSFUL
		return new Response(
			JSON.stringify({
				data: null,
				status: 201,
			}),
		);
	} catch (e) {
		console.log(e);
		return new Response(
			JSON.stringify({
				data: null,
				status: 501,
			}),
		);
	}
}
