import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
const DOMPurify = require("isomorphic-dompurify");
const HmacSHA256 = CryptoJS.HmacSHA256;
import verifyJWT from "@/app/scripts/verifyJWT";
import TaxonomyCategory from "@/app/types/taxonomyCategory";
import QuestionTopic from "@/app/types/questionTopic";

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
			name: string;
			username: string;
			password: string;
		} = JSON.parse(requestText);

		const sanitizationConfig = { ALLOWED_TAGS: [], KEEP_CONTENT: false };
		const pureName = DOMPurify.sanitize(
			requestBody.name,
			sanitizationConfig
		);
		const pureUsername = DOMPurify.sanitize(
			requestBody.username,
			sanitizationConfig
		);
		const purePassword = DOMPurify.sanitize(
			requestBody.password,
			sanitizationConfig
		);

		if (pureName === "") {
			return new Response(
				JSON.stringify({
					data: null,
					status: 422,
					message:
						"Your input for 'Name' could not be processed due to security concerns. Please simplify your entries and resubmit.",
					pgErrorObject: null,
				})
			);
		}

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

		const code: {
			isRegistered: boolean;
		}[] =
			await prisma.$queryRaw`SELECT isRegistered FROM studentCode WHERE code = ${pureUsername}`;

		if (code.length != 1)
			throw new Error(
				`Something went wrong with fetching student code. Length Error.`
			);

		console.log(code[0].isRegistered);

		if (code[0].isRegistered)
			throw new Error(`Student Code is already in use!`);

		const uuid = uuidv4();

		const result =
			await prisma.$queryRaw`INSERT INTO student (studentID, name, username, password, completedBonusContent) VALUES (UUID_TO_BIN(${uuid}), ${pureName}, ${pureUsername}, 
				${HmacSHA256(
					purePassword,
					process.env.PASSWORD_ENCRYPTION_KEY || "Weee"
				).toString()}, 0)`;

		const topics: {
			topicID: QuestionTopic["topicID"];
		}[] =
			await prisma.$queryRaw`SELECT BIN_TO_UUID(topicID) AS topicID FROM questionTopic`;

		

		const taxonomyCategories: {
			categoryID: TaxonomyCategory["categoryID"];
		}[] =
			await prisma.$queryRaw`SELECT BIN_TO_UUID(categoryID) AS categoryID FROM taxonomyCategory`;

		for (let topic of topics) {
			for (let category of taxonomyCategories) {
				console.log(`Topic: ${topic}, Category: ${category}`);
				let knowledgeID = uuidv4();
				await prisma.$queryRaw`INSERT INTO studentKnowledge (knowledgeID, studentID, topicID, categoryID) VALUES (UUID_TO_BIN(${knowledgeID}), UUID_TO_BIN(${uuid}), UUID_TO_BIN(${topic.topicID}), UUID_TO_BIN(${category.categoryID}))`;
			}
		}

		return new Response(
			JSON.stringify({
				data: { result },
				status: 201,
				message: `${pureUsername} was signed-up successfully.`,
				pgErrorObject: null,
			})
		);
	} catch (error: any) {
		console.log(error);
		return new Response(
			JSON.stringify({
				data: null,
				status: 500,
				message: `Sign-up failed.`,
				pgErrorObject: {
					...error,
				},
			})
		);
	}
}
