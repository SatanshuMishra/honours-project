"use client";
import React, { useEffect, useState } from "react";

type props = {
  optionIndex: number;
  optionText: string;
  onSubmit: (idx: number) => void;
  isSelectedOpt: boolean;
  explanation: string;
  blockChange: boolean;
  isCorrectChoice: boolean;
};

type explanationProps = {
  explanation: string;
};

function QuizOption({
  optionIndex,
  optionText,
  onSubmit,
  isSelectedOpt,
  explanation,
  blockChange,
  isCorrectChoice,
}: props) {
  const [allowChange, setAllowChange] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  useEffect(() => {
    setIsSelected(isSelectedOpt);
  }, [isSelectedOpt]);
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
      setShowExplanation(true);
      setAllowChange(false);
    } else {
      setShowExplanation(false);
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

	console.log("COMPONENT:", explanation);

  return (
    <div
      style={
        {
          "--index-color": isSelected
            ? blockChange
              ? isCorrectChoice
                ? "#8ED854"
                : "#D85454"
              : "#61AAFF"
            : "#fff",
          "--option-color": isSelected
            ? blockChange
              ? isCorrectChoice
                ? "rgba(147, 255, 97, 0.50)"
                : "rgba(255, 97, 97, 0.50)"
              : "rgba(97, 170, 255, 0.50)"
            : "#fff",
          "--text-color": isSelected ? "#fff" : "#000",
        } as any
      }
    >
      <div
        className="bg-[--option-color] p-2 shadow-lg my-2 flex items-center rounded-lg w-full max-w-full text-lg flex-row"
        onClick={() => {
          if (!allowChange) return;
          setIsSelected(!isSelected);
          onSubmit(optionIndex);
        }}
      >
        <div className="bg-[--index-color] py-2 px-4 rounded shadow-[gray] shadow-md mr-2 text-[--text-color] font-bold h-fit">
          {optionCodes[optionIndex]}
        </div>
        <section className="px-2">
          <div>{optionText}</div>
          {isSelected && showExplanation && (
            <Explanation explanation={explanation} />
          )}
        </section>
      </div>
    </div>
  );
}

export default QuizOption;
