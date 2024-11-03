import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

// Define schema for request body validation
const requestBodySchema = z.object({
	questionID: z.string().uuid(),
	answer: z.string(),
	explanation: z.string(),
	isCorrect: z.boolean(),
});

/**
 * Handles POST request to insert a new answer for a question
 * @param request HTTP request
 * @returns HTTP response with status 201 on success or an error status
 */
export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody = requestBodySchema.parse(JSON.parse(requestText));

		const answerID = uuidv4();

		await prisma.$queryRawUnsafe(
			`INSERT INTO answer (answerID, questionID, answerDescription, answerExplanation, isCorrect)
			 VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?)`,
			answerID,
			requestBody.questionID,
			requestBody.answer,
			requestBody.explanation,
			requestBody.isCorrect
		);

		return new Response(
			JSON.stringify({
				data: null,
				status: 201,
			}),
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		const statusCode = error instanceof z.ZodError ? 400 : 500;
		return new Response(
			JSON.stringify({
				data: null,
				status: statusCode,
			}),
			{ status: statusCode }
		);
	}
}
