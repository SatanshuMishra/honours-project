import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

const logger = require("pino")();

async function handleTopic(name: string): Promise<string> {
	try {
		const topic: { topicID: string }[] =
			await prisma.$queryRaw`SELECT BIN_TO_UUID(topicID) AS topicID FROM questionTopic WHERE name = ${name}`;

		console.info("Topic Response: ", topic);

		if (topic.length === 0) {
			const uuid = uuidv4();
			await prisma.$queryRaw`INSERT INTO questionTopic (topicID, name) VALUES (UUID_TO_BIN(${uuid}), ${name})`;
			return uuid;
		}

		if (topic.length > 1) return "";

		return topic[0].topicID;
	} catch (e) {
		console.log(e);
		return "";
	}
}

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody: {
			topic: string;
			difficulty: number;
			question: string;
			bloomTaxonomy: string;
			timeTakenSeconds: number;
			code?: string;
		} = JSON.parse(requestText);

		const uuid = uuidv4();
		const topicID = await handleTopic(requestBody.topic);

		await prisma.$queryRaw`INSERT INTO question (questionID, topicID, difficulty, modDifficulty, question, questionTaxonomy, timeTakenSeconds, modTimeTakenSeconds, code) VALUES (UUID_TO_BIN(${uuid}), UUID_TO_BIN(${topicID}), ${requestBody.difficulty}, ${requestBody.difficulty}, ${requestBody.question}, 2, ${requestBody.timeTakenSeconds}, ${requestBody.timeTakenSeconds}, ${requestBody.code})`;

		return new Response(
			JSON.stringify({
				data: { questionID: uuid },
				status: 201,
			})
		);
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
