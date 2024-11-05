import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const requestBodySchema = z.object({
	studentID: z.string().uuid(),
	questionID: z.string().uuid(),
	reason: z.string(),
	details: z.string()
});

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody = requestBodySchema.parse(JSON.parse(requestText));
		const { studentID, questionID, reason, details } = requestBody;
		const reportID = uuidv4();

		await prisma.$queryRawUnsafe(
			`INSERT INTO question_reports (report_id, report_by, question_id, reason, details) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?)`,
			reportID,
			studentID,
			questionID,
			reason, 
			details
		);

		return new Response(JSON.stringify({ data: null, status: 201 }), {
			status: 201,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ data: null, status: 500 }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});

	}
}
