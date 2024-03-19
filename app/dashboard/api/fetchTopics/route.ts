import QuestionTopic from "@/app/types/questionTopic";
import prisma from "../../../lib/prisma";

export async function POST() {
	try {
		let topics: QuestionTopic[] =
			await prisma.$queryRaw`SELECT BIN_TO_UUID(topicID) AS topicID, name FROM questionTopic`;

		if (!topics || topics.length === 0)
			return new Response(
				JSON.stringify({
					data: null,
					status: 400,
					message:
						"Something went wrong with fetching topics. Length Error.",
					pgErrorObject: null,
				})
			);

		return new Response(
			JSON.stringify({
				data: topics,
				status: 200,
				message: "Topics successfully returned.",
				pgErrorObject: null,
			})
		);
	} catch (e) {
		console.log(e);
		return new Response(
			JSON.stringify({
				data: null,
				status: 400,
				message: "Something went wrong with fetching topics.",
				pgErrorObject: e,
			})
		);
	}
}
