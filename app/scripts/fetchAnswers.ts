import Answer from "../types/answer";

export default async function fetchAnswers(questionID: string) {
  try {
    const res = await fetch("./questionnaire/api/fetchanswers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionID,
      }),
      cache: "no-cache",
      credentials: "include",
    });

    let resBody: {
      data: Answer[];
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
