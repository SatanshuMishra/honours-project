import * as tf from "@tensorflow/tfjs-node";

const model = tf.sequential();
model.add(
  tf.layers.dense({ inputShape: [3], units: 1, activation: "sigmoid" })
);
model.compile({
  optimizer: "sgd",
  loss: "binaryCrossentropy",
  metrics: ["accuracy"],
});

const dummyData = {
  xs: tf.tensor2d([
    [1, 0, 0], // Easy, Wrong, Old
    [2, 1, 0], // Medium, Right, Old
    [3, 0, 1], // Hard, Wrong, New
  ]),
  ys: tf.tensor1d([0, 1, 0]), // Example labels (correct/incorrect)
};

async function trainModel(data) {
  await model.fit(data.xs, data.ys, {
    epochs: 10, // Few epochs for the sake of the example
    callbacks: {
      onEpochEnd: (epoch, log) =>
        console.log(`Epoch ${epoch}: loss = ${log.loss}`),
    },
  });
  console.log("Model trained (dummy training)");
}

// Function to generate question recommendations based on past performance
function generateRecommendations(questions, N) {
  // Prioritize questions based on past performance: wrong > new > right
  const sortedQuestions = questions.sort((a, b) => {
    const order = { wrong: 1, new: 2, right: 3 };
    return order[a.studentPastPerformance] - order[b.studentPastPerformance];
  });

  // Select the top N questions as recommendations
  return sortedQuestions.slice(0, N);
}

// Immediately invoke the dummy training function for the sake of this example
(async () => {
  await trainModel(dummyData);
})();

if (req.method === "POST") {
  try {
    const { numberOfQuestions, questionsBank, subtopic } = req.body;

    // Filter questions by the specified subtopic
    const filteredQuestions = questionsBank.filter(
      (q) => q.subtopic === subtopic
    );

    // Generate recommendations based on the filtered questions
    const recommendations = generateRecommendations(
      filteredQuestions,
      numberOfQuestions
    );

    res.status(200).json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} else {
  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default recommendQuestions;
