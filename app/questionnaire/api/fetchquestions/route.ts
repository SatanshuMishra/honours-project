import Question from "@/app/types/question";
import prisma from "../../../lib/prisma";

import sendStatisticsForProcessing from "@/app/scripts/statsProcess";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody: {
			studentID: string;
		} = JSON.parse(requestText);

		console.info("[getQuestion] Data Received: ", requestBody);

		let studentKnowledge =
			await prisma.$queryRaw`SELECT BIN_TO_UUID(topicID), BIN_TO_UUID(categoryID), masteryProbability FROM studentKnowledge WHERE studentID = ${requestBody.studentID}`;

		let questions: [Question[]] = await prisma.$queryRaw`SELECT BIN_TO_UUID(q.questionID) AS questionID, q.difficulty, q.question, q.code FROM question q
			JOIN studentKnowledge sk ON q.topicID = sk.topicID AND q.categoryID = sk.categoryID WHERE sk.masteryProbability BETWEEN 0.4 AND 0.7 ORDER BY RAND() LIMIT 20`;

		if (!questions || questions.length !== 20)
			throw new Error("Incorrect Question Query.");

		/* console.log("QUESTIONS: ", questions); */

		return new Response(
			JSON.stringify({
				data: questions,
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
