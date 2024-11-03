// Type definition for each question in the recursion data
interface QuestionData {
	topic: string;
	bloomTaxonomyCategory: string;
	difficulty: number;
	question: string;
	code?: string;
	answersList: string[];
	correctAnswerIndex: number;
	explanationsList: string[];
}

import recursion from "../data/RecursionData";
import dataStructures from "../data/DataStructures";
import verifyJWT from "./verifyJWT";

export default function parseJSON() {
	let studentID: string | null = null;

	// Verify that each question object matches the required structure
	const isValidQuestionData = (el: any): el is QuestionData => {
		const requiredFields: (keyof QuestionData)[] = [
			"topic",
			"bloomTaxonomyCategory",
			"difficulty",
			"question",
			"answersList",
			"correctAnswerIndex",
			"explanationsList",
		];

		// Check for required fields
		for (const field of requiredFields) {
			if (!(field in el)) {
				console.error(`Missing required field: ${field}`);
				return false;
			}
		}

		// Additional type checks for arrays and index bounds
		if (!Array.isArray(el.answersList) || el.answersList.length === 0) {
			console.error("Invalid or empty answersList.");
			return false;
		}
		if (!Array.isArray(el.explanationsList) || el.explanationsList.length !== el.answersList.length) {
			console.error("explanationsList length must match answersList length.");
			return false;
		}
		if (typeof el.correctAnswerIndex !== "number" || el.correctAnswerIndex < 0 || el.correctAnswerIndex >= el.answersList.length) {
			console.error("Invalid correctAnswerIndex.");
			return false;
		}

		return true;
	};

	verifyJWT(true).then(async (studentInfo) => {
		if (!studentInfo) throw new Error("No Student Information returned.");
		const student: {
			studentID: string;
			name: string;
			username: string;
		} = JSON.parse(studentInfo);
		studentID = student.studentID;
		console.log("Student:", student);

		for (const el of dataStructures) {
			try {
				if (!studentID) throw new Error("No Student Information returned.");

				if (!isValidQuestionData(el)) {
					console.error("Invalid question format, skipping question:", el);
					continue;
				}

				// Insert question and answers
				const questionID = await insertQuestion(
					studentID,
					el.topic,
					el.difficulty,
					el.question,
					el.bloomTaxonomyCategory,
					el.code
				);
				if (questionID) {
					console.log("QuestionID:", questionID);
					el.answersList.forEach((answer, idx) => {
						insertAnswer(
							questionID,
							answer,
							el.explanationsList[idx],
							idx === el.correctAnswerIndex
						);
					});
				}
			} catch (error) {
				console.error("Error processing element:", error);
			}
		}
	});
}

async function insertQuestion(
	studentID: string,
	topic: string,
	assignedDifficulty: number,
	question: string,
	bloomTaxonomy: string,
	code?: string
): Promise<string | void> {
	const values = {
		studentID,
		topic,
		assignedDifficulty,
		question,
		taxonomyCategory: bloomTaxonomy,
		code,
	};

	try {
		const response = await fetch(`./questionnaire/api/addquestion`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
			cache: "no-cache",
		});
		const res = await response.json();

		if (res?.data?.questionID) {
			console.info("Question ID returned:", res.data.questionID);
			return res.data.questionID;
		} else {
			console.warn("No question ID returned from the server.");
		}
	} catch (error) {
		console.error("Error inserting question:", error);
	}
}

async function insertAnswer(
	questionID: string,
	answer: string,
	explanation: string,
	isCorrect: boolean
) {
	const values = {
		questionID,
		answer,
		explanation,
		isCorrect,
	};

	try {
		const response = await fetch(`./questionnaire/api/addanswer`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
			cache: "no-cache",
		});
		const res = await response.json();

		if (res.status !== 201) {
			console.warn(`Error inserting answer for question ID ${questionID}.`);
		}
	} catch (error) {
		console.error(`Failed to insert answer for question ID ${questionID}:`, error);
	}
}