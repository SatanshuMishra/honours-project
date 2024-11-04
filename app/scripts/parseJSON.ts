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
// import dataStructures from "../data/DataStructures";
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

		for (const el of recursion) {
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
): Promise<string> {
    const values = {
        studentID,
        topic,
        assignedDifficulty,
        question,
        taxonomyCategory: bloomTaxonomy,
        code: code || null
    };

    try {
        const response = await fetch(`/questionnaire/api/addquestion`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
            cache: "no-cache",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result?.data?.questionID) {
            throw new Error("No question ID returned from server");
        }

        console.log("Question inserted successfully:", result.data.questionID);
        return result.data.questionID;

    } catch (error) {
        // If it's a parsing error, log the response
        if (error instanceof SyntaxError) {
            console.error("Failed to parse server response:", error);
        }
        console.error("Error inserting question:", error);
        throw error;
    }
}

async function insertAnswer(
    questionID: string,
    answer: string,
    explanation: string,
    isCorrect: boolean
): Promise<string> {
    const values = {
        questionID,
        answer,
        explanation,
        isCorrect
    };

    try {
        const response = await fetch(`/questionnaire/api/addanswer`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
            cache: "no-cache",
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `Server error: ${response.status}`);
        }

        if (!result?.data?.answerID) {
            throw new Error("No answer ID returned from server");
        }

        console.log("Answer inserted successfully:", result.data.answerID);
        return result.data.answerID;

    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error("Failed to parse server response");
        }
        console.error("Error inserting answer:", error);
        throw error;
    }
}
