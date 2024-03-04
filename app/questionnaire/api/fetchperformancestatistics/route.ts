import { error } from "console";
import prisma from "../../../lib/prisma";
import { PythonShell } from 'python-shell';

export async function POST() {
  try {
    let statistics: {studentID: string; questionID: string; isCorrect: number;}[] =
      await prisma.$queryRaw`SELECT BIN_TO_UUID(studentID) AS studentID, BIN_TO_UUID(questionID) AS questionID, isCorrect from statistic`;

	if(statistics.length === 0) throw new Error("No statistics returned");

	const options = {args: [statistics]};
	PythonShell.run('./app/questionnaire/api/irt_analysis.py', options).then( messages => {
				console.log("IRT Difficulty Values: ", JSON.stringify(messages));
		});

    return new Response(
      JSON.stringify({
        data: null,
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
