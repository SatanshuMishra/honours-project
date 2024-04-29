"use client";

//  DOCUMENTATION: IMPORTS
import React, { useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github.css";
import "remixicon/fonts/remixicon.css";
import SVGQuiz from "@/public/SVG-Quiz.svg";
import { useToast } from "@/components/ui/use-toast";

//  DOCUMENTATION: TYPES

import Question from "../../types/question";
import Answer from "../../types/answer";
import Student from "../../types/student";

//  DOCUMENTATION: COMPONENTS

import ProgressBar from "../../components/progressBar/progressBar";
import QuizOption from "../../components/quizComponents/QuizOption";
import Loading from "../../components/loading/loading";
import Results from "../../components/results/results";

//  DOCUMENTATION: SCRIPTS

import fetchQuestions from "../../scripts/fetchQuestions";
import fetchAnswers from "../../scripts/fetchAnswers";
import verifyJWT from "../../scripts/verifyJWT";

//  DOCUMENTATION: INTERFACE FOR CODE BLOCK

interface Code {
	code: string | null;
}

//  DOCUMENTATION: INTERFACE MANAGING QUIZ STATE

interface QuizState {
	loading: boolean;
	error: string | null;
	score: number;
	startTime: number | null;
	duration: number | null;
	quizDurationStart: number | null;
	quizDurationEnd: number | null;
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

//  DOCUMENTATION: INTERFACE FOR ACTIONS AND PAYLOADS

type QuizAction =
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_STUDENT_INFO"; payload: any }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "SET_QUESTIONS"; payload: Question[] }
	| { type: "SET_ANSWERS"; payload: Answer[] }
	| { type: "SET_CURRENT_QUESTION_INDEX"; payload: number }
	| { type: "SELECT_OPTION"; payload: 0 | 1 | 2 | 3 | null }
	| { type: "SUBMIT_ANSWER"; payload: null }
	| { type: "NEXT_QUESTION"; payload: null }
	| { type: "START_QUIZ_DURATION"; payload: null }
	| { type: "FINISH_QUIZ"; payload: null };

//  DOCUMENTATION: COMPONENT FOR DISPLAYING CODE BLOCK W/ HIGHLIGHTING

const CodeBlock = ({ code }: Code) => {
	useEffect(() => {
		hljs.highlightAll();
	}, []);

	return (
		<pre className="bg-black p-4 px-8">
			<code className="javascript text-xl !bg-black !text-white select-none !font-jetbrains-mono">
				{code}
			</code>
		</pre>
	);
};

function Questionnaire({ params }: { params: { slug: string } }) {
	const router = useRouter();
	const { toast } = useToast();

	//  DOCUMENTATION: INITIALIZE LANGUAGE HIGHLIGHTING FOR CODE BLOCK

	hljs.registerLanguage("javascript", javascript);

	//  DEBUG:
	console.info(`Slug: ${params.slug}`);

	//  DOCUMENTATION: INITIALIZE STATE FOR QUIZ STATE

	const initialState: QuizState = {
		loading: true,
		error: null,
		score: 0,
		startTime: null,
		duration: null,
		quizDurationStart: null,
		quizDurationEnd: null,
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

	//  DOCUMENTATION: DEFINE ACTIONS FOR QUIZ STATE

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
				return {
					...state,
					studentInfo: {
						studentID: action.payload.studentID,
						name: action.payload.name,
						username: action.payload.username,
					},
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
				) {
					toast({
						title: "Submission Error",
						description: "Please select an option before submitting! If this is an error, please report it.",
						variant: "destructive",
					});
					return state;
				}

				verifyJWT().then((isValid) => {
					if (!isValid) {
						Cookies.remove("token");
						router.push("/user-auth");
					}
				});

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
			case "START_QUIZ_DURATION":
				return { ...state, quizDurationStart: Date.now() };
			case "FINISH_QUIZ":
				return { ...state, quizDurationEnd: Date.now() };
			default:
				return state;
		}
	};

	const [quizState, dispatch] = useReducer<
		React.Reducer<QuizState, QuizAction>
	>(quizReducer, initialState);

	//  DOCUMENTATION: INITIALIZE QUESTIONNAIRE STATE

	useEffect(() => {
		//  DOCUMENTATION: CHECK JWT TOKEN TO ENSURE STUDENT IS SIGNED IN

		verifyJWT(true)
			.then((studentInfo) => {
				if (!studentInfo) {
					console.info(`VERIFICATION FAILED. REDIRECTING TO LOGIN.`);
					Cookies.remove("token");
					router.push("/user-auth");
				}

				if (typeof studentInfo === "string") {
					const student: Student = JSON.parse(studentInfo);
					console.info(`VERIFIED. LOGGED IN AS ${student.name?.toUpperCase()}.`);
					dispatch({ type: "SET_STUDENT_INFO", payload: student });
					return fetchQuestions(student.studentID, params.slug);
				}

				console.info(`VERIFICATION FAILED. REDIRECTING TO LOGIN. [BR]`);

				Cookies.remove("token");
				router.push("/user-auth");
			})

			//  DOCUMENTATION: FETCH QUESTIONS ONCE TOKEN IS VALIDATED

			.then((questions) => {
				console.info(`---QUESTIONS RETURNED---\n${questions.length}`);

				dispatch({
					type: "SET_QUESTIONS",
					payload: questions as Question[],
				});

				dispatch({ type: "SET_ERROR", payload: null });
			})
			.catch((error) => dispatch({ type: "SET_ERROR", payload: error }));
	}, []);

	//  DOCUMENTATION: UPDATE QUESTION AND ANSWER CHOICES EACH TIME	CURRENT INDEX CHANGES

	useEffect(() => {
		if (quizState && quizState.questions.length !== 20) {
			dispatch({
				type: "SET_ERROR",
				payload: "Questions array has not been initialized yet.",
			});
			return;
		}

		if (quizState.currentQuestionIndex >= 20) {
			dispatch({
				type: "FINISH_QUIZ",
				payload: null,
			});
			return;
		}

		fetchAnswers(
			quizState.questions[quizState.currentQuestionIndex].questionID as string
		)
			.then((answers) => {
				dispatch({ type: "SET_ANSWERS", payload: answers as Answer[] });
			})
			.then(() => {
				quizState.currentQuestionIndex === 0 && dispatch({ type: "START_QUIZ_DURATION", payload: null });
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

	useEffect(() => {
		if (quizState.quizDurationEnd === null) return;
	}, [quizState.quizDurationEnd]);

	//  DOCUMENTATION: ADD STATS FOR CURRENT QUESTION
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
			};

			const res = await fetch(
				"/questionnaire/api/addperformancestatistics",
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
			if (quizState.currentQuestionIndex < 20) dispatch({ type: "NEXT_QUESTION", payload: null });
		}
	};

	/**
	 * Processes data for entire quiz based on collected statistics
	 * @returns {Promise<any>} Returns processed data.
	 */
	async function processResults(): Promise<any> {
		try {
			if (!quizState.quizDurationEnd)
				throw new Error("No submission detected!");

			let values = {
				studentID: quizState.studentInfo.studentID,
				topicID: params.slug,
			};

			const res = await fetch("/questionnaire/api/processResults", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
				cache: "no-cache",
				credentials: "include",
			});

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

	useEffect(() => {
		console.info("Start Time: ", quizState.quizDurationStart, "End Time: ", quizState.quizDurationEnd, "Duration:", quizState.quizDurationEnd - quizState.quizDurationStart);
		processResults();
	}, [quizState.quizDurationEnd]);

	return (
		<>
			{!quizState.loading ? (
				<>
					<main className="bg-[#141A33] h-full max-h-screen w-full flex flex-col p-10 transition-all duration-300 ease-in-out">
						{/*  DOCUMENTATION: BACK TO DASHBOARD BUTTON */}
						<a
							className="flex flex-row justify-center items-baseline w-fit my-2 text-[#5E6580] text-lg hover:cursor-pointer hover:text-white transition-all duration-300 ease-in-out"
							href="/dashboard"
						>
							<i className="ri-arrow-left-line py-2 px-1 text-xl"></i>
							<p className="px-1 py-2 font-jetbrains-mono">
								Back to Dashboard
							</p>
						</a>
						<section
							className="flex-1 w-full max-h-[86vh] flex flex-row justify-evenly"
							style={
								{
									"--bg": quizState.questions[
										quizState.currentQuestionIndex
									].code
										? "#000000"
										: "transparent",
								} as any
							}
						>
							<section className="p-2 bg-[--bg] w-full flex flex-col justify-center h-full mr-4 rounded-[10px] overflow-y-scroll">
								{quizState.questions[
									quizState.currentQuestionIndex
								].code && (
										<CodeBlock
											code={
												quizState.questions[
													quizState.currentQuestionIndex
												].code as string
											}
										/>
									)}
								{!quizState.questions[
									quizState.currentQuestionIndex
								].code && (
										<img
											src={SVGQuiz.src}
											alt="Picture"
											className="w-[90%]"
										/>
									)}
							</section>
							<section className="p-2 w-full ml-4 flex flex-col items-start border-[0px] border-dashed border-white">
								<h4 className="text-slate-700 text-xl font-bold font-jetbrains-mono">
									Recursion
								</h4>
								<h1 className="text-3xl text-white font-bold font-jetbrains-mono">
									QUESTION{" "}
									<span className="text-[40px]">
										{(
											quizState.currentQuestionIndex + 1
										).toLocaleString("en-US", {
											minimumIntegerDigits: 2,
											useGrouping: false,
										})}
									</span>
									<span className="text-slate-700">/20</span>
								</h1>
								<ProgressBar
									currentIdx={quizState.currentQuestionIndex}
								/>
								<h2 className="text-white text-3xl font-bold font-jetbrains-mono py-4">
									{
										quizState.questions[
											quizState.currentQuestionIndex
										].question
									}
								</h2>
								<section
									className="w-full h-full flex flex-col justify-between overflow-y-scroll"
									style={
										{
											"--bg-color": quizState.submitted
												? quizState.answers[
													quizState
														.selectedOptionIdx
												].isCorrect
													? "#19AC9B"
													: "#AA1755"
												: "#0185FF",
											"--hover-color": quizState.submitted
												? quizState.answers[
													quizState
														.selectedOptionIdx
												].isCorrect
													? "#37e2ce"
													: "#e4357f"
												: "#1a91ff",
											"--gap": quizState.submitted
												? "0.5rem"
												: "0.5rem",
										} as any
									}
								>
									<div className="w-full overflow-y-scroll">
										{quizState.answers.map(
											(answer, answerIdx) => {
												return (
													<QuizOption
														key={answerIdx}
														// ANSWER INDEX
														answerIdx={
															answerIdx as
															| 0
															| 1
															| 2
															| 3
														}
														// ANSWER TEXT
														answerText={
															answer.answerDescription as string
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
															answer.answerExplanation as string
														}
														blockChange={
															quizState.submitted
														}
														isCorrectChoice={
															quizState.answers[
																answerIdx
															].isCorrect as boolean
														}
													/>
												);
											}
										)}
									</div>
									<div>
										{!quizState.submitted && (
											<button
												className="font-jetbrains-mono w-full bg-[#0185FF] hover:bg-[#1c90fc] p-4 rounded-[10px] shadow border-black font-semibold text-white text-xl"
												onClick={() => handleSubmit()}
											>
												Submit
											</button>
										)}
										{quizState.submitted && (
											<button
												className="font-jetbrains-mono w-full bg-[--bg-color] hover:bg-[--hover-color] p-4 rounded-[10px] shadow border-black font-semibold text-white text-xl"
												onClick={() => onContinue()}
											>
												Continue
											</button>
										)}
									</div>
								</section>
							</section>
						</section>
					</main>
				</>
			) : !quizState.quizDurationEnd ? (
				<Loading />
			) : (
				<>
					<Results
						topicID={params.slug}
						score={quizState.score}
						duration={
							quizState.quizDurationEnd -
							quizState.quizDurationStart
						}
					/>
				</>
			)}
		</>
	);
}

export default Questionnaire;
