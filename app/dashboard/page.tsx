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
import SVGTopic from "@/public/SVG-Topic.svg";
import { useToast } from "@/components/ui/use-toast";

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
	const { toast } = useToast();

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

				console.log(res);

				setStudentID(res.studentID);
				setStudentName(res.name);
				setStudentUsername(res.username);

				return;
			}
			Cookies.remove("token");
			router.push("/user-auth");
		});
	}, []);

	async function processData() {
		try {
			const res = await fetch("./questionnaire/api/processResults", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					studentID: "c7150987-bd41-4273-8c36-912ddc6f78e7",
					topicID: "7de79cc9-a727-4622-a6e0-aaff239c8187",
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
		} catch (error) {
			throw new Error("IRT model failed to process results.");
		}
	}

	async function fetchTopics() {
		try {
			const response = await fetch("/dashboard/api/fetchTopics", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: null,
				cache: "no-cache",
				credentials: "include",
			});
			let responseBody: {
				data: QuestionTopic[];
				status: number;
				message: string;
				pgErrorObject: any | null;
			} = JSON.parse(await response.text());
			if (responseBody.status === 400)
				throw new Error(
					"An error occured during the pre-processing and fetching of statistics."
				);
			setTopics(responseBody.data);
		} catch (error: any) {
			toast({
				title: "Error",
				description: "There was an error fetching the topics.",
				variant: "destructive",
			});
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
		<section className="w-full h-full bg-[#f0f4f9]">
			{studentID && studentName && studentUsername ? (
				<>
					<section className="p-10">
						<section className="flex flex-row-reverse m-4 sticky">
							<button
								className="text-lg p-2 text-[#00a65e] rounded-[10px] w-fit font-medium bg-transparent border-[2px] border-[#00a65e] hover:bg-[#00a65e] transition-all duration-300 ease-in-out hover:text-white font-jetbrains-mono"
								onClick={() => handleSignOut()}
							>
								Sign Out
							</button>
							<a
								href="https://forms.gle/PCn5L91D3ihFBALw8"
								target="_blank"
							>
								<button className="text-lg p-2 mr-2 text-[#de2f4f] rounded-[10px] w-fit font-medium bg-transparent border-[2px] border-[#de2f4f] hover:bg-[#de2f4f] transition-all duration-300 ease-in-out hover:text-white font-jetbrains-mono">
									Report an Issue
								</button>
							</a>
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
					<section className="m-10 p-2 flex flex-row flex-wrap">
						{topics &&
							topics.map((topic, _) => {
								return (
									<a
										key={_}
										href={`/questionnaire/${topic.topicID}`}
										className="block w-fit mr-2"
									>
										<div className="bg-white shadow-lg drop-shadow-md hover:shadow-2xl transition-all duration-300 w-fit p-8 rounded-xl flex flex-col justify-between items-center cursor-pointer">
											<Image
												src={Domino}
												alt="Recursion Icon"
												className="w-[146px] h-[146px] my-2"
												priority
											/>
											<h4 className="font-light my-2 text-xl font-jetbrains-mono">
												{topic.name}
											</h4>
										</div>
									</a>
								);
							})}
						{!topics && (
							<div className="flex flex-row w-full justify-center items-center">
								<Image
									src={SVGTopic}
									alt="Recursion Icon"
									className="w-[400px] h-[400px] my-2"
									priority
								/>
							</div>
						)}
					</section>
					<div className="rounded-full flex flex-row justify-between items-center absolute left-1/2 bottom-10 bg-black w-fit -translate-x-1/2 py-1 px-2 translate-y-0.5 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
						<p className="bg-gradient-to-r from-blue-400 to-white text-transparent bg-clip-text text-lg font-medium mx-2 select-none font-jetbrains-mono">
							Developer Tools
						</p>
						<div className="flex-1 flex flex-row justify-center mx-1">
							<button
								className="text-lg w-10 h-10 text-white rounded-full font-normal bg-black hover:bg-gray-800 hover:cursor-pointer"
								onClick={() => parseJSON()}
							>
								<i className="ri-database-2-fill"></i>
							</button>
							<button
								className="text-lg w-10 h-10 text-white rounded-full font-normal bg-black hover:bg-gray-800 hover:cursor-pointer"
								onClick={() => processData()}
							>
								<i className="ri-bard-fill"></i>
							</button>
							<button className="text-lg w-10 h-10 text-white rounded-full font-normal bg-black hover:bg-gray-800 hover:cursor-not-allowed">
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
