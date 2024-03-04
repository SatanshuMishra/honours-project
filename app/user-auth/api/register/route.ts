import prisma from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const requestText = await request.text();
    const requestBody = JSON.parse(requestText);

    // const uuid = Buffer.from(uuidv4().replace(/-/g, ''), 'hex');
    const uuid = uuidv4();

    const result =
      await prisma.$queryRaw`INSERT INTO student (studentId, name, username, password, completedBonusContent) VALUES (UUID_TO_BIN(${uuid}), ${
        requestBody.name
      }, ${requestBody.username}, ${bcrypt.hashSync(
        requestBody.password,
        10,
      )}, 0)`;

    return new Response(
      JSON.stringify({
        data: { result },
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
