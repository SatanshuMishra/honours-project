"use client";
import React, { useEffect, useState } from "react";
import { dummyData } from "../data/dummyData";
import QuizOption from "../components/quizComponents/QuizOption";
import QuestionPill from "../components/quizComponents/QuestionPill";
import "remixicon/fonts/remixicon.css";

function Sandbox() {
  const [chosenOption, setChosenOption] = useState(999);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(999);
  const [blockChanges, setBlockChanges] = useState(false);

  const handleChosenOption = (optionIndex: number) => {
    setChosenOption(optionIndex);
    setCorrectAnswer(dummyData[currentIndex].correct);
  };

  const handleCheckAnswer = () => {
    setBlockChanges(true);
    console.log(chosenOption === correctAnswer);
  };

  const handleNextQuestion = () => {
    setBlockChanges(false);
    setChosenOption(999);
    setBlockChanges(false);
    setCurrentIndex(currentIndex + 1 < dummyData.length ? currentIndex + 1 : 0);
    console.log(blockChanges);
  };

  useEffect(() => {
    setCorrectAnswer(dummyData[currentIndex].correct);
  }, [currentIndex]);
  // 06F
  return (
    <>
      <div className="flex flex-row-reverse bg-[#141a33]">
        <i
          className="ri-close-fill text-white text-4xl mx-2 p-2 cursor-pointer"
          onClick={() => {}}
        ></i>
      </div>

      <div className="bg-[#141a33] h-screen w-screen m-0 px-6 flex justify-evenly">
        <div className="w-full bg-transparent rounded-lg p-6 h-full max-w-[50%] mr-2">
          <div
            className="w-full h-8 rounded-lg bg-white"
            style={
              {
                "--progress-width":
                  (currentIndex / dummyData.length) * 100 + "%",
              } as any
            }
          >
            <div className="h-full bg-green-500 w-[--progress-width] rounded-lg"></div>
            <div className="text-white font-semibold">
              {currentIndex + 1} / {dummyData.length}
            </div>
            {/* <div>
            <QuestionPill />
          </div> */}
          </div>
        </div>
        <div className="flex flex-col justify-between w-full bg-white rounded-lg p-6 h-full max-w-[50%] ml-2">
          {
            <div>
              <h2 className="font-bold text-xl text-black">
                <span className="text-blue-500">
                  Question {currentIndex + 1} / {dummyData.length}
                </span>
                <br />
                {/* {currentIndex + 1 + ". "} */}
                {dummyData[currentIndex].question}
              </h2>
              {dummyData[currentIndex].answers.map((option, optIndex) => {
                return (
                  <QuizOption
                    key={optIndex}
                    optionIndex={optIndex}
                    optionText={option}
                    setChosenOption={handleChosenOption}
                    isSelectedOpt={chosenOption === optIndex}
                    explanation={dummyData[currentIndex].explanations[optIndex]}
                    blockChange={blockChanges}
                    isCorrectChoice={optIndex === correctAnswer}
                  />
                );
              })}
            </div>
          }
          <div>
            {!blockChanges && (
              <button
                className="w-full bg-green-500 hover:bg-green-400 p-2 rounded-lg font-semibold text-white text-lg"
                onClick={() => handleCheckAnswer()}
              >
                Submit
              </button>
            )}
            {blockChanges && (
              <button
                className="w-full bg-green-500 hover:bg-green-400 p-2 rounded-lg font-semibold text-white text-lg"
                onClick={() => {
                  handleNextQuestion();
                }}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sandbox;
