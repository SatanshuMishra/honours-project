import {dummyData} from "../data/dummyData";

export default async function parseJSON() {
//	for(const el of dummyData){
//		try {
//			//(el) => {
//
//				let questionID = "";
//				if(el.code) 
//					questionID =  await insertQuestion(el.difficulty, el.question, el.code);
//				else
//					questionID = await insertQuestion(el.difficulty, el.question);
//				//el.answers.forEach(
//				//	(answer, idx) => {
//				//		insertAnswer(questionID, answer, el.explanations[idx], el.correct == idx ? true : false);
//				//	}
//				//)
//			//}
//		} catch (error) {
//			console.error('Error processing element:', error);
//		}
//	)
	let questionID = await insertQuestion(2, "This is a sample.", "Weee!");
	console.log(questionID);
}

async function insertQuestion (difficulty: number, question: string, code?: string){
	const values = {
		difficulty,
		question,
		code
	}
	const response = await fetch(`./questionnare/api/addquestion`, {
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
	const response = await fetch(`./questionnare/api/addanswer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
      cache: "no-cache",
    });

	let res: {
      data: null;
      status: number;
    } = JSON.parse(await response.text());
	if(res.status == 200){
		return;
	} else {
		console.log(`Error Inserting Answer for Question with ID ${questionID}.`);
	}
}
