import { NextRequest } from "next/server";
import prisma from "../../../lib/prisma";
import {HmacSHA256} from "crypto-js";
import { createSecretKey } from "crypto";
import { jwtVerify } from "jose";
import DOMPurify from "isomorphic-dompurify";


export async function POST(request: NextRequest) {
	const requestText = await request.text();
	const requestBody: {
		token: string;
		password: string;
	} = JSON.parse(requestText);

	if (!requestBody.token) {
		return new Response(
			JSON.stringify({
				status: 422,
				data: null,
				message: `Missing token.`
			})
		)
	}

	if (!requestBody.password) {
		return new Response(
			JSON.stringify({
				status: 422,
				data: null,
				message: `Missing password.`
			})
		)
	}
	try {
		const secret = createSecretKey(process.env.JWT_SECRET || "Wee", 'utf-8');
		//eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { payload, _ } = await jwtVerify(requestBody.token, secret)

		console.log(`Payload Data: `, payload)

	const sanitizationConfig = { ALLOWED_TAGS: [], KEEP_CONTENT: false };

	const purePassword = DOMPurify.sanitize(
		requestBody.password,
		sanitizationConfig
	);

	if (!purePassword) {
		return new Response(
			JSON.stringify({
				status: 403,
				data: null,
				message: `Malicious text detected in password input.`
			})
		)
	}

	const result =
		await prisma.$queryRaw`UPDATE student SET password = ${HmacSHA256(
			purePassword,
			process.env.PASSWORD_ENCRYPTION_KEY || "Weee"
		).toString()} WHERE username = ${payload.username}`;

	console.log(result);

	return new Response(
		JSON.stringify({
			data: null,
			status: 200,
			message: `Password changed successfully!`
		})
	)
	} catch(error) {
		return new Response(
			JSON.stringify({
				status: 403,
				data: null,
				message: `JWT Error. ${error}`
			})
		)

	}
}
