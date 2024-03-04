import Question from "../types/question";

// THIS FUNCTION FETCHES QUESTIONS FOR THE QUIZ
// CURRENTLY, IT FETCHES 20 RANDOM QUESTIONS. IN THE FUTURE, 20 SELECT QUESTIONS WILL BE FETCHED.
export default async function fetchQuestions(studentID: string) {
  try {
    const res = await fetch("./questionnaire/api/fetchquestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({studentID}),
      cache: "no-cache",
      credentials: "include",
    });

    let resBody: {
      data: Question[];
      status: number;
    } = JSON.parse(await res.text());

    if (resBody.status === 400) {
      return false;
    }

    return resBody.data;
  } catch (error) {
    console.error("[FETCH QUESTIONS] Error:\n", error);
  }
}
