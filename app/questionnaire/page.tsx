"use client";
import React, { useEffect, useState } from "react";
import { dummyData } from "../data/dummyData";
import QuizOption from "../components/quizComponents/QuizOption";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import validateToken from "../scripts/validateToken";
import fetchStudent from "../scripts/fetchStudent";

import QuestionPill from "../components/quizComponents/QuestionPill";
import "remixicon/fonts/remixicon.css";
import Question from "../types/question";
import Answer from "../types/answer";
import Loading from "../components/loading/loading";

function Questionnaire() {
	const router = useRouter();
	let dataDummy: any = dummyData;

	// STORE USER DATA
	const [studentID, setStudentID] = useState<any>();
	const [studentName, setStudentName] = useState("");
	const [studentUsername, setStudentUsername] = useState("");

	const [currentIndex, setCurrentIndex] = useState<number>(0);

	// STORE QUESTION DATA
	const [questions, setQuestions] = useState<Question[]>();
	const [answers, setAnswers] = useState<Answer[]>();
	const [correctAnswer, setCorrectAnswer] = useState<number>(999);

	const [chosenOption, setChosenOption] = useState<number>(999);
	const [blockChanges, setBlockChanges] = useState<boolean>(false);

	useEffect(() => {
		const token = Cookies.get("token");

		// CHECK IF JWT TOKEN EXISTS. IF NOT, RETURN TO AUTH.
		if (!token) {
			router.replace("/user-auth");
			return;
		}

		// VALIDATE TOKEN AND SET PARSED STUDENT ID
		validateToken(token).then((response) => {
			console.log(response);
			if (!response) {
				Cookies.remove("token");
				router.push("/user-auth");
			}

			setStudentID(
				Buffer.from(response.data)
					.toString("hex")
					.match(/.{1,8}/g)
					?.join("")
					.trim()
			);
		});
	}, []);

	// FETCH STUDENT INFORMATION ONCE STUDENT ID HAS BEEN UPDATED
	useEffect(() => {
		if (studentID) {
			fetchStudent(studentID).then((response) => {
				if (!response) {
					throw new Error("No Student Found!");
				}
				console.log("Student:\n", response);
				setStudentName(response.name);
				setStudentUsername(response.username);
			});
		}
	}, [studentID]);

	// FETCH QUESTIONS
	async function fetchQuestions() {
		try {
			const res = await fetch("./questionnaire/api/fetchquestions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: null,
				cache: "no-cache",
				credentials: "include",
			});

			let resBody: {
				data: Question[];
				status: number;
			} = JSON.parse(await res.text());

			if (resBody.status === 400) {
				return false;
			}

			return resBody.data;
		} catch (error) {
			console.error("[FETCH QUESTIONS] Error:\n", error);
		}
	}

	// FETCH AND ASSIGN QUESTIONS ONCE STUDENT ID IS SET
	useEffect(() => {
		studentID && fetchQuestions().then((response) => {
			if (!response) throw new Error("No questions have been fetched!");
			console.log("Questions:\n", response);
			setQuestions(response);
			setCurrentIndex(0);
		});
	}, [studentID]);

	// FETCH ANSWERS FOR CURRENT QUESTION
	async function fetchAnswers() {
		try {
			if (!questions || questions.length === 0)
				throw new Error("The Questions array is empty!");

			// console.log("Current Index:\n", currentIndex);
			// console.log("Current Question:\n", questions[currentIndex]);
			// console.log(
			// 	"QuestionID: \n",
			// 	Buffer.from(questions[currentIndex].questionID)
			// 		.toString("hex")
			// 		.match(/.{1,8}/g)
			// 		?.join("")
			// 		.trim()
			// );

			const res = await fetch("./questionnaire/api/fetchanswers", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					questionID: Buffer.from(questions[currentIndex].questionID)
						.toString("hex")
						.match(/.{1,8}/g)
						?.join("")
						.trim(),
				}),
				cache: "no-cache",
				credentials: "include",
			});

			let resBody: {
				data: Answer[];
				status: number;
			} = JSON.parse(await res.text());

			if (resBody.status === 400) {
				return false;
			}

			return resBody.data;
		} catch (error) {
			console.error("[FETCH QUESTIONS] Error:\n", error);
		}
	}

	useEffect(() => {
		if (questions && questions.length !== 0) {
			fetchAnswers().then((response) => {
				if (!response) throw new Error("No answers have been fetched.");
				console.log("Answers:\n", response);
				setAnswers(response);
			});
		}
	}, [questions, currentIndex]);

	useEffect(() => {
		if (!answers || answers.length === 0){
			console.log("Answers array is empty!");
			return;	
		}

		for (let i = 0; i < answers.length; i++) {
			if (answers[i].isCorrect) {
				// console.log("SETTER:\n", answers[i].isCorrect)
				setCorrectAnswer(i);
				break;
			}
		}
	
	}, [answers]);

	return (
		<>
			{ studentID && questions && questions.length > 0 && answers && answers.length > 0 ? 
		(<>
			{/* CLOSE BUTTON */}
			<div className="flex flex-row-reverse bg-[#141a33]">
				<i
					className="ri-close-fill text-white text-4xl mx-2 p-2 hover:cursor-pointer"
					onClick={() => {
						router.push("/dashboard");
					}}
				></i>
			</div>

			<div className="bg-[#141a33] h-screen w-screen m-0 px-6 flex justify-evenly">
				<div className="w-full bg-transparent rounded-lg p-6 h-full max-w-[50%] mr-2">
					<div
						className="w-full h-8 rounded-lg bg-white"
						style={
							{
								"--progress-width":
									(currentIndex / questions.length) * 100 +
									"%",
							} as any
						}
					>
						<div className="h-full bg-green-500 w-[--progress-width] rounded-lg"></div>
						<div className="text-white font-semibold">
							{currentIndex + 1} / {dataDummy.length}
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
									Question {currentIndex + 1} /{" "}
									{dataDummy.length}
								</span>
								<br />
								{/* {currentIndex + 1 + ". "} */}
								{dataDummy[currentIndex].question}
							</h2>
							{dataDummy[currentIndex].answers.map(
								(option, optIndex) => {
									return (
										<QuizOption
											key={optIndex}
											optionIndex={optIndex}
											optionText={option}
											setChosenOption={() => {

													}}
											isSelectedOpt={
												chosenOption === optIndex
											}
											explanation={
												dataDummy[currentIndex]
													.explanations[optIndex]
											}
											blockChange={blockChanges}
											isCorrectChoice={
												optIndex === correctAnswer
											}
										/>
									);
								}
							)}
						</div>
					}
					<div>
						{!blockChanges && (
							<button
								className="w-full bg-green-500 hover:bg-green-400 p-2 rounded-lg font-semibold text-white text-lg"
							>
								Submit
							</button>
						)}
						{blockChanges && (
							<button
								className="w-full bg-green-500 hover:bg-green-400 p-2 rounded-lg font-semibold text-white text-lg"

							>
								Continue
							</button>
						)}
					</div>
				</div>
			</div>
		</>) : (
		<Loading />
		)}
		</>
	);
}

export default Questionnaire;
