import SVGResults from "@/public/SVGResults.svg";
import React from "react";

// NOTE: THIS COMPONENT REPRESENTS THE RESULTS SCREEN OF THE QUIZ -> WHERE STUDENTS GET THEIR PERFORMANCE OF THE QUIZ THEY JUST TOOK

interface Prop {
	topicID: string;
	score: number;
	duration: number;
}

function formatTime(milliseconds: number): string {
	//  INFO: CALCULATE THE MINUTES AND SECONDS OF QUIZ DURATION
	const minutes = Math.floor(milliseconds / (1000 * 60));
	const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

	//  INFO: PAD TIME WITH 0'S
	const minutesString = minutes.toString().padStart(2, "0");
	const secondsString = seconds.toString().padStart(2, "0");

	return `${minutesString}:${secondsString}`;
}

export default function Results({ topicID, score, duration }: Prop) {
	console.log("Duration: ", duration);

	const getTitle = (): string => {
		if (score === 20) return `PERFECT LESSON`;
		else return `LESSON COMPLETE`;
	};

	return (
		<section className="w-full h-full bg-white p-10 flex flex-col overflow-y-scroll overflow-x-hidden">
			<section className="flex-1 bg-[#f1f1f7] shadow-lg p-10 rounded-lg flex flex-col">
				<h4 className="text-slate-700 text-xl font-bold">
					QUIZ RESULTS
				</h4>
				<h2 className="text-3xl text-black font-bold font-jetbrains-mono">
					{getTitle()}
				</h2>
				<div className="flex-1 flex flex-col justify-center items-center w-full">
					<img
						src={SVGResults.src}
						alt="Results SVG"
						className="w-[35rem] py-10"
					/>
					<div className="flex flex-row justify-center items-start flex-wrap w-fit py-10">
						<div style={{paddingRight: "3rem"}}>
							<h4 className="text-black text-lg font-bold">
								YOUR SCORE:
							</h4>
							<h2 className="text-black font-bold text-[60px]">
								{score.toLocaleString("en-US", {
									minimumIntegerDigits: 2,
									useGrouping: false,
								})}
								<span className="text-[#0285FF] text-[60px] font-bold">
									/20
								</span>
							</h2>
						</div>
						<div style={{paddingRight: "3rem"}}>
							<h4 className="text-black text-lg font-bold">
								DURATION:
							</h4>
							<h2 className="text-black text-[60px] font-bold">
								{formatTime(duration)}
							</h2>
						</div>
						<div>
							<h4 className="text-black text-lg font-bold">
								POINTS EARNED:
							</h4>
							<h2 className="text-[#0285FF] text-[60px] font-bold">
								50
							</h2>
						</div>
					</div>
				</div>
				<div className="flex flex-row justify-center">
					<a
						href="/dashboard"
						className="flex flex-row justify-center items-center font-jetbrains-mono bg-white hover:bg-gray-100 py-4 px-10 rounded-[10px] shadow border-black font-semibold text-black text-xl hover:cursor-pointer w-fit mx-4"
					>
					RETURN TO DASHBOARD
					</a>
					<a
						href={`/questionnaire/${topicID}`}
						className="flex flex-row justify-center items-center font-jetbrains-mono bg-sky-400 hover:bg-sky-500 py-4 px-10 rounded-[10px] shadow border-black font-semibold text-white text-xl hover:cursor-pointer w-fit mx-4"
					>
					START NEW QUIZ	
					</a>
				</div>
			</section>
		</section>
	);
}
