import prisma from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const requestText = await request.text();
    const requestBody = JSON.parse(requestText);
    const result =
      await prisma.$queryRaw`INSERT INTO student (studentId, name, username, password, completedBonusContent) VALUES (UNHEX(REPLACE(UUID(), '-', '')), ${requestBody.name}, ${requestBody.username}, ${requestBody.password}, 0)`;
    return new Response(
      JSON.stringify({
        data: { result },
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
