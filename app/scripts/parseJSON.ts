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

export default function parseJSON(questionSet: QuestionData[], studentInfo: string) {
	try {
		const student: {
			studentID: string;
			name: string;
			username: string;
		} = JSON.parse(studentInfo);

		if (!student.studentID) {
			throw new Error('No student ID found in info');
		}

		console.log("Student:", student);

		for (const el of questionSet) {
			try {
				if (!student.studentID) throw new Error("No Student Information returned.");

				if (!isValidQuestionData(el)) {
					console.error("Invalid question format, skipping question:", el);
					continue;
				}

				insertQuestion(
					student.studentID,
					el.topic,
					el.difficulty,
					el.question,
					el.bloomTaxonomyCategory,
					el.code
				).then((questionID) => {
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
				});
			} catch (error) {
				console.error("Error processing element:", error);
			}
		}
	} catch (error) {
		console.error('Error parsing student info:', error);
		throw error;
	}
}

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

	for (const field of requiredFields) {
		if (!(field in el)) {
			console.error(`Missing required field: ${field}`);
			return false;
		}
	}

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

async function insertQuestion(
	studentID: string,
	topic: string,
	assignedDifficulty: number,
	question: string,
	bloomTaxonomy: string,
	code?: string
): Promise<string> {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
	const values = {
		studentID,
		topic,
		assignedDifficulty,
		question,
		taxonomyCategory: bloomTaxonomy,
		code: code || null
	};

	try {
		const response = await fetch(`${baseUrl}/questionnaire/api/addquestion`, {
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
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
	const values = {
		questionID,
		answer,
		explanation,
		isCorrect
	};

	try {
		const response = await fetch(`${baseUrl}/questionnaire/api/addanswer`, {
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
