import prisma from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Answer from "@/app/types/answer";

export async function POST(request: NextRequest) {
  try {
    const requestText = await request.text();
    const requestBody: {
      questionID: string;
    } = JSON.parse(requestText);

    let answers: Answer[] =
      await prisma.$queryRaw`SELECT * FROM (SELECT BIN_TO_UUID(answerID) AS answerID, BIN_TO_UUID(questionID) AS questionID, answerDescription, answerExplanation, isCorrect FROM answer) AS ans WHERE ans.questionID = ${requestBody.questionID}`;
    if (!answers || answers.length !== 4)
      throw new Error(
        `Answers query failed for questiondID: ${requestBody.questionID}.`,
      );

    return new Response(
      JSON.stringify({
        data: answers,
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
