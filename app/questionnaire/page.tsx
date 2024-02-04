"use client";
import React, { useEffect, useState } from "react";
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
	// QUIZ DATA
	const [score, setScore] = useState<number>(0);

	// STORE USER DATA
	const [studentID, setStudentID] = useState<string | undefined>();
	const [studentName, setStudentName] = useState("");
	const [studentUsername, setStudentUsername] = useState("");

	const [currentIndex, setCurrentIndex] = useState<number>(0);

	// STORE QUESTION DATA
	const [questions, setQuestions] = useState<Question[] | undefined>();
	const [answers, setAnswers] = useState<Answer[] | undefined>();
	const [correctAnswerIdx, setCorrectAnswer] = useState<number | undefined>();

	// QUIZ STATE CONTROLLER
	const [selectedOptionIdx, setSelectedOptionIdx] = useState<
		number | undefined
	>();
	const [submitted, setSubmitted] = useState<boolean>(false);

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
				Buffer?.from(response.data)
					.toString("hex")
					.match(/.{1,8}/g)
					?.join("")
					.trim()
			);
		});
	}, []);

	// FETCH STUDENT INFORMATION ONCE STUDENT ID HAS BEEN UPDATED
	useEffect(() => {
		if (!studentID) {
			console.log("[Error]: StudentID is undefined.");
			return;
		}

		fetchStudent(studentID).then((response) => {
			if (!response) {
				throw new Error("No Student Found!");
			}
			console.log("Student Object:", response);
			setStudentName(response.name);
			setStudentUsername(response.username);
		});
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
		if (!studentID) {
			console.log("[Error]: StudentID is undefined.");
			return;
		}

		fetchQuestions().then((response) => {
			if (!response) throw new Error("No questions have been fetched!");
			console.log("Questions Object:\n", response);

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

	// FETCHES THE ANSWERS FOR A SPECIFIC QUESTION
	useEffect(() => {
		if (!questions || questions.length === 0) {
			console.log("Error: Questions is undefined or empty.");
			return;
		}

		fetchAnswers().then((response) => {
			if (!response) throw new Error("No answers have been fetched.");
			console.log("[FA] Answers:\n", response);
			setAnswers(response);
		});
	}, [questions, currentIndex]);

	// LOOPS THROW ANSWERS AND SETS THE IDX OF THE CORRECT OPTION TO correctAnswerIdx
	useEffect(() => {
		if (!answers || answers.length === 0) {
			console.log("Answers array is undefined or empty.");
			return;
		}

		for (let i = 0; i < answers.length; i++) {
			if (answers[i].isCorrect) {
				setCorrectAnswer(i);
				break;
			}
		}
	}, [answers]);

	const handleSelectOption = (idx: number) => {
		setSelectedOptionIdx(idx);
	};

	const handleSubmit = () => {
		if (selectedOptionIdx !== undefined) {
			setSubmitted(!submitted);
		}
	};

	const onContinue = () => {
		if (submitted) {
			setCorrectAnswer(undefined);
			setSelectedOptionIdx(undefined);
			setAnswers(undefined);
			setSubmitted(false);
			setCurrentIndex(currentIndex + 1);
		}
	};

	return (
		<>
			{studentID &&
			questions &&
			questions.length !== 0 &&
			answers &&
			answers.length !== 0 ? (
				<>
					<div className="bg-[#3A86FF] h-screen w-screen p-4 flex justify-evenly">
						<div className="w-full bg-transparent rounded-lg p-6 h-full max-w-[50%] mr-2">
							<div
								className="w-full h-8 rounded-lg bg-white"
								style={
									{
										"--progress-width":
											(currentIndex / questions.length) *
												100 +
											"%",
									} as any
								}
							>
								<div className="h-full bg-green-500 w-[--progress-width] rounded-lg"></div>
								<div className="text-white font-semibold">
									{currentIndex + 1} / {questions.length}
								</div>
							</div>
						</div>
						<div className="flex flex-col justify-between rounded-lg p-6 w-full h-auto max-w-[50%] bg-white m-6">
							{
								<div>
									<h2 className="font-bold text-xl text-black">
										<span className="text-blue-500 text-[25px]">
											QUESTION{" "}
											<span className="text-[30px]">
												{(currentIndex + 1)
													.toString()
													.padStart(2, "0")}
											</span>
										</span>
										<br />

										{questions[currentIndex].question}
									</h2>
									{answers.map((answer, answerIdx) => {
										return (
											<QuizOption
												key={answerIdx}
												// ANSWER INDEX
												answerIdx={answerIdx}
												// ANSWER TEXT
												answerText={
													answer.answerDescription
												}
												// HANLDE SELECTED OPTION
												handleSelectOption={
													handleSelectOption
												}
												isSelectedAnswer={
													selectedOptionIdx ===
													answerIdx
												}
												answerExplanation={
													answer.answerExplanation
												}
												blockChange={submitted}
												isCorrectChoice={
													answerIdx ===
													correctAnswerIdx
												}
											/>
										);
									})}
								</div>
							}
							<div>
								{!submitted && (
									<button
										className="w-full bg-green-500 hover:bg-green-400 p-2 rounded-lg font-semibold text-white text-lg"
										onClick={() => handleSubmit()}
									>
										Submit
									</button>
								)}
								{submitted && (
									<button
										className="w-full bg-green-500 hover:bg-green-400 p-2 rounded-lg font-semibold text-white text-lg"
										onClick={() => onContinue()}
									>
										Continue
									</button>
								)}
							</div>
						</div>
					</div>
				</>
			) : (
				<Loading />
			)}
		</>
	);
}

export default Questionnaire;
