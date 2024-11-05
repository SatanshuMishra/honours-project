import { NextRequest } from "next/server";
import { SignJWT } from "jose";
import { createSecretKey } from "crypto";
import prisma from "../../../lib/prisma";
import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";

const credentialsSchema = z.object({
  fullname: z.string()
    .min(1, "Full name is required")
    .max(100, "Full name is too long")
    .regex(/^[a-zA-Z\s-']+$/, "Full name contains invalid characters"),
  username: z.string()
    .min(1, "Username is required")
    .max(50, "Username is too long")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username contains invalid characters")
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    let requestBody;
    
    try {
      requestBody = JSON.parse(rawBody);
    } catch {
      return createResponse(422, false, null, "Invalid JSON payload");
    }

    const validationResult = credentialsSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return createResponse(
        422,
        false,
        null,
        `Validation failed: ${validationResult.error.issues[0].message}`
      );
    }

    const { fullname, username } = validationResult.data;

    const sanitizationConfig = { 
      ALLOWED_TAGS: [], 
      KEEP_CONTENT: false,
      ALLOWED_ATTR: [] 
    };

    const pureUsername = DOMPurify.sanitize(username, sanitizationConfig).trim();
    const pureFullName = DOMPurify.sanitize(fullname, sanitizationConfig).trim();

    if (!pureUsername || pureUsername !== username) {
      return createResponse(403, false, null, "Malicious text detected in username");
    }

    if (!pureFullName || pureFullName !== fullname) {
      return createResponse(403, false, null, "Malicious text detected in full name");
    }

    const student = await prisma.student.findFirst({
      where: {
        AND: [
          { username: pureUsername },
          { name: pureFullName }
        ]
      },
      select: {
        studentID: true
      }
    });

    if (!student) {
      return createResponse(
        400, 
        false, 
        null, 
        "No student matching the provided credentials was found"
      );
    }

    const secret = createSecretKey(
      process.env.JWT_SECRET || "", 
      'utf-8'
    );

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return createResponse(500, false, null, "Server configuration error");
    }

    const jws = await new SignJWT({
      fullname: pureFullName,
      username: pureUsername
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setSubject('Password Reset Claim')
      .setExpirationTime('5m')
      .sign(secret);

    if (!jws) {
      return createResponse(400, false, null, "Token failed to generate");
    }

    return createResponse(202, true, jws, "User was successfully verified");

  } catch (error) {
    console.error('Validation error:', error);
    return createResponse(
      500, 
      false, 
      null, 
      "An unexpected error occurred while processing your request"
    );
  }
}

// Helper function to create consistent response objects
function createResponse(
  status: number,
  validated: boolean,
  token: string | null,
  message: string
) {
  return new Response(
    JSON.stringify({
      status,
      data: {
        validated,
        token,
      },
      message
    })
  );
}
