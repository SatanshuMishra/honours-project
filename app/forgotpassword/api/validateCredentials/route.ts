import { NextRequest } from "next/server";
import {CompactSign} from "jose";
import { createSecretKey } from "crypto";
import prisma from "../../../lib/prisma";
import Student from "@/app/types/student";
const DOMPurify = require("isomorphic-dompurify");

export async function POST(request: NextRequest) {

	//  NOTE: VALIDATE REQUEST BODY

	const requestText = await request.text();
	const requestBody: {
		fullname: string;
		username: string;
	} = JSON.parse(requestText);

	if (!requestBody.fullname) return new Response(
			JSON.stringify({
				status: 422,
				data: {
					validated: false,
					token: null,
				},
				message: `Missing student fullname.`
			})
		)

	if (!requestBody.username) return new Response(
			JSON.stringify({
				status: 422,
				data: {
					validated: false,
					token: null,
				},
				message: `Missing student username.`
			})
		)

	//  NOTE:: PURIFY REQUEST BODY

	const sanitizationConfig = { ALLOWED_TAGS: [], KEEP_CONTENT: false };
	const pureUsername = DOMPurify.sanitize(
		requestBody.username,
		sanitizationConfig
	);

	const pureFullName = DOMPurify.sanitize(
		requestBody.fullname,
		sanitizationConfig
	);

	if (!pureUsername) return new Response(
		JSON.stringify({
			status: 403,
			data: {
				validated: false,
				token: null,
			},
			message: "Malicious text detected in student username."
		})
	)


	if (!pureFullName) return new Response(
		JSON.stringify({
			status: 403,
			data: {
				validate: false,
				token: null,
			},
			message: "Malicious text detected in student fullname."
		})
	)

	const student = await prisma.$queryRaw<
		Student[]
	>`SELECT BIN_TO_UUID(studentID) AS studentID FROM student WHERE username = ${pureUsername} AND name = ${pureFullName}`;

	if (student.length !== 0) {
		if (student.length === 1) {
			//  NOTE: CREATE JWT TOKEN & SET SESSION

			const secret = createSecretKey(process.env.JWT_SECRET || "Wee", 'utf-8');
			const jws = await new CompactSign(
				new TextEncoder().encode(JSON.stringify({
					pureFullName,
					pureUsername
				}))
			).setProtectedHeader({ alg: `HS256` }).sign(secret);

			console.log(jws);

			//  NOTE: CHECK IF JWS GENERATED

			if(!jws) return new Response (
				JSON.stringify({
					status: 400,
					data: {
						validated: false,
						token: null,
					},
					message: "Token failed to generate."
				})
			)

			return new Response
				(
					JSON.stringify({
						status: 202,
						data: {
							validated: true,
							token: jws,
						},
						message: "User was successfully verified."
					})
				)
		} else {
			// Make note of system breaking error in database
		}
	} else {
		return new Response(
			JSON.stringify({
				status: 400,
				data: {
					validated: false,
					token: null,
				},
				message: "No student matching the provided credentials was found."
			})
		)
	}
}
