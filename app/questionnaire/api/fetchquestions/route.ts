import Question from "@/app/types/question";
import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody: {
			studentID: string;
		} = JSON.parse(requestText);

		let questions: Question[] =
			await prisma.$queryRaw`SELECT BIN_TO_UUID(q.questionID) AS questionID, q.assignedDifficulty, q.question, q.code FROM question q
			JOIN studentKnowledge sk ON q.topicID = sk.topicID AND q.categoryID = sk.categoryID WHERE sk.mastery BETWEEN 0.4 AND 0.7 ORDER BY RAND() LIMIT 20`;

		if (!questions || questions.length < 20 || questions.length > 20)
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
