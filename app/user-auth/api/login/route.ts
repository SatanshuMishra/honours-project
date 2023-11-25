import prisma from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { student } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const requestText = await request.text();
    const requestBody: {
      username: string;
      password: string;
    } = JSON.parse(requestText);
    const [{ username }] = await prisma.$queryRaw<
      student[]
    >`SELECT * FROM student WHERE username = ${requestBody.username} AND password = ${requestBody.password}`;
    console.log(username);
    if (username) {
      return new Response(
        JSON.stringify({
          data: { username },
          status: 201,
        })
      );
    } else {
      return new Response(
        JSON.stringify({
          data: null,
          status: 401,
        })
      );
    }
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
