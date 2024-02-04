import prisma from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Answer from "@/app/types/answer";

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody: {
			questionID: string;
		} = JSON.parse(requestText);

		let answers: Answer[] =
			await prisma.$queryRaw`SELECT * FROM (SELECT answer.answerID,  LOWER(CONCAT(
										SUBSTR(HEX(answer.questionID), 1, 8),
										SUBSTR(HEX(answer.questionID), 9, 4),
										SUBSTR(HEX(answer.questionID), 13, 4),
										SUBSTR(HEX(answer.questionID), 17, 4),
										SUBSTR(HEX(answer.questionID), 21)
									)) AS qID, answer.answerDescription, answer.answerExplanation, answer.isCorrect FROM answer) AS s WHERE s.qID = ${requestBody.questionID}`;
		if(!answers || answers.length !== 4)
			throw new Error(`Answers query failed for questiondID: ${requestBody.questionID}.`);

		return new Response(
			JSON.stringify({
				data: answers,
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
