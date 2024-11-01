"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import "remixicon/fonts/remixicon.css";
import QuestionTopic from "../types/questionTopic";

// CUSTOM SCRIPT IMPORTS
import verifyJWT from "../scripts/verifyJWT";
import signOut from "../scripts/signOut";

// IMAGE IMPORTS
import Recursion from "@/public/Recursion.svg";
// import IOSvg from "@/public/IO.svg";
// import ErrorHandling from "@/public/ErrorHandle.svg";
// import SVGTopic from "@/public/SVG-Topic.svg";
// import ListSvg from "@/public/Lists.svg";
import ULearnLogo from "../components/uLearnLogo/ULearnLogo";
import CircularProgressBar from "@/app/components/progressBar/CircularProgressBar";
import "remixicon/fonts/remixicon.css";

const LoadingComponent = dynamic(
	() => import("@/app/components/loading/loading"),
	{
		ssr: false,
	},
);

function Dashboard() {
	const router = useRouter();
	const [studentID, setStudentID] = useState<any>();
	const [studentName, setStudentName] = useState("");
	const [studentUsername, setStudentUsername] = useState("");
	const [topics, setTopics] = useState<
		| {
			topicID: QuestionTopic["topicID"];
			name: QuestionTopic["name"];
			quizzesCompleted: string;
			bonusReq: string;
		}[]
		| null
	>(null);
	const [activeTab, setActiveTab] = useState<number>(0);

	// TEMPORARY TEST VARIABLES
	// const [_, setStatistics] = useState<any[]>();

	const [windowWidth, setWindowWidth] = useState<number>();

	useEffect(() => setWindowWidth(window.innerWidth), []);
	useEffect(() => console.log(windowWidth), [windowWidth]);
	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		//  INFORMATION: VALIDATE TOKEN AND SET PARSED STUDENT ID

		verifyJWT(true).then((response) => {
			//  INFORMATION: IF JWT IS NOT VALID, RETURN USER TO AUTH

			if (response === false) {
				//  DEBUG:
				console.info(`VERIFICATION FAILED. REDIRECTING TO LOGIN.`);
				Cookies.remove("token");
				router.push("/user-auth");
			}

			//  INFORMATION: ENSURE TYPE SECURITY (i.e., STRINGIFIED JSON IS RETURNED)

			if (typeof response === "string") {
				const res: {
					studentID: string;
					name: string;
					username: string;
				} = JSON.parse(response);

				//  DEBUG:
				console.info(
					`VERIFIED. LOGGED IN AS ${res.name?.toUpperCase()}.`,
				);

				setStudentID(res.studentID);
				setStudentName(res.name);
				setStudentUsername(res.username);

				return;
			}
			Cookies.remove("token");
			router.push("/user-auth");
		});
	}, []);

	/**
	 * This function processes the data for the signed-in student and given topicID. Used within the Developer Bar.
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async function processData() {
		try {
			const res = await fetch("./questionnaire/api/processResults", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					studentID: studentID,
					topicID: "E8984B2CFC1A4805ACE7C34A6E4EF33A",
				}),
				cache: "no-cache",
				credentials: "include",
			});
			const resBody: {
				data: any;
				status: number;
			} = JSON.parse(await res.text());
			if (resBody.status === 400) {
				throw new Error(
					"An error occured during the pre-processing and fetching of statistics.",
				);
			}
			// setStatistics(resBody.data);
		} catch (error) {
			throw new Error(`IRT model failed to process results. ${error}`);
		}
	}

	/**
	 * This function fetches the topics displayed on the Dashboard.
	 */

	async function fetchTopics() {
		try {
			const response = await fetch("/dashboard/api/fetchTopics", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					studentID: studentID,
				}),
				cache: "no-cache",
				credentials: "include",
			});
			const responseBody: {
				data: {
					topicID: QuestionTopic["topicID"];
					name: QuestionTopic["name"];
					quizzesCompleted: string;
					bonusReq: string;
				}[];
				status: number;
				message: string;
				pgErrorObject: any | null;
			} = JSON.parse(await response.text());
			if (responseBody.status === 400) {
				throw new Error(
					"An error occured during the pre-processing and fetching of statistics.",
				);
			}
			setTopics(responseBody.data);
		} catch (error: any) {
			console.log(error);
			// toast({
			// 	title: "Error",
			// 	description: "There was an error fetching the topics.",
			// 	variant: "destructive",
			// });
		}
	}

	//  NOTE: WAITS FOR STUDENT TO BE INITIALIZED BEFORE FETCHING TOPICS
	useEffect(() => {
		if (!studentID) return;
		fetchTopics();
	}, [studentID]);

	/**
	 * This function handles signing the user out of their account. Removed JWT token and re-directes to user-auth.
	 */
	async function handleSignOut(): Promise<void> {
		await signOut();
		Cookies.remove("token");
		router.push("/user-auth");
	}

	return (
		<section className="w-full h-full bg-white">
			{studentID && studentName && studentUsername
				? (
					<main className="h-full flex flex-col w-full p-6 overflow-hidden">
						<section
							className="h-fit w-full flex flex-row justify-between"
							style={{ paddingBottom: "1rem" }}
						>
							<ULearnLogo />
							<div>
								<button
									className="shadow border border-[#db1640] text-black hover:bg-[#db1640] hover:text-white py-2 px-4 rounded-lg mr-2 transition-all ease-in-out duration-300 flex flex-row justify-between items-center flex-nowrap"
									style={{
										margin: "0.25rem 0.5rem 0 0",
									}}
									onClick={() => handleSignOut()}
								>
									Sign Out
								</button>
							</div>
						</section>
						<section className="w-full flex-1 flex flex-row justify-between overflow-hidden">
							<section
								className="w-fit h-full p-10"
								style={{
									width: windowWidth > 1050
										? "fit-content"
										: "100%",
								}}
							>
								<div
									className="w-full"
									style={{
										paddingTop: "0px",
										paddingBottom: "1rem",
									}}
								>
									<h1 className="font-semibold text-[40px] font-jetbrains-mono text-black">
										Welcome,&nbsp;
										<br />
										<span className="font-light font-jetbrains-mono text-black">
											{studentName}&nbsp;👋
										</span>
									</h1>
									<p className="text-xl font-normal font-jetbrains-mono text-black">
										Nice to have you back! Time to do some
										lessons.
									</p>
								</div>
								<div className="w-full py-4">
									<h2 className="text-3xl text-black font-medium">
										Topic Quizzes
									</h2>
									<section className="w-full h-full py-2 flex flex-col overflow-y-scroll overflow-x-scroll">
										{topics &&
											topics.map((topic, _) => {
												return (
													<div
														className="h-full w-full flex flex-row items-center shadow-lg px-4 py-2 rounded-lg border border-black bg-white"
														key={_}
													>
														<div className="h-full w-fit p-2">
															<p className="h-full flex flex-col justify-center items-center text-xl font-medium text-[#16db89]">
																<CircularProgressBar
																	percentage={(
																		(parseFloat(
																			topic
																				.quizzesCompleted,
																		) /
																			4) *
																		100
																	).toPrecision(
																		3,
																	)}
																	image={Recursion}
																/>
																<span className="py-2">
																	{(
																		(parseFloat(
																			topic
																				.quizzesCompleted,
																		) /
																			4) *
																		100
																	).toPrecision(
																		3,
																	)}
																	&nbsp;%
																</span>
															</p>
														</div>
														<div className="p-2 flex-1">
															<h4
																className="text-black font-semibold"
																style={{
																	fontSize:
																		window
																			.innerWidth >
																			1050
																			? "1.6rem"
																			: "1.4rem",
																	paddingBottom:
																		"0.5rem",
																}}
															>
																{topic.name}
															</h4>
															<div>
																<span className="text-black">
																	<i className="ri-book-2-fill text-black pr-2">
																	</i>
																	{topic
																		.quizzesCompleted}
																	{" "}
																	<span
																		style={{
																			display:
																				windowWidth >
																					580
																					? "inline-block"
																					: "none",
																		}}
																	>
																		Lessons
																	</span>
																</span>
																<span className="text-black">
																	<i className="ri-brain-fill text-black px-2">
																	</i>
																	?{" "}
																	<span
																		style={{
																			display:
																				windowWidth >
																					580
																					? "inline-block"
																					: "none",
																		}}
																	>
																		Difficulty
																	</span>
																</span>
															</div>
															<div className="py-2 flex flex-row justify-start items-start">
																<button
																	className="shadow border border-[#db1640] text-black hover:bg-[#db1640] hover:text-white py-2 px-4 rounded-lg mr-2 transition-all ease-in-out duration-300 flex flex-row justify-between items-center flex-nowrap"
																	style={{
																		margin:
																			"0.25rem 0.5rem 0.5rem 0",
																	}}
																>
																	<span
																		style={{
																			display:
																				windowWidth >
																					580
																					? "inline-block"
																					: "none",
																		}}
																	>
																		Feedback
																	</span>{" "}
																	<i
																		className="ri-alarm-warning-fill"
																		style={{
																			paddingLeft:
																				windowWidth >
																					580
																					? "0.5rem"
																					: "0rem",
																		}}
																	>
																	</i>
																</button>
																<a
																	href={`/questionnaire/${topic.topicID}`}
																>
																	<button
																		className="shadow border border-[#16db89] text-white bg-[#16db89] hover:bg-[#14c46c] py-2 px-4 rounded-lg ml-[0.5rem] transition-all ease-in-out duration-300 flex flex-row justify-center items-center flex-nowrap"
																		style={{
																			margin:
																				"0.25rem 0.5rem 0.5rem 0",
																		}}
																	>
																		<span
																			style={{
																				display:
																					windowWidth >
																						580
																						? "inline-block"
																						: "none",
																			}}
																		>
																			Continue
																		</span>
																		<i
																			className="ri-play-large-fill"
																			style={{
																				paddingLeft:
																					windowWidth >
																						580
																						? "0.5rem"
																						: "0rem",
																			}}
																		>
																		</i>
																	</button>
																</a>
															</div>
														</div>
													</div>
												);
											})}
									</section>
								</div>
							</section>
							{/*Information Plane*/}
							<section
								className="overflow-hidden w-full h-full"
								style={{
									display: windowWidth > 1050
										? "inline-block"
										: "none",
								}}
							>
								<div
									className="w-full h-full flex flex-col rounded-lg p-6"
									style={{ background: "#F1F1F7" }}
								>
									<div
										className="p-4 bg-white rounded-lg flex flex-row w-full"
										style={{ marginBottom: "1rem" }}
									>
										<span
											className="flex flex-row justify-center items-center text-white p-2 rounded-lg flex-1 hover:cursor-pointer"
											style={{
												margin: "0 0.25rem 0 0.25rem",
												flex: activeTab === 0
													? "1 1 0%"
													: "0 0 0%",
												background: activeTab === 0
													? "#2563eb"
													: "#FFFFFF",
												color: activeTab === 0
													? "#FFFFFF"
													: "#000000",
												transformOrigin: "left",
											}}
											onClick={() => setActiveTab(0)}
										>
											Activity
										</span>
										<span
											className="flex flex-row justify-center items-center text-black p-2 hover:cursor-pointer rounded-lg hover:bg-[#db1640] hover:text-white transition-all duration-300"
											style={{
												margin: "0 0.25rem 0 0.25rem",
												flex: activeTab === 1
													? "1 1 0%"
													: "0 0 0%",
												background: activeTab === 1
													? "#db1640"
													: "#FFFFFF",
												color: activeTab === 1
													? "#FFFFFF"
													: "#000000",
												transformOrigin: "center",
											}}
											onClick={() => setActiveTab(1)}
										>
											Leaderboard
										</span>
										<span
											className="hover:bg-[#14c46c] hover:text-white transition-all duration-300 flex flex-row justify-center items-center text-black p-2 hover:cursor-pointer rounded-lg"
											style={{
												margin: "0 0.25rem 0 0.25rem",
												flex: activeTab === 2
													? "1 1 0%"
													: "0 0 0%",
												background: activeTab === 2
													? "#14c46c"
													: "#FFFFFF",
												color: activeTab === 2
													? "#FFFFFF"
													: "#000000",
												transformOrigin: "right",
											}}
											onClick={() => setActiveTab(2)}
										>
											Resources
										</span>
									</div>
									<div className="bg-white rounded-lg flex-1 flex flex-row justify-start items-start text-black p-10 overflow-y-scroll">
										{activeTab === 0 && (
											<h1 className="text-3xl">
												Activity Board
											</h1>
										)}
										{activeTab === 1 && (
											<h1 className="text-3xl">
												Leaderboard
											</h1>
										)}
										{activeTab === 2 && (
											<div className="w-full overflow-scroll">
												<h1
													className="text-3xl"
													style={{
														paddingBottom: "1rem",
													}}
												>
													Resources
												</h1>
												<div
													className="flex flex-col"
													style={{ gap: "1rem" }}
												>
													<a
														className="block p-10 rounded-lg hover:cursor-pointer hover:bg-[#F7F7F7] transition-all duration-300 ease-in-out"
														href="https://ubc.ca1.qualtrics.com/jfe/form/SV_0iatNPaGA9vrtNs"
													>
														<h2 className="text-xl font-normal">
															Learning Tool
															Consent Form
														</h2>
														<p className="text-xl font-light">
															If you want to
															participate in the
															study, please
															carefully read and
															fill out this
															consent form.
														</p>
													</a>
													<a
														className="block p-10 rounded-lg hover:cursor-pointer hover:bg-[#F7F7F7] transition-all duration-300 ease-in-out"
														href="https://ubc.ca1.qualtrics.com/jfe/form/SV_8dJXEAiEY8taLK6"
													>
														<h2 className="text-xl font-normal">
															Questionnaire
															Consent Form
														</h2>
														<p className="text-xl font-light">
															If consented to
															participating in the
															study, please
															carefully read and
															fill out this work
															to answer the
															questionnaire about
															your experience
															using the tool.
														</p>
													</a>
													<a
														className="block p-10 rounded-lg hover:cursor-pointer hover:bg-[#F7F7F7] transition-all duration-300 ease-in-out"
														href="https://ubc.ca1.qualtrics.com/jfe/form/SV_9GH46OEAUicbf4a"
													>
														<h2 className="text-xl font-normal">
															Questionnaire
														</h2>
														<p className="text-xl font-light">
															Fill out the
															following
															questionnaire to
															tell me about your
															experience using the
															tool and it’s
															effectiveness.
														</p>
													</a>
												</div>
											</div>
										)}
									</div>
								</div>
							</section>
						</section>
					</main>
				)
				: <LoadingComponent />}
		</section>
	);
}

export default Dashboard;
