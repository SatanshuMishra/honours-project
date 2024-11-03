import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

// Define schema for request body validation
const requestBodySchema = z.object({
	studentID: z.string().uuid(),
	topic: z.string(),
	assignedDifficulty: z.number().min(1).max(5),
	question: z.string(),
	taxonomyCategory: z.string(),
	code: z.string().optional(),
});

// Custom error for not found cases
class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotFoundError";
	}
}

/**
 * Fetches the Taxonomy Category ID for a given category name
 * @param taxonomyCategory Category name
 * @returns Taxonomy Category ID
 */
async function fetchTaxonomyCategory(taxonomyCategory: string): Promise<string> {
	const category = await prisma.$queryRawUnsafe<{ categoryID: string }[]>(
		`SELECT BIN_TO_UUID(categoryID) AS categoryID FROM taxonomyCategory WHERE name = ?`,
		taxonomyCategory
	);
	if (category.length === 0) throw new NotFoundError("Taxonomy Category not found.");
	return category[0].categoryID;
}

/**
 * Fetches or creates a Topic ID for a given topic name
 * @param topicName Topic name
 * @returns Topic ID
 */
async function fetchOrCreateTopic(topicName: string): Promise<string> {
	const topic = await prisma.$queryRawUnsafe<{ topicID: string }[]>(
		`SELECT BIN_TO_UUID(topicID) AS topicID FROM questionTopic WHERE name = ?`,
		topicName
	);
	if (topic.length === 0) {
		const topicID = uuidv4();
		await prisma.$queryRawUnsafe(
			`INSERT INTO questionTopic (topicID, name) VALUES (UUID_TO_BIN(?), ?)`,
			topicID,
			topicName
		);
		return topicID;
	}
	if (topic.length > 1) throw new Error("Multiple topics found. Contact Admin.");
	return topic[0].topicID;
}

/**
 * Fetches or creates a Knowledge ID based on studentID, topicID, and taxonomyCategoryID
 * @param studentID Student ID
 * @param topicID Topic ID
 * @param taxonomyCategoryID Taxonomy Category ID
 * @returns Knowledge ID
 */
async function fetchOrCreateKnowledge(
	studentID: string,
	topicID: string,
	taxonomyCategoryID: string
): Promise<string> {
	const knowledgeRows = await prisma.$queryRawUnsafe<{ knowledgeID: string }[]>(
		`SELECT BIN_TO_UUID(knowledgeID) AS knowledgeID
		 FROM studentKnowledge
		 WHERE studentID = UUID_TO_BIN(?) AND topicID = UUID_TO_BIN(?) AND categoryID = UUID_TO_BIN(?)`,
		studentID,
		topicID,
		taxonomyCategoryID
	);

	if (knowledgeRows.length === 0) {
		const knowledgeID = uuidv4();
		await prisma.$transaction([
			prisma.$queryRawUnsafe(
				`INSERT INTO studentKnowledge (knowledgeID, studentID, topicID, categoryID) 
				VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?))`,
				knowledgeID,
				studentID,
				topicID,
				taxonomyCategoryID
			),
			prisma.$queryRawUnsafe(
				`INSERT INTO mastery_logs (mastery_log_id, studentID, topicID, categoryID, mastery_change, mastery_value)
				 VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), 0.0, 0.5)`,
				uuidv4(),
				studentID,
				topicID,
				taxonomyCategoryID
			),
			prisma.$queryRawUnsafe(
				`INSERT INTO student_topic_category_difficulty_log (studentLogID, studentID, topicID, categoryID, scaledDifficulty)
				 VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), 0)`,
				uuidv4(),
				studentID,
				topicID,
				taxonomyCategoryID
			),
		]);
		return knowledgeID;
	}
	if (knowledgeRows.length > 1) throw new Error("Multiple knowledge rows found.");
	return knowledgeRows[0].knowledgeID;
}

/**
 * Handles POST request to insert a new question
 * @param request HTTP request
 * @returns HTTP response with question ID or error status
 */
export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody = requestBodySchema.parse(JSON.parse(requestText));

		const questionID = uuidv4();
		const taxonomyCategoryID = await fetchTaxonomyCategory(requestBody.taxonomyCategory);
		const topicID = await fetchOrCreateTopic(requestBody.topic);
		const knowledgeID = await fetchOrCreateKnowledge(requestBody.studentID, topicID, taxonomyCategoryID);

		await prisma.$queryRawUnsafe(
			`INSERT INTO question (questionID, topicID, assignedDifficulty, modifiedDifficulty, question, categoryID, code)
			 VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, UUID_TO_BIN(?), ?)`,
			questionID,
			topicID,
			requestBody.assignedDifficulty,
			requestBody.assignedDifficulty,
			requestBody.question,
			taxonomyCategoryID,
			requestBody.code ?? null
		);

		return new Response(JSON.stringify({ data: { questionID }, status: 201 }), { status: 201 });
	} catch (error) {
		console.error(error);
		const statusCode = error instanceof NotFoundError ? 404 : 500;
		return new Response(JSON.stringify({ data: null, status: statusCode }), { status: statusCode });
	}
}
