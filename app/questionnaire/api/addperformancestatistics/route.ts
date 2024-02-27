import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const requestText = await request.text();
    const requestBody: {
      studentID: string;
      questionID: string;
      chosenAnswerID: string;
      isCorrect: boolean;
      timeToAnswer: number;
      recordedDifficulty: number | null;
    } = JSON.parse(requestText);

    console.log(requestBody);

    const uuid = uuidv4();

    await prisma.$queryRaw`INSERT INTO statistic (statID, studentID, questionID, chosenAnswerID, isCorrect, timeToAnswer, recordedDifficulty) VALUES (UUID_TO_BIN(${uuid}), UUID_TO_BIN(${requestBody.studentID}), UUID_TO_BIN(${requestBody.questionID}), UUID_TO_BIN(${requestBody.chosenAnswerID}), ${requestBody.isCorrect}, ${requestBody.timeToAnswer}, ${requestBody.recordedDifficulty})`;

    if (requestBody.isCorrect)
      await prisma.$queryRaw`UPDATE question SET modDifficulty = modDifficulty - 0.05 WHERE questionID = UUID_TO_BIN(${requestBody.questionID})`;
    else
      await prisma.$queryRaw`UPDATE question SET modDifficulty = modDifficulty + 0.1 WHERE questionID = UUID_TO_BIN(${requestBody.questionID})`;

    return new Response(
      JSON.stringify({
        data: null,
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
