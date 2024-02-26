import { preprocessData } from "./PreprocessData";
import { createModel } from "./CreateModel";

const trainModel = async (model, trainingData, trainingLabels) => {
  const response = await model.fit(trainingData, trainingLabels, {
    epochs: 10,
    batchSize: 32,
  });

  console.log("Training Complete");
  return response;
};

// Example usage
(async () => {
  const data = [
    // TO-DO: ADD DATA ENDPOINT HERE
  ];
  const preprocessedData = preprocessData(data);

  const inputs = tf.tensor2d(preprocessedData.map((item) => item.slice(0, -1)));
  const labels = tf.tensor2d(
    preprocessedData.map((item) => [item[item.length - 1]]),
  );

  const model = createModel();
  await trainModel(model, inputs, labels);

  const predictProbabilities = async (model, allQuestionsData) => {
    const predictions = await model
      .predict(tf.tensor2d(allQuestionsData))
      .data();
    return predictions;
  };

  const selectQuestions = (predictions, allQuestions) => {
    const questionsWithPredictions = allQuestions.map((question, index) => ({
      ...question,
      probability: predictions[index],
    }));

    questionsWithPredictions.sort((a, b) => a.probability - b.probability);

    const highChanceWrong = questionsWithPredictions.slice(0, 10);
    const mediumChance = questionsWithPredictions.slice(10, 15);
    const highChanceRight = questionsWithPredictions.slice(-5);

    return [...highChanceWrong, ...mediumChance, ...highChanceRight];
  };
})();
