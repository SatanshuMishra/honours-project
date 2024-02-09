"use client";
import React, { useEffect, useState } from "react";

type props = {
  answerIdx: 0 | 1 | 2 | 3;
  answerText: string;
  handleSelectOption: (idx: 0 | 1 | 2 | 3 | null) => void;
  isSelectedAnswer: boolean;
  answerExplanation: string;
  blockChange: boolean;
  isCorrectChoice: boolean;
};

type explanationProps = {
  explanation: string;
};

function QuizOption({
  answerIdx,
  answerText,
  handleSelectOption,
  isSelectedAnswer,
  answerExplanation,
  blockChange,
  isCorrectChoice,
}: props) {
  const [allowChange, setAllowChange] = useState(true);
  const [showanswerExplanation, setShowanswerExplanation] = useState(false);
  const optionCodes: {
    [key: number]: string;
  } = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
  };

  useEffect(() => {
    if (blockChange) {
      setShowanswerExplanation(true);
      setAllowChange(false);
    } else {
      setShowanswerExplanation(false);
      setAllowChange(true);
    }
  }, [blockChange]);

  function Explanation({ explanation }: explanationProps) {
    return (
      <section className="my-2">
        <h4 className="text-[#55BB05] font-semibold">Explanation:</h4>
        <p>{explanation}</p>
      </section>
    );
  }

  return (
    <div
      style={
        {
          "--index-color": isSelectedAnswer
            ? blockChange
              ? isCorrectChoice
                ? "#8ED854"
                : "#D85454"
              : "#61AAFF"
            : "#fff",
          "--option-color": isSelectedAnswer
            ? blockChange
              ? isCorrectChoice
                ? "rgba(147, 255, 97, 0.50)"
                : "rgba(255, 97, 97, 0.50)"
              : "rgba(97, 170, 255, 0.50)"
            : "#fff",
          "--text-color": isSelectedAnswer ? "#fff" : "#000",
        } as any
      }
    >
      <div
        className="bg-[--option-color] p-2 shadow-lg my-2 flex items-center rounded-lg w-full max-w-full text-lg flex-row"
        onClick={() => {
          if (!allowChange) return;
          handleSelectOption(answerIdx);
        }}
      >
        <div className="bg-[--index-color] py-2 px-4 rounded shadow-[gray] shadow-md mr-2 text-[--text-color] font-bold h-fit">
          {optionCodes[answerIdx]}
        </div>
        <section className="px-2">
          <div>{answerText}</div>
          {isSelectedAnswer && showanswerExplanation && (
            <Explanation explanation={answerExplanation} />
          )}
        </section>
      </div>
    </div>
  );
}

export default QuizOption;
