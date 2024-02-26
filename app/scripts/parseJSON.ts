import {dummyData} from "../data/dummyData";

export default async function parseJSON() {
	for(const el of dummyData){
		try {
			let questionID =  await insertQuestion(el.topic, el.difficulty, el.question, el.bloomTaxonomy, el.timeTakenSeconds, el.code);	
			console.log("QuestionID: " + questionID);
			el.answers.forEach(
				(answer, idx) => {
					insertAnswer(questionID, answer, el.explanations[idx], el.correct == idx ? true : false);
				}
			)
		} catch (error) {
			console.error('Error processing element:', error);
		}
	}
}

async function insertQuestion (topic: string, difficulty: number, question: string, bloomTaxonomy: string, timeTakenSeconds: number, code?: string){
	const values = {
		topic,
		difficulty,
		question,
		bloomTaxonomy,
		timeTakenSeconds,
		code
	}
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
	if(res.data){
		return res.data.questionID;
	} else {
		return "";
	}
}

async function insertAnswer (questionID: string, answer: string, explanation: string, isCorrect: boolean){
	const values = {
		questionID,
		answer,
		explanation,
		isCorrect
	}
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
	if(res.status == 201){
		return;
	} else {
		console.log(`Error Inserting Answer for Question with ID ${questionID}.`);
	}
}
