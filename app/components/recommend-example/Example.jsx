"use client";
import React from "react";

function Example() {
  async function fetchRecommendations(subtopic, numberOfQuestions) {
    const response = await fetch("components/recommend-example/api/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subtopic: subtopic,
        numberOfQuestions: numberOfQuestions,
        questionsBank: [
          {
            id: 1,
            difficulty: "easy",
            type: "recursion",
            subtopic: "base_case",
            studentPastPerformance: "wrong",
          },
          {
            id: 2,
            difficulty: "easy",
            type: "recursion",
            subtopic: "base_case",
            studentPastPerformance: "right",
          },
          {
            id: 3,
            difficulty: "medium",
            type: "recursion",
            subtopic: "base_case",
            studentPastPerformance: "wrong",
          },
          {
            id: 4,
            difficulty: "medium",
            type: "recursion",
            subtopic: "recurrence_relation",
            studentPastPerformance: "new",
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  }

  // Use the function within a React component, for example, on a button click or form submit
  const handleGetRecommendations = async () => {
    try {
      const subtopic = "base_case"; // The subtopic you want to fetch questions for
      const numQuestions = 5; // The number of questions to recommend

      const recommendations = await fetchRecommendations(
        subtopic,
        numQuestions
      );
      console.log("Recommended Questions:", recommendations.recommendations);
      // Here you could set the recommendations to a state variable to render them in your component
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };
  return (
    <button
      onClick={() => {
        console.log(handleGetRecommendations());
      }}
    >
      Clicky
    </button>
  );
}

export default Example;
