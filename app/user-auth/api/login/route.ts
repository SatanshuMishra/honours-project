import prisma from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { student } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const requestText = await request.text();
    const requestBody: {
      reqUsername: string;
      reqPassword: string;
    } = JSON.parse(requestText);
    const [{ studentID, password }] = await prisma.$queryRaw<
      student[]
    >`SELECT * FROM student WHERE username = ${requestBody.reqUsername}`;
    if (studentID) {
      if (await bcrypt.compare(requestBody.reqPassword, password)) {
        console.log("Verified!");
        const token = jwt.sign(
          { studentID: studentID },
          process.env.JWT_SECRET,
          {
            expiresIn: "5s",
          }
        );

        return new Response(
          JSON.stringify({
            token,
            status: 201,
          })
        );
      } else {
        console.log("Not Verified");
        return new Response(
          JSON.stringify({
            token: null,
            status: 401,
          })
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          token: null,
          status: 401,
        })
      );
    }
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({
        token: null,
        status: 501,
      })
    );
  }
}
