import Question from "../types/question";

export default async function fetchQuestions(
	studentID: string,
	topicID: string,
): Promise<Question[] | boolean> {
	try {
		const request = await fetch("/questionnaire/api/fetchquestions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ studentID, topicID }),
			cache: "no-cache",
			credentials: "include",
		});

		let response: {
			data: Question[];
			status: number;
			message: string;
			pgErrorObject: any;
		} = JSON.parse(await request.text());

		if (response.status === 400) {
			console.error(`Message: ${response.message}\nPgError: ${response.pgErrorObject}`);
			return false;
		}

		return response.data;
	} catch (error) {
		console.error("Something went wrong with fetching questions.", error);
		return false;
	}
}
