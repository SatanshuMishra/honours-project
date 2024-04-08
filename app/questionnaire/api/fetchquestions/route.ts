import Question from "@/app/types/question";
import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const requestText = await request.text();
    const requestBody: {
      studentID: string;
      topicID: string;
    } = JSON.parse(requestText);

    console.log(requestBody);

    let questions: {
      questionID: Question["questionID"];
      modifiedDifficulty: Question["modifiedDifficulty"];
      question: Question["question"];
      code: Question["code"];
    }[] =
      await prisma.$queryRaw`SELECT BIN_TO_UUID(q.questionID) AS questionID, q.modifiedDifficulty, q.question, q.code FROM question q JOIN studentKnowledge sk ON q.topicID = sk.topicID AND q.categoryID = sk.categoryID WHERE q.topicID = UUID_TO_BIN(${requestBody.topicID}) AND sk.studentID = UUID_TO_BIN(${requestBody.studentID}) AND q.modifiedDifficulty BETWEEN sk.mastery + sk.difficultyOffset - 0.2 AND sk.mastery + sk.difficultyOffset + 0.2 ORDER BY RAND() LIMIT 20`;

    if (questions.length < 20) {
      let bracket = 0.2;
      let maxBracket = 1.0; // Or any reasonable upper limit you choose

      while (questions.length < 20 && bracket <= maxBracket) {
        console.log(`Entered Adaptive Bracket Loop. Bracket: ${bracket}`);
        bracket += 0.1;
        questions =
          await prisma.$queryRaw`SELECT BIN_TO_UUID(q.questionID) AS questionID, q.modifiedDifficulty, q.question, q.code FROM question q JOIN studentKnowledge sk ON q.topicID = sk.topicID AND q.categoryID = sk.categoryID WHERE q.topicID = UUID_TO_BIN(${requestBody.topicID}) AND sk.studentID = UUID_TO_BIN(${requestBody.studentID}) AND q.modifiedDifficulty BETWEEN sk.mastery + sk.difficultyOffset - 0.5 AND sk.mastery + sk.difficultyOffset + ${bracket} ORDER BY RAND() LIMIT 20`;
      }

      // If even after reaching maxBracket, you couldn't get 20 questions
      if (questions.length < 20) {
        console.log("Nope! Still Nothn!");
        // Handle the situation where not enough questions exist
        return new Response(
          JSON.stringify({
            data: null,
            status: 404,
            message:
              "Maximum bracket reached. Not enough questions exist for this topic.",
            pgErrorObject: null,
          })
        );
      }
    }

    return new Response(
      JSON.stringify({
        data: questions,
        status: 200,
        message: "Questions successfully returned.",
        pgErrorObject: null,
      })
    );
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({
        data: null,
        status: 400,
        message: "Something went wrong with fetching questions.",
        pgErrorObject: e,
      })
    );
  }
}
