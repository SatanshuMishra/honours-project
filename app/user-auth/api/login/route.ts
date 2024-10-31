import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import Student from "@/app/types/student";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import DOMPurify from "isomorphic-dompurify";
const HmacSHA256 = CryptoJS.HmacSHA256;
import verifyJWT from "@/app/scripts/verifyJWT";

export async function POST(request: NextRequest) {
	try {
		verifyJWT(false).then((response) => {
			if (response === true) {
				return new Response(
					JSON.stringify({
						data: null,
						status: 418,
						message:
							"A valid token already exists. Registration failed.",
						pgErrorObject: null,
					})
				);
			}
		});

		const requestText = await request.text();
		const requestBody: {
			username: string;
			password: string;
		} = JSON.parse(requestText);

		//  INFORMATION: CHECK IF THE INPUTS ARE EMPTY

		if (requestBody.username === "" || requestBody.password === "") {
			return new Response(
				JSON.stringify({
					data: null,
					status: 400,
					message: `Missing field values.`,
					pgErrorObject: null,
				})
			);
		}

		//  INFORMATION: SANITIZE INPUTS. IF OUTPUT IS EMPTY, THROW ERROR

		const sanitizationConfig = { ALLOWED_TAGS: [], KEEP_CONTENT: false };
		const pureUsername = DOMPurify.sanitize(
			requestBody.username,
			sanitizationConfig
		);
		const purePassword = DOMPurify.sanitize(
			requestBody.password,
			sanitizationConfig
		);

		if (pureUsername === "") {
			return new Response(
				JSON.stringify({
					data: null,
					status: 422,
					message:
						"Your input for 'Username' could not be processed due to security concerns. Please simplify your entries and resubmit.",
					pgErrorObject: null,
				})
			);
		}

		if (purePassword === "") {
			return new Response(
				JSON.stringify({
					data: null,
					status: 422,
					message:
						"Your input for 'Password' could not be processed due to security concerns. Please simplify your entries and resubmit.",
					pgErrorObject: null,
				})
			);
		}

		const student = await prisma.$queryRaw<
			Student[]
		>`SELECT BIN_TO_UUID(studentID) AS studentID, name, username FROM student WHERE username = ${pureUsername} AND password = ${HmacSHA256(
			purePassword,
			process.env.PASSWORD_ENCRYPTION_KEY || "Weee"
		).toString()}`;

		if (student.length !== 0) {

			//  INFORMATION: PASSWORD VERIFIED.

			const payload = {
				studentID: student[0].studentID,
				name: student[0].name,
				username: student[0].username,
			};

			const token = jwt.sign(payload, process.env.JWT_SECRET, {
				expiresIn: "2h",
			});

			return new Response(
				JSON.stringify({
					data: token,
					status: 201,
					message: `${student[0].username} sign-in was successfully.`,
					pgErrorObject: null,
				})
			);
		} else {
			return new Response(
				JSON.stringify({
					data: null,
					status: 401,
					message: `User couldn't be verified becasuse of invalid password. Sign-in was not successfully.`,
					pgErrorObject: null,
				})
			);
		}
	} catch (error: any) {
		console.error(error);
		return new Response(
			JSON.stringify({
				data: null,
				status: 500,
				message: `User couldn't be verified. Sign-in was not successfully.`,
				pgErrorObject: {
					...error,
				},
			})
		);
	}
}
