import prisma from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Student from "@/app/types/student";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const requestText = await request.text();
    const requestBody: {
      reqUsername: string;
      reqPassword: string;
    } = JSON.parse(requestText);
    const [{ studentID, name, username, password }] = await prisma.$queryRaw<
      Student[]
    >`SELECT BIN_TO_UUID(studentID) AS studentID, name, username, password FROM student WHERE username = ${requestBody.reqUsername}`;
    console.log(studentID, name, username, password);
    if (studentID) {
      if (await bcrypt.compare(requestBody.reqPassword, password)) {
        // PASSWORD VERIFIED.
        const payload = {
          studentID: studentID,
          name: name,
          username: username,
        };

        let token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });

        console.log("[SIGN IN | TOKEN]: ", token);

        return new Response(
          JSON.stringify({
            token,
            status: 201,
          }),
        );
      } else {
        console.log("Not Verified");
        return new Response(
          JSON.stringify({
            token: null,
            status: 401,
          }),
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          token: null,
          status: 401,
        }),
      );
    }
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({
        token: null,
        status: 501,
      }),
    );
  }
}
