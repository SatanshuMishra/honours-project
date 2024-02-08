"use client";
import React, { useEffect, useReducer } from "react";
import QuizOption from "../components/quizComponents/QuizOption";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import validateToken from "../scripts/validateToken";
import fetchStudent from "../scripts/fetchStudent";
import fetchQuestions from "../scripts/fetchQuestions";
import fetchAnswers from "../scripts/fetchAnswers";

import "remixicon/fonts/remixicon.css";
import Question from "../types/question";
import Answer from "../types/answer";
import Loading from "../components/loading/loading";

interface QuizState {
	loading: boolean;
	error: string | null;
	score: number;
	startTime: number | null;
	duration: number | null;
	studentInfo: {
		studentID: string | null;
		name: string | null;
		username: string | null;
	};
	questions: Question[];
	answers: Answer[];
	currentQuestionIndex: number;
	selectedOptionIdx: 0 | 1 | 2 | 3 | null;
	submitted: boolean;
}

type QuizAction =
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_STUDENT_INFO"; payload: any }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "SET_QUESTIONS"; payload: Question[] }
	| { type: "SET_ANSWERS"; payload: Answer[] }
	| { type: "SET_CURRENT_QUESTION_INDEX"; payload: number }
	| { type: "SELECT_OPTION"; payload: 0 | 1 | 2 | 3 | null }
	| { type: "SUBMIT_ANSWER"; payload: null }
	| { type: "NEXT_QUESTION"; payload: null };

