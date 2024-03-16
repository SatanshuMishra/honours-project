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
			<div className="my-2 py-2">
				<h4 className="text-[#FFFFFF] font-semibold font-jetbrains-mono">Explanation:</h4>
				<p className="font-jetbrains-mono">{explanation}</p>
			</div>
		);
	}

	return (
		<div
			style={
				{
					"--border-color": isSelectedAnswer
						? showanswerExplanation
							? isCorrectChoice
								? "#19AC9B"
								: "#AA1755"
							: "#E7E7E7"
						: "#5E6580",
					"--marker-color": isSelectedAnswer
						? showanswerExplanation
							? isCorrectChoice
								? "#19AC9B"
								: "#AA1755"
							: "#E7E7E7"
						: "#5E6580",
				} as any
			}
		>
			<div
				className="p-4 shadow-lg my-2 flex flex-row justify-between w-full rounded-[10px] border-2 border-[--border-color] hover:cursor-pointer"
				onClick={() => {
					if (!allowChange) return;
					handleSelectOption(answerIdx);
				}}
			>
				<section className="px-2 text-white text-xl font-normal font-jetbrains-mono select-none">
					{answerText}
					{isSelectedAnswer && showanswerExplanation && (
						<Explanation explanation={answerExplanation} />
					)}
				</section>
				{isSelectedAnswer ? (
					blockChange ? (
						isCorrectChoice ? (
							<i className="ri-checkbox-circle-fill w-6 h-6 text-2xl text-[--marker-color]"></i>
						) : (
							<i className="ri-close-circle-fill text-2xl text-[--marker-color]"></i>
						)
					) : (
						<i className="ri-checkbox-circle-fill text-2xl text-[--marker-color]"></i>
					)
				) : (
					<i className="ri-circle-line text-2xl text-[--marker-color]"></i>
				)}
			</div>
		</div>
	);
}

export default QuizOption;
