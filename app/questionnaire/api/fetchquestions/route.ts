import Question from "@/app/types/question";
import prisma from "../../../lib/prisma";

import sendStatisticsForProcessing from "@/app/scripts/statsProcess";

export async function POST() {
  try {
    let predictions = await sendStatisticsForProcessing();
    console.log("Predictions received by getQuestions.");
    console.log(predictions);

    let questions: [Question[]] =
      await prisma.$queryRaw`SELECT BIN_TO_UUID(questionID) AS questionID, difficulty, question, code FROM question ORDER BY modDifficulty DESC LIMIT 20`;

    if (!questions || questions.length !== 20)
      throw new Error("Incorrect Question Query.");

    /* console.log("QUESTIONS: ", questions); */

    return new Response(
      JSON.stringify({
        data: questions,
        status: 200,
      }),
    );
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({
        data: null,
        status: 400,
      }),
    );
  }
}
