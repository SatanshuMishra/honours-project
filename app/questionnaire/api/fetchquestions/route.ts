import Question from "@/app/types/question";
import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody: {
			studentID: string;
			topicID: string;
		} = JSON.parse(requestText);

		console.log(requestBody);

		let questions: {
			questionID: Question["questionID"];
			modifiedDifficulty: Question["modifiedDifficulty"];
			question: Question["question"];
			code: Question["code"];
			}[]=
			await prisma.$queryRaw`SELECT BIN_TO_UUID(q.questionID) AS questionID, q.modifiedDifficulty, q.question, q.code FROM question q JOIN studentKnowledge sk ON q.topicID = sk.topicID AND q.categoryID = sk.categoryID WHERE q.topicID = UUID_TO_BIN(${requestBody.topicID}) AND sk.studentID = UUID_TO_BIN(${requestBody.studentID}) AND q.modifiedDifficulty BETWEEN sk.mastery + sk.difficultyOffset - 0.3 AND sk.mastery + sk.difficultyOffset + 0.3 ORDER BY RAND() LIMIT 20`;

		console.info(questions, questions.length);

		if (questions.length !== 20)
			return new Response(
				JSON.stringify({
					data: null,
					status: 400,
					message:
						"Something went wrong with fetching questions. Length Error.",
					pgErrorObject: null,
				})
			);

		return new Response(
			JSON.stringify({
				data: questions,
				status: 200,
				message: "Questions successfully returned.",
				pgErrorObject: null,
			})
		);
	} catch (e) {
		console.log(e);
		return new Response(
			JSON.stringify({
				data: null,
				status: 400,
				message: "Something went wrong with fetching questions.",
				pgErrorObject: e,
			})
		);
	}
}