function Questionnaire() {
	const initialState: QuizState = {
		loading: true,
		error: null,
		score: 0,
		startTime: null,
		duration: null,
		studentInfo: {
			studentID: null,
			name: null,
			username: null,
		},
		questions: [],
		answers: [],
		currentQuestionIndex: 0,
		selectedOptionIdx: null,
		submitted: false,
	};

	const quizReducer: React.Reducer<QuizState, QuizAction> = (
		state: any,
		action: any
	) => {
		switch (action.type) {
			case "SET_LOADING":
				return { ...state, loading: action.payload };
			case "SET_ERROR":
				return { ...state, error: action.payload };
			case "SET_STUDENT_INFO":
				console.log("PAYLOAD: ", action.payload);
				return {
					...state,
					studentInfo: { studentID: action.payload.studentID, name: action.payload.name, username: action.payload.username },
				};
			case "SET_QUESTIONS":
				return { ...state, questions: action.payload };
			case "SET_ANSWERS":
				return {
					...state,
					answers: action.payload,
					loading: false,
					startTime: Date.now(),
				};
			case "SET_CURRENT_QUESTION_INDEX":
				return { ...state, currentQuestionIndex: action.payload };
			case "SELECT_OPTION":
				return { ...state, selectedOptionIdx: action.payload };
			case "SUBMIT_ANSWER":
				if (
					state.selectedOptionIdx === null ||
					state.startTime === null
				)
					return state;
				const endTime = Date.now();
				return {
					...state,
					duration: endTime - state.startTime,
					score: state.answers[state.selectedOptionIdx].isCorrect
						? state.score + 1
						: state.score,
					submitted: true,
				};
			case "NEXT_QUESTION":
				return {
					...state,
					loading: true,
					answers: null,
					error: null,
					startTime: null,
					duration: null,
					currentQuestionIndex: state.currentQuestionIndex + 1,
					selectedOptionIdx: null,
					submitted: false,
				};
			default:
				return state;
		}
	};

	const router = useRouter();
	const [quizState, dispatch] = useReducer<
		React.Reducer<QuizState, QuizAction>
	>(quizReducer, initialState);

	useEffect(() => {
		console.log(quizState);
	}, [quizState]);

	// DATA INITIALIZATION
	useEffect(() => {
		const token = Cookies.get("token");

		// RETURN TO SIGN-IN IF JWT DOESN'T EXIST.
		if (!token) {
			router.replace("/user-auth");
			return;
		}

		// VALIDATE TOKEN AND SET PARSED STUDENT ID
		validateToken(token)
			.then((studentInfo) => {
				if (!studentInfo || typeof studentInfo !== "string") return;

				const student: {
					studentID: string;
					name: string;
					username: string;
				} = JSON.parse(studentInfo);

				console.log("Student: ", student);

				dispatch({ type: "SET_STUDENT_INFO", payload: student });
				return fetchQuestions();
			})
			// ONCE TOKEN IS VALIDATED AND FETCH QUESTIONS
			.then((questions) => {
				console.log("QUESTIONS: ", questions);
				dispatch({
					type: "SET_QUESTIONS",
					payload: questions as Question[],
				});
				// CLEAR ERROR
				dispatch({ type: "SET_ERROR", payload: null });
			})
			.catch((error) => dispatch({ type: "SET_ERROR", payload: error }));
	}, []);

	useEffect(() => {
		if (quizState.questions.length !== 20) {
			dispatch({
				type: "SET_ERROR",
				payload: "Questions array has not been initialized yet.",
			});
			return;
		}

		fetchAnswers(
			quizState.questions[quizState.currentQuestionIndex].questionID
		)
			.then((answers) => {
				dispatch({ type: "SET_ANSWERS", payload: answers as Answer[] });
			})
			.catch((error) => {
				dispatch({
					type: "SET_ERROR",
					payload: "Something went wrong in fetchAnswers.\n" + error,
				});
			});
	}, [quizState.questions, quizState.currentQuestionIndex]);

	const handleSelectOption = (idx: 0 | 1 | 2 | 3 | null) => {
		dispatch({ type: "SELECT_OPTION", payload: idx });
	};

	// ADD STATS FOR CURRENT QUESTION
	async function addStatistics() {
		try {
			if (!quizState.submitted)
				throw new Error("No submission detected!");

			if (
				!quizState.questions ||
				!quizState.answers ||
				quizState.selectedOptionIdx === null
			)
				throw new Error("[AS] Missing values!");

			let values = {
				studentID: quizState.studentInfo.studentID,
				questionID:
					quizState.questions[quizState.currentQuestionIndex]
						.questionID,
				chosenAnswerID:
					quizState.answers[quizState.selectedOptionIdx].answerID,
				isCorrect:
					quizState.answers[quizState.selectedOptionIdx].isCorrect,
				timeToAnswer: quizState.duration,
				recordedDifficulty: null,
			};

			const res = await fetch(
				"./questionnaire/api/addperformancestatistics",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
					cache: "no-cache",
					credentials: "include",
				}
			);

			let resBody: {
				data: null;
				status: number;
			} = JSON.parse(await res.text());

			if (resBody.status === 400) {
				return false;
			}

			return resBody.data;
		} catch (error) {
			console.error("Something went wrong in addStatistics.\n", error);
		}
	}

	const handleSubmit = () => {
		dispatch({ type: "SUBMIT_ANSWER", payload: null });
	};

	useEffect(() => {
		quizState.submitted && addStatistics();
	}, [quizState.submitted]);

	const onContinue = () => {
		if (quizState.submitted) {
			dispatch({ type: "NEXT_QUESTION", payload: null });
		}
	};

	return (
		<>
			{!quizState.loading ? (
				<>
					<div className="bg-[#3A86FF] h-screen w-screen p-4 flex justify-evenly">
						<div className="w-full bg-transparent rounded-lg p-6 h-full max-w-[50%] mr-2">
							<div
								className="w-full h-8 rounded-lg bg-white"
								style={
									{
										"--progress-width":
											(quizState.currentQuestionIndex /
												quizState.questions.length) *
												100 +
											"%",
									} as any
								}
							>
								<div className="h-full bg-green-500 w-[--progress-width] rounded-lg"></div>
								<div className="text-white font-semibold">
									{quizState.currentQuestionIndex + 1} /{" "}
									{quizState.questions.length}
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
												{(
													quizState.currentQuestionIndex +
													1
												)
													.toString()
													.padStart(2, "0")}
											</span>
										</span>
										<br />

										{
											quizState.questions[
												quizState.currentQuestionIndex
											].question
										}
									</h2>
									{quizState.answers.map(
										(answer, answerIdx) => {
											return (
												<QuizOption
													key={answerIdx}
													// ANSWER INDEX
													answerIdx={answerIdx as 0 | 1 | 2 | 3 }
													// ANSWER TEXT
													answerText={
														answer.answerDescription
													}
													// HANLDE SELECTED OPTION
													handleSelectOption={
														handleSelectOption
													}
													isSelectedAnswer={
														quizState.selectedOptionIdx ===
														answerIdx
													}
													answerExplanation={
														answer.answerExplanation
													}
													blockChange={
														quizState.submitted
													}
													isCorrectChoice={
														quizState.answers[
															answerIdx
														].isCorrect
													}
												/>
											);
										}
									)}
								</div>
							}
							<div>
								{!quizState.submitted && (
									<button
										className="w-full bg-green-500 hover:bg-green-400 p-2 rounded-lg font-semibold text-white text-lg"
										onClick={() => handleSubmit()}
									>
										Submit
									</button>
								)}
								{quizState.submitted && (
									<button
										className="w-full bg-sky-500 hover:bg-green-400 p-2 rounded-lg font-semibold text-white text-lg"
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
