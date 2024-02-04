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
		let student: [Student] = await prisma.$queryRaw`SELECT * FROM (SELECT
				LOWER(CONCAT(
				SUBSTR(HEX(studentID), 1, 8),
				SUBSTR(HEX(studentID), 9, 4),
				SUBSTR(HEX(studentID), 13, 4),
				SUBSTR(HEX(studentID), 17, 4),
				SUBSTR(HEX(studentID), 21)
			)) AS studentID, name, username FROM student) AS s WHERE s.studentID = ${requestBody.studentID}`;

		if (student.length !== 1)
			throw new Error(
				"Multiple Student's Returned! Contact Administration."
			);

		return new Response(
			JSON.stringify({
				data: { ...student[0] },
				status: 200,
			})
		);
	} catch (e) {
		return new Response(
			JSON.stringify({
				data: null,
				status: 400,
			})
		);
	}
}
