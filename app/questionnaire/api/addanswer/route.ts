import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const requestText = await request.text();
    const requestBody: {
			questionID: string;
			answer: string;
			explanation: string;
			isCorrect: string;
		} = JSON.parse(requestText);

    const uuid = uuidv4();

    await prisma.$queryRaw`INSERT INTO answer (answerID, questionID, answerDescription, answerExplanation, isCorrect) VALUES (UUID_TO_BIN(${uuid}), UUID_TO_BIN(${requestBody.questionID}), ${requestBody.answer}, ${requestBody.explanation}, ${requestBody.isCorrect})`;

    return new Response(
      JSON.stringify({
        data: null,
        status: 201,
      }),
    );
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({
        data: null,
        status: 501,
      }),
    );
  }
}
