import SVGResults from "@/public/SVGResults.svg";

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
		if (score === 20) return `Perfect Lesson!`;
		else return `Lesson Complete!`;
	};

	return (
		<section className="w-full h-full bg-[#141a33]">
			<section className="p-10">
				<h4 className="text-slate-700 text-xl font-bold font-jetbrains-mono">
					Quiz Results
				</h4>
				<h2 className="text-3xl text-white font-bold font-jetbrains-mono">
					{getTitle()}
				</h2>
				<div className="flex flex-col justify-center items-center w-full">
					<img
						src={SVGResults.src}
						alt="Results SVG"
						className="w-[35rem] py-10"
					/>
					<div className="grid grid-cols-2 gap-2 w-fit">
						<div>
							<h4 className="text-white text-xl font-bold font-jetbrains-mono">
								Your Score:
							</h4>
							<h2 className="font-jetbrains-mono text-white text-[90px] font-bold">
								{score.toLocaleString("en-US", {
									minimumIntegerDigits: 2,
									useGrouping: false,
								})}
								<span className="text-slate-700 text-[70px] font-bold">
									/20
								</span>
							</h2>
						</div>
						<div>
							<h4 className="text-white text-xl font-bold font-jetbrains-mono">
								Duration:
							</h4>
							<h2 className="font-jetbrains-mono text-white text-[90px] font-bold">
								{formatTime(duration)}
							</h2>
						</div>
					</div>
				</div>
				<div className="flex flex-row justify-center">
					<a href="/dashboard" className="flex flex-row justify-center items-center font-jetbrains-mono bg-white hover:bg-gray-100 py-4 px-10 rounded-[10px] shadow border-black font-semibold text-black text-xl hover:cursor-pointer w-fit mx-4">
						Back to Dashboard
					</a>
					<a href={`/questionnaire/${topicID}`} className="flex flex-row justify-center items-center font-jetbrains-mono bg-sky-400 hover:bg-sky-500 py-4 px-10 rounded-[10px] shadow border-black font-semibold text-white text-xl hover:cursor-pointer w-fit mx-4">
						Take New Quiz
					</a>
				</div>
			</section>
		</section>
	);
}
