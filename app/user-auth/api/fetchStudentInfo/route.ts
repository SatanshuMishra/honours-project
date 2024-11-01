import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import Student from "@/app/types/student";

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody: {
			studentID: string;
		} = JSON.parse(requestText);
		console.log(requestBody.studentID);
		const student: Student[] =
			await prisma.$queryRaw`SELECT BIN_TO_UUID(studentID) AS studentID, name, username, completedBonusContent FROM student WHERE student.studentID = ${requestBody.studentID}`;

		if (student.length !== 1)
			throw new Error("Multiple Student's Returned! Contact Administration.");

		return new Response(
			JSON.stringify({
				data: { ...student[0] },
				status: 200,
			}),
		);
	} catch (e) {
		console.log(e);
		return new Response(
			JSON.stringify({
				data: null,
				status: 400,
			}),
		);
	}
}
