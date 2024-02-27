import { dummyData } from "../data/dummyData";
import verifyJWT from "./verifyJWT";

export default function parseJSON() {
	let studentID: string | null = null;

	verifyJWT(true).then(async (studentInfo) => {
		if (!studentInfo) throw new Error("No Student Information returned.");
		const student: {
			studentID: string;
			name: string;
			username: string;
		} = JSON.parse(studentInfo);
		studentID = student.studentID;
		console.log("Student: ", student);
		
		for (const el of dummyData) {
			try {
				if (!studentID)
					throw new Error("No Student Information returned.");

				let questionID = await insertQuestion(
					studentID,
					el.topic,
					el.difficulty,
					el.question,
					el.bloomTaxonomy,
					el.timeTakenSeconds,
					el.code
				);
				console.log("QuestionID: " + questionID);
				el.answers.forEach((answer, idx) => {
					insertAnswer(
						questionID,
						answer,
						el.explanations[idx],
						el.correct == idx ? true : false
					);
				});
			} catch (error) {
				console.error("Error processing element:", error);
			}
		}
	});
}

async function insertQuestion(
	studentID: string,
	topic: string,
	difficulty: number,
	question: string,
	bloomTaxonomy: string,
	timeTakenSeconds: number,
	code?: string
): Promise<string> {
	const values = {
		studentID,
		topic,
		difficulty,
		question,
		taxonomyCategory: bloomTaxonomy,
		timeTakenSeconds,
		code,
	};
	console.log(values);
	const response = await fetch(`./questionnaire/api/addquestion`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		cache: "no-cache",
	});

	let res: {
		data: {
			questionID: string;
		} | null;
		status: number;
	} = JSON.parse(await response.text());
	if (res.data) {
		return res.data.questionID;
	} else {
		return "";
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
	const response = await fetch(`./questionnaire/api/addanswer`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		cache: "no-cache",
	});

	let res: {
		data: null;
		status: number;
	} = JSON.parse(await response.text());
	if (res.status == 201) {
		return;
	} else {
		console.log(
			`Error Inserting Answer for Question with ID ${questionID}.`
		);
	}
}
