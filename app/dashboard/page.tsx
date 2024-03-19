"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Domino from "@/public/domino.svg";
import parseJSON from "../scripts/parseJSON";
import verifyJWT from "../scripts/verifyJWT";
import signOut from "../scripts/signOut";
import dynamic from "next/dynamic";
import "remixicon/fonts/remixicon.css";
import QuestionTopic from "../types/questionTopic";
import Papa from "papaparse";

const LoadingComponent = dynamic(
	() => import("../components/loading/loading"),
	{
		ssr: false,
	}
);

function Dashboard() {
	const router = useRouter();
	const [studentID, setStudentID] = useState<any>();
	const [studentName, setStudentName] = useState("");
	const [studentUsername, setStudentUsername] = useState("");
	const [topics, setTopics] = useState<QuestionTopic[] | null>(null);

	// TEMPORARY TEST VARIABLES
	const [_, setStatistics] = useState<any[]>();

	useEffect(() => {
		//  INFORMATION: VALIDATE TOKEN AND SET PARSED STUDENT ID

		verifyJWT(true).then((response) => {
			//  INFORMATION: IF JWT IS NOT VALID, RETURN USER TO AUTH

			if (response === false) {
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

				setStudentID(res.studentID);
				setStudentName(res.name);
				setStudentUsername(res.username);

				return;
			}

			console.error("Unexpected response type: ", response);
			Cookies.remove("token");
			router.push("/user-auth");
		});
	}, []);

	async function fetchStats() {
		try {
			const res = await fetch("./questionnaire/api/processResults", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					studentID: "490c7a50-d7c2-4129-a886-f4b920a2c345",
					topicID: "a41e4f4f-0d9f-4441-989d-98d71342dc47",
				}),
				cache: "no-cache",
				credentials: "include",
			});

			let resBody: {
				data: any;
				status: number;
			} = JSON.parse(await res.text());

			if (resBody.status === 400)
				throw new Error(
					"An error occured during the pre-processing and fetching of statistics."
				);

			setStatistics(resBody.data);
			console.log(resBody.data);
			console.log("STATS SET!");
		} catch (error) {
			console.error("[FETCH STATS] Error:\n", error);
		}
	}

	async function fetchTopics() {
		try {
			const res = await fetch("/dashboard/api/fetchTopics", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: null,
				cache: "no-cache",
				credentials: "include",
			});

			let resBody: {
				data: QuestionTopic[];
				status: number;
				message: string;
				pgErrorObject: any | null;
			} = JSON.parse(await res.text());

			if (resBody.status === 400)
				throw new Error(
					"An error occured during the pre-processing and fetching of statistics."
				);

			setTopics(resBody.data);
			console.log(resBody.data);
			console.log("Topics Set!");
		} catch (error) {
			console.error("[FETCH Topics] Error:\n", error);
		}
	}

	useEffect(() => {
		if (!studentID) return;
		fetchTopics();
	}, [studentID]);

	async function handleSignOut(): Promise<void> {
		await signOut();
		Cookies.remove("token");
		router.push("/user-auth");
	}

	return (
		<section className="w-full h-full">
			{studentID && studentName && studentUsername ? (
				<>
					<section className="p-10">
						<section className="flex flex-row-reverse m-4 sticky">
							<button
								className="text-lg p-2 text-[#de2f4f] rounded-[10px] w-fit font-medium bg-transparent border-[2px] border-[#de2f4f] hover:bg-[#de2f4f] transition-all duration-300 ease-in-out hover:text-white font-jetbrains-mono"
								onClick={() => handleSignOut()}
							>
								Sign Out
							</button>
						</section>
						<div>
							<h1 className="font-bold text-[40px] font-jetbrains-mono">
								Welcome,
								<br />
								<span className="font-normal font-jetbrains-mono">
									{studentName}
								</span>
							</h1>
						</div>
					</section>
					<section className="m-10 p-2">
						{topics ? (
							topics.map((topic) => {
								return (
									<a
										href={`/questionnaire/${topic.topicID}`}
										className="block w-fit"
									>
										<div className="shadow-lg drop-shadow-md hover:shadow-2xl transition-all duration-300 w-fit p-8 rounded-xl flex flex-col justify-between items-center cursor-pointer">
											<Image
												src={Domino}
												alt="Recursion Icon"
												className="w-[146px] h-[146px] my-2"
											/>
											<h4 className="font-light my-2 text-xl font-jetbrains-mono">
												{topic.name}
											</h4>
										</div>
									</a>
								);
							})
						) : (
							<p>No Topics Fetched.</p>
						)}
					</section>
					<div className="rounded-full flex flex-row justify-between items-center absolute left-1/2 bottom-10 bg-black w-fit -translate-x-1/2 py-1 px-2 translate-y-0.5 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
						<p className="bg-gradient-to-r from-blue-400 to-white text-transparent bg-clip-text text-lg font-medium mx-2 select-none font-jetbrains-mono">
							Developer Tools
						</p>
						<div className="flex-1 flex flex-row justify-center mx-1">
							<button
								className="text-lg w-10 h-10 text-white rounded-full font-normal bg-black hover:bg-gray-800"
								onClick={() => parseJSON()}
							>
								<i className="ri-database-2-fill"></i>
							</button>
							<button
								className="text-lg w-10 h-10 text-white rounded-full font-normal bg-black hover:bg-gray-800"
								onClick={() => fetchStats()}
							>
								<i className="ri-bard-fill"></i>
							</button>
							<button
								className="text-lg w-10 h-10 text-white rounded-full font-normal bg-black hover:bg-gray-800"
								onClick={() => {}}
							>
								<i className="ri-graduation-cap-fill"></i>
							</button>
						</div>
					</div>
				</>
			) : (
				<LoadingComponent />
			)}
		</section>
	);
}

export default Dashboard;
