import prisma from "../../../lib/prisma";
import { NextRequest} from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody: {
			studentID: any;
			questionID: any;
			chosenAnswerID: any;
			isCorrect: boolean;
			timeToAnswer: number;
			recordedDifficulty: number | null;
		} = JSON.parse(requestText);

		const newUuid = uuidv4();

		const uuidStudentID: any = requestBody.studentID.map(code => String.fromCharCode(code)).join('');
		const uuidQuestionID: any = requestBody.questionID.map(code => String.fromCharCode(code)).join('');
		const uuidChosenAnswer: any = requestBody.answerID.map(code => String.fromCharCode(code)).join('');

		console.log('VAAAA: ', uuidStudentID, uuidQuestionID, uuidChosenAnswer);

		await prisma.$queryRaw`INSERT INTO statistic (statID, studentID, questionID, chosenAnswerID, isCorrect, timeToAnswer, recordedDifficulty) VALUES (${newUuid}, ${uuidStudentID}, ${uuidQuestionID}, ${uuidChosenAnswer}, ${requestBody.isCorrect}, ${requestBody.timeToAnswer}, ${requestBody.recordedDifficulty})`;

		return new Response(
			JSON.stringify({
				data: null,
				status: 200,
			})
		);
	} catch (e) {
		console.log(e);
		return new Response(
			JSON.stringify({
				data: null,
				status: 400,
			})
		);
	}
}
