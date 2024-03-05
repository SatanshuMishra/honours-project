import { error } from "console";
import prisma from "../../../lib/prisma";
import { PythonShell } from "python-shell";

export async function POST() {
	try {
		let statistics: {
			studentID: string;
			questionID: string;
			isCorrect: number;
		}[] =
			await prisma.$queryRaw`SELECT BIN_TO_UUID(studentID) AS studentID, BIN_TO_UUID(questionID) AS questionID, isCorrect from statistic`;

		if (statistics.length === 0) throw new Error("No statistics returned");

		const irtData = {};
		for (const item of statistics) {
			const studentUUID = item.studentID;
			const questionId = item.questionID;
			if (!irtData[studentUUID]) {
				irtData[studentUUID] = [];
			}
			irtData[studentUUID][questionId] = item.isCorrect;
		}

		// Prepare data for the IRT script
		const irtInput = Object.values(irtData);
		// Run the Python script
		const options = {
			args: [JSON.stringify(irtInput)],
		};

		console.log('irtInput:', JSON.stringify(irtInput));

		PythonShell.run(
			"./app/questionnaire/api/irt_analysis.py",
			options
		).then((messages) => {
			const difficultyValues = JSON.parse(messages[0]);
			console.log("IRT Difficulty Values: ", difficultyValues);
		});

		return new Response(
			JSON.stringify({
				data: null,
				status: 200,
			})
		);
	} catch (e) {
		console.log(e);
		return new Response(
			JSON.stringify({
				data: null,
				status: 400,
			})
		);
	}
}
