import { NextRequest } from "next/server";
import * as tf from "@tensorflow/tfjs";

async function trainModel(featureTensors: any, labelTensors: any) {
  const model = tf.sequential();

  const numFeatures = 2;
  const outputUnits = 1;
  model.add(
    tf.layers.dense({
      inputShape: [numFeatures],
      units: 64,
      activation: "relu",
    }),
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
  /* console.log("PREDICTIONS: ", predictionsArray); */
  return predictionsArray;
}

export async function POST(request: NextRequest) {
  try {
    const requestText = await request.text();
    const requestBody = JSON.parse(requestText);

    let matrix = requestBody.matrix;
    console.log("STATSPROCESS: ", matrix);

    let features: any = [];
    let labels: any = [];

    // Iterate through matrix to construct features and labels arrays
    Object.keys(matrix).forEach((studentID) => {
      Object.keys(matrix[studentID]).forEach((questionID) => {
        const cell = matrix[studentID][questionID];
        // Assuming the cell structure is [isCorrect, timeToAnswer, attemptCount]
        // Adjust indices based on actual structure
        const isCorrect = cell[0]; // Assuming first element is isCorrect
        const featureVector = cell.slice(1); // The rest are features

        features.push(featureVector);
        labels.push(isCorrect ? 1 : 0); // Assuming isCorrect is a boolean, convert to binary
      });
    });

    console.log("FEATURES: ", features);
    console.log("LABELS: ", labels);

    // Convert arrays to tensors
    const featureTensors = tf.tensor2d(features);
    const labelTensors = tf.tensor1d(labels, "int32"); // Use 'int32' for binary labels

    let predictions: any = await trainModel(featureTensors, labelTensors);

    let predictionsMatrix: any = {};

    Object.keys(matrix).forEach((studentID) => {
      predictionsMatrix[studentID] = {};

      Object.keys(matrix[studentID]).forEach((questionID) => {
        const features = matrix[studentID][questionID].slice(0, -1);
        const label = matrix[studentID][questionID].slice(-1)[0];

        const prediction = predictions.shift();

        console.log("PREDICTION: ", prediction[0]);

        predictionsMatrix[studentID][questionID] = [
          ...features,
          label,
          prediction[0],
        ];
      });
    });

    console.log("PREDMATRX: ", predictionsMatrix);

    return new Response(
      JSON.stringify({
        data: predictionsMatrix,
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
