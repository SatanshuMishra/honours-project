import { NextRequest } from "next/server";
import * as tf from "@tensorflow/tfjs";

async function trainModel(featureTensors, labelTensors) {
	const model = tf.sequential();

	const numFeatures = 3;
	const outputUnits = 1;
	model.add(
		tf.layers.dense({
			inputShape: [numFeatures],
			units: 64,
			activation: "relu",
		})
	);
	model.add(tf.layers.dense({ units: 32, activation: "relu" }));
	model.add(tf.layers.dense({ units: outputUnits, activation: "sigmoid" }));

	model.compile({
		optimizer: tf.train.adam(),
		loss: "binaryCrossentropy",
		metrics: ["accuracy"],
	});

	await model.fit(featureTensors, labelTensors, {
		epochs: 10,
		batchSize: 32,
		validationSplit: 0.2,
	});

	const predictions = model.predict(featureTensors);
    const predictionsArray = await predictions.array();
    model.dispose();
	console.log(predictionsArray);
    return predictionsArray;

}

export async function POST(request: NextRequest) {
	try {
		const requestText = await request.text();
		const requestBody = JSON.parse(requestText);

		let statistics = requestBody.statistics;
		console.log("STATSPROCESS: ", requestBody.statistics);

		// WHAT WILL BE USED FOR COMPARISIONS
		const features = statistics.map((stat) => [
			stat.studentID,
			stat.questionID,
			stat.timeToAnswer,
		]);
		// WHAT WILL BE PREDICTED
		const labels = statistics.map((stat) => stat.isCorrect);

		const featureTensors = tf.tensor2d(features);
		const labelTensors = tf.tensor1d(labels);

		await trainModel(featureTensors, labelTensors);

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
