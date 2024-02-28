import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

async function fetchTaxonomyCategory(
	taxonomyCategory: string
): Promise<string | void> {
	try {
		const category: { categoryID: string }[] =
			await prisma.$queryRaw`SELECT BIN_TO_UUID(categoryID) AS categoryID FROM taxonomyCategory WHERE name = ${taxonomyCategory}`;

		// [GUARD] FAILURE TO FECTH CATEGORY
		if (category.length === 0)
			throw new Error("Taxonomy Category doesn't exit.");

		return category[0].categoryID;
	} catch (e) {
		console.log(e);
		return;
	}
}

async function handleTopic(topicName: string): Promise<string | void> {
	try {
		const topic: { topicID: string }[] =
			await prisma.$queryRaw`SELECT BIN_TO_UUID(topicID) AS topicID FROM questionTopic WHERE name = ${topicName}`;

		console.info("Topic Returned: ", topic);

		let topicID;

		// [GUARD] IF TOPIC DOESN'T EXIST, ADD IT TO questionTopic RELATION.
		if (topic.length === 0) {
			topicID = uuidv4();
			await prisma.$queryRaw`INSERT INTO questionTopic (topicID, name) VALUES (UUID_TO_BIN(${topicID}), ${topicName})`;
		}

		if (topic.length > 1)
			throw new Error("More than one topic row returned. Contact Admin.");

		topicID = topic[0].topicID;

		return topicID;
	} catch (e) {
		console.log(e);
		return;
	}
}

async function handleKnowledge(
	studentID: string,
	topicID: string,
	taxonomyCategoryID: string
): Promise<string | void> {
	console.info("[handleKnowledge] Received Data: ", {
		studentID,
		topicID,
		taxonomyCategoryID,
	});

	const knowledgeRows: {
		knowledgeID: string;
	}[] =
		await prisma.$queryRaw`SELECT BIN_TO_UUID(knowledgeID) AS knowledgeID FROM studentKnowledge WHERE studentID = UUID_TO_BIN(${studentID}) AND topicID = UUID_TO_BIN(${topicID}) AND categoryID = UUID_TO_BIN(${taxonomyCategoryID})`;

	console.info("[handleKnowledge] Received Knowledge Rows: ", knowledgeRows);

	let knowledgeID;
	if (knowledgeRows.length === 0) {
		knowledgeID = uuidv4();
		await prisma.$queryRaw`INSERT INTO studentKnowledge (knowledgeID, studentID, topicID, categoryID, masteryProbability) VALUES (UUID_TO_BIN(${knowledgeID}), UUID_TO_BIN(${studentID}), UUID_TO_BIN(${topicID}), UUID_TO_BIN(${taxonomyCategoryID}), 0.5)`;
	}

	if (knowledgeRows.length > 1)
		throw new Error("More than one knowledge row returned. Contact Admin.");

	knowledgeID = knowledgeRows[0].knowledgeID;

	console.info("[handleKnowledge] KnowledgeID: ", knowledgeID);
	return knowledgeID;
}

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody: {
			studentID: string;
			topic: string;
			difficulty: number;
			question: string;
			taxonomyCategory: string;
			timeTakenSeconds: number;
			code?: string;
		} = JSON.parse(requestText);

		console.info("Data Recieved: ", requestBody);

		const questionID = uuidv4();

		const taxonomyCategoryID = await fetchTaxonomyCategory(
			requestBody.taxonomyCategory
		);

		// [GUARD]
		if (!taxonomyCategoryID)
			throw new Error("Error fetching taxonomy category id.");

		const topicID: string | void = await handleTopic(requestBody.topic);

		// [GUARD]
		if (!topicID) throw new Error("Error fetching topic id.");

		const knowledgeID: string | void = await handleKnowledge(
			requestBody.studentID,
			topicID,
			taxonomyCategoryID
		);

		// [GUARD]
		if (!knowledgeID) throw new Error("Error adding knowledge");

		await prisma.$queryRaw`INSERT INTO question (questionID, topicID, difficulty, modDifficulty, question, categoryID, timeTakenSeconds, modTimeTakenSeconds, code) VALUES (UUID_TO_BIN(${questionID}), UUID_TO_BIN(${topicID}), ${requestBody.difficulty}, ${requestBody.difficulty}, ${requestBody.question}, UUID_TO_BIN(${taxonomyCategoryID}), ${requestBody.timeTakenSeconds}, ${requestBody.timeTakenSeconds}, ${requestBody.code})`;

		console.info("QuestionID Returned: ", questionID);

		return new Response(
			JSON.stringify({
				data: { questionID: questionID },
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
