import prisma from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody = JSON.parse(requestText);

		const uuid = uuidv4();

		await prisma.$queryRaw`INSERT INTO question (questionID, difficulty, question, code) VALUES (UUID_TO_BIN(${uuid}), ${requestBody.difficulty}, ${requestBody.question}, ${requestBody.code})`;

		return new Response(
			JSON.stringify({
				data: { questionID: uuid },
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
