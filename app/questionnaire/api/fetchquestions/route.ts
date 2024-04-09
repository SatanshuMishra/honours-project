import Question from "@/app/types/question";
import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";

async function validateStudentKnowledge(studentID: string, topicID: string) {
	try {
		// CHECK IF ENTRIES EXISTS IN STUDENT KNOWLEDGE
		let entries: { hasEntries: string }[] = await prisma.$queryRaw`
	SELECT IF(COUNT(*) = 6, true, false) AS hasEntries
	FROM studentKnowledge
	WHERE studentID = UUID_TO_BIN(${studentID})
	AND topicID = UUID_TO_BIN(${topicID})
	`;

		if (entries.length !== 1)
			throw new Error("Entries returned no or more than 1 row.");

		if (entries[0].hasEntries == "1") return true;

		await prisma.$queryRaw`
	INSERT INTO studentKnowledge (knowledgeID, studentID, topicID, categoryID, mastery, difficultyOffset)
	SELECT UUID_TO_BIN(UUID()), UUID_TO_BIN(${studentID}), UUID_TO_BIN(${topicID}), categoryID, 0.5, 0.0
	FROM taxonomyCategory
	WHERE NOT EXISTS (
		SELECT 1
		FROM studentKnowledge sk
		WHERE sk.studentID = UUID_TO_BIN(${studentID}) AND sk.topicID = UUID_TO_BIN(${topicID}) AND sk.categoryID = taxonomyCategory.categoryID
	)
	`;

		await prisma.$queryRaw`
	INSERT INTO studentLogMastery (studentLogID, studentID, topicID, categoryID, mastery)
	SELECT UUID_TO_BIN(UUID()), UUID_TO_BIN(${studentID}), UUID_TO_BIN(${topicID}), categoryID, 0.5
	FROM taxonomyCategory
	WHERE NOT EXISTS (
		SELECT 1
		FROM studentLogMastery slm
		WHERE slm.studentID = UUID_TO_BIN(${studentID}) AND slm.topicID = UUID_TO_BIN(${topicID}) AND slm.categoryID = taxonomyCategory.categoryID
	)
	`;

		await prisma.$queryRaw`
	INSERT INTO studentLogOffset (studentLogID, studentID, topicID, categoryID, difficultyOffset)
	SELECT UUID_TO_BIN(UUID()), UUID_TO_BIN(${studentID}), UUID_TO_BIN(${topicID}), categoryID, 0.0
	FROM taxonomyCategory
	WHERE NOT EXISTS (
		SELECT 1
		FROM studentLogOffset slo
		WHERE slo.studentID = UUID_TO_BIN(${studentID}) AND slo.topicID = UUID_TO_BIN(${topicID}) AND slo.categoryID = taxonomyCategory.categoryID
	)
	`;
	} catch (e) {
		console.log(e);
		return false;
	}
}

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody: {
			studentID: string;
			topicID: string;
		} = JSON.parse(requestText);

		console.info(
			`--FETCH QUESTIONS--\nSTUDENT ID: ${requestBody.studentID}\nTOPIC ID: ${requestBody.topicID}`
		);

		let validated = validateStudentKnowledge(
			requestBody.studentID,
			requestBody.topicID
		);

		if (!validated)
			return new Response(
				JSON.stringify({
					data: null,
					status: 404,
					message:
						"Validation Failed",
					pgErrorObject: null,
				})
			);

		let questions: {
			questionID: Question["questionID"];
			modifiedDifficulty: Question["modifiedDifficulty"];
			question: Question["question"];
			code: Question["code"];
		}[] =
			await prisma.$queryRaw`SELECT BIN_TO_UUID(q.questionID) AS questionID, q.modifiedDifficulty, q.question, q.code FROM question q JOIN studentKnowledge sk ON q.topicID = sk.topicID AND q.categoryID = sk.categoryID WHERE q.topicID = UUID_TO_BIN(${requestBody.topicID}) AND sk.studentID = UUID_TO_BIN(${requestBody.studentID}) AND q.modifiedDifficulty BETWEEN sk.mastery + sk.difficultyOffset - 0.2 AND sk.mastery + sk.difficultyOffset + 0.2 ORDER BY RAND() LIMIT 20`;

		if (questions.length < 20) {
			let bracket = 0.2;
			let maxBracket = 8.3;

			while (questions.length < 20 && bracket <= maxBracket) {
				console.log(
					`Entered Adaptive Bracket Loop. Bracket: ${bracket}`
				);
				bracket += 0.05;
				questions =
					await prisma.$queryRaw`SELECT BIN_TO_UUID(q.questionID) AS questionID, q.modifiedDifficulty, q.question, q.code FROM question q JOIN studentKnowledge sk ON q.topicID = sk.topicID AND q.categoryID = sk.categoryID WHERE q.topicID = UUID_TO_BIN(${requestBody.topicID}) AND sk.studentID = UUID_TO_BIN(${requestBody.studentID}) AND q.modifiedDifficulty BETWEEN sk.mastery + sk.difficultyOffset - ${bracket} AND sk.mastery + sk.difficultyOffset + ${bracket} ORDER BY RAND() LIMIT 20`;
			}

			// If even after reaching maxBracket, you couldn't get 20 questions
			if (questions.length < 20) {
				console.log("Nope! Still Nothn!");
				// Handle the situation where not enough questions exist
				return new Response(
					JSON.stringify({
						data: null,
						status: 404,
						message:
							"Maximum bracket reached. Not enough questions exist for this topic.",
						pgErrorObject: null,
					})
				);
			}
		}

		return new Response(
			JSON.stringify({
				data: questions,
				status: 200,
				message: "Questions successfully returned.",
				pgErrorObject: null,
			})
		);
	} catch (e) {
		console.log(e);
		return new Response(
			JSON.stringify({
				data: null,
				status: 400,
				message: "Something went wrong with fetching questions.",
				pgErrorObject: e,
			})
		);
	}
}
