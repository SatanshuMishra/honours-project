import { NextRequest } from "next/server";
import prisma from "../../../lib/prisma";
import CryptoJS from "crypto-js";
const { HmacSHA256 } = CryptoJS;
import { createSecretKey } from "crypto";
import { jwtVerify } from "jose";
import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";

const resetPasswordSchema = z.object({
	token: z.string().min(1, "Token is required"),
	password: z.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[0-9]/, "Password must contain at least one number")
});

type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

function createResponse(status: number, message: string, data: any = null) {
	return new Response(
		JSON.stringify({
			status,
			data,
			message
		}),
		{
			status,
			headers: { "Content-Type": "application/json" }
		}
	);
}

export async function POST(request: NextRequest) {
	try {
		if (!process.env.JWT_SECRET) {
			console.error("JWT_SECRET is not configured");
			return createResponse(500, "Server configuration error");
		}

		if (!process.env.PASSWORD_ENCRYPTION_KEY) {
			console.error("PASSWORD_ENCRYPTION_KEY is not configured");
			return createResponse(500, "Server configuration error");
		}

		let requestBody: ResetPasswordRequest;
		try {
			const requestText = await request.text();
			requestBody = JSON.parse(requestText);
		} catch (error) {
			console.error("JSON parse error:", error);
			return createResponse(400, "Invalid request format");
		}

		const validationResult = resetPasswordSchema.safeParse(requestBody);
		if (!validationResult.success) {
			return createResponse(
				422,
				validationResult.error.issues[0].message
			);
		}

		const { token, password } = validationResult.data;

		let username: string;
		try {
			const secret = createSecretKey(process.env.JWT_SECRET, 'utf-8');
			const { payload } = await jwtVerify(token, secret);

			if (typeof payload?.username !== 'string') {
				console.error("Invalid payload structure:", payload);
				return createResponse(403, "Invalid token structure");
			}

			username = payload.username;
		} catch (error: any) {
			console.error("JWT verification error:", error);
			if (error.code === 'ERR_JWT_EXPIRED') {
				return createResponse(401, "Reset token has expired");
			}
			return createResponse(403, "Invalid reset token");
		}

		const sanitizationConfig = {
			ALLOWED_TAGS: [],
			KEEP_CONTENT: false,
			ALLOWED_ATTR: []
		};

		const purePassword = DOMPurify.sanitize(
			password,
			sanitizationConfig
		).trim();

		if (!purePassword || purePassword !== password) {
			return createResponse(403, "Malicious content detected in password");
		}

		const hashedPassword = HmacSHA256(
			purePassword,
			process.env.PASSWORD_ENCRYPTION_KEY
		).toString();

		try {
			await prisma.$queryRaw`
        UPDATE student 
        SET password = ${hashedPassword}
        WHERE username = ${username}
      `;

			return createResponse(
				200,
				"Password changed successfully!",
				null
			);

		} catch (dbError) {
			console.error("Database error:", dbError);
			return createResponse(500, "Failed to update password");
		}

	} catch (error) {
		console.error("Unexpected error:", error);
		return createResponse(
			500,
			"An unexpected error occurred while processing your request"
		);
	}
}
