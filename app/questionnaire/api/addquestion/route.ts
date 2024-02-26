import prisma from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const requestText = await request.text();
    const requestBody: {
      topic: string;
      difficulty: number;
      question: string;
      bloomTaxonomy: string;
      timeTakenSeconds: number;
      code?: string;
    } = JSON.parse(requestText);

    const uuid = uuidv4();

    await prisma.$queryRaw`INSERT INTO question (questionID, topicID, difficulty, modDifficulty, question, questionTaxonomy, timeTakenSeconds, modTimeTakenSeconds, code) VALUES (UUID_TO_BIN(${uuid}), UUID_TO_BIN("e0f84083-8286-4d3f-8d02-059a6d071613"), ${requestBody.difficulty}, ${requestBody.difficulty}, ${requestBody.question}, 2, ${requestBody.timeTakenSeconds}, ${requestBody.timeTakenSeconds}, ${requestBody.code})`;

    return new Response(
      JSON.stringify({
        data: { questionID: uuid },
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
