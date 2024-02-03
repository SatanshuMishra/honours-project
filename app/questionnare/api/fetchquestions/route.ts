import prisma from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { student } from "@prisma/client";

export async function POST(request: NextRequest) {
	try {
		let questions =
			await prisma.$queryRaw`SELECT * FROM question ORDER BY RAND() LIMIT 20`;

		return new Response(
			JSON.stringify({
				data: { questions },
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
