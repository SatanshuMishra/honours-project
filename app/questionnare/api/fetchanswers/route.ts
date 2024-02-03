import prisma from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { answer } from "@prisma/client";

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody: {
			questionID: string;
		} = JSON.parse(requestText);
		console.log(requestBody.questionID);
		let answers =
			await prisma.$queryRaw`SELECT * FROM answer WHERE answer.questionID = '4d0fca20-101a-4ded-aae5-4acba0b13b57' ORDER BY RAND()`;

		//console.log(answers);

		return new Response(
			JSON.stringify({
				data: { answers },
				status: 201,
			})
		);
	} catch (e) {
		console.log(e);
		return new Response(
			JSON.stringify({
				data: null,
				status: 501,
			})
		);
	}
}
