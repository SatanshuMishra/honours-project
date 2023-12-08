"use client";
import React, { useEffect, useState } from "react";

type props = {
  optionIndex: number;
  optionText: string;
  setChosenOption: (optionIndex: number) => void;
  isSelectedOpt: boolean;
  explanation: string;
  blockChange: boolean;
  isCorrectChoice: boolean;
};

type explanationProps = {
  explanatin: string;
};

function QuizOption({
  optionIndex,
  optionText,
  setChosenOption,
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

  function Explanation({ explanatin }: explanationProps) {
    return (
      <section className="my-2">
        <h4 className="text-[#55BB05] font-semibold">Explanation:</h4>
        <p>{explanatin}</p>
      </section>
    );
  }

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
        className="bg-[--option-color] p-2 shadow-lg my-2 flex rounded-lg w-full max-w-2xl text-lg"
        onClick={() => {
          if (!allowChange) return;
          setIsSelected(!isSelected);
          setChosenOption(optionIndex);
        }}
      >
        <div className="bg-[--index-color] py-2 px-4 rounded shadow-[gray] shadow-md mr-2 text-[--text-color] font-bold h-fit">
          {optionCodes[optionIndex]}
        </div>
        <section className="px-2">
          <div>{optionText}</div>
          {isSelected && showExplanation && (
            <Explanation explanatin={explanation} />
          )}
        </section>
      </div>
    </div>
  );
}

export default QuizOption;
