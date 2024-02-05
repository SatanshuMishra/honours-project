"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Domino from "@/public/domino.svg";
import parseJSON from "../scripts/parseJSON";
import validateToken from "../scripts/validateToken";
import fetchStudent from "../scripts/fetchStudent";
import Student from "../types/student";
import Loading from "../components/loading/loading";

function Dashboard() {
	const router = useRouter();
	const [studentID, setStudentID] = useState<any>();
	const [studentName, setStudentName] = useState("");
	const [studentUsername, setStudentUsername] = useState("");

	// TEMPORARY TEST VARIABLES
	const [statistics, setStatistics] = useState<any[]>();

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
				Buffer.from(response?.data)
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
				console.log("Response: ", response);
				setStudentName(response.name);
				setStudentUsername(response.username);
			});
		}
	}, [studentID]);

	async function fetchStats() {
		try {
			const res = await fetch(
				"./questionnaire/api/fetchperformancestatistics",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: null,
					cache: "no-cache",
					credentials: "include",
				}
			);

			let resBody: {
				data: any;
				status: number;
			} = JSON.parse(await res.text());

			if(resBody.status === 400)
				throw new Error("An error occured during the pre-processing and fetching of statistics.");

			setStatistics(resBody.data);
			console.log("STATS SET!");
		} catch (error) {
			console.error("[FETCH STATS] Error:\n", error);
		}
	}

	// Function to send statistics data to the server for TensorFlow processing
	async function sendStatisticsForProcessing() {	
		try {
			await fetchStats();

			if(!statistics)
				throw new Error("Statistics is null!");


			console.log("BEFSTATS: ", statistics);
			const res = await fetch(
				"./questionnaire/api/processstatistics",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({statistics}),
					cache: "no-cache",
					credentials: "include",
				}
			);

			let resBody: {
				data: any;
				status: number;
			} = JSON.parse(await res.text());

			console.log("STATSFETCH: ", resBody);
		} catch (error) {
			console.error("[FETCH STATS] Error:\n", error);
		}
	}

	return (
		<section className="w-full h-full">
			{studentID && studentName && studentUsername ? (
				<>
					<section className="flex flex-row-reverse m-4 sticky">
						<button className="text-lg p-2 text-white rounded-lg w-fit font-normal bg-pink-600">
							SIGN OUT
						</button>
						<button
							className="text-lg p-2 text-white rounded-lg w-fit font-normal bg-green-600"
							onClick={() => parseJSON()}
						>
							LOAD DATA
						</button>
						<button
							className="text-lg p-2 text-white rounded-lg w-fit font-normal bg-blue-600"
							onClick={() => sendStatisticsForProcessing()}
						>
							FETCH STATS
						</button>
					</section>
					<section className="m-10 p-2">
						<div>
							<h1 className="font-bold text-4xl">
								Welcome,
								<br />
								<span className="font-normal">
									{studentName}
								</span>
							</h1>
						</div>
					</section>
					<section className="m-10 p-2">
						<a href="/questionnaire" className="block w-fit">
							<div className="shadow-lg drop-shadow-md hover:shadow-2xl transition-all duration-300 w-fit p-8 rounded-xl flex flex-col justify-between items-center cursor-pointer">
								<Image
									src={Domino}
									alt="Recursion Icon"
									className="w-[146px] h-[146px] my-2"
								/>
								<h4 className="font-light my-2 text-xl">
									Recursion
								</h4>
							</div>
						</a>
					</section>
				</>
			) : (
				<Loading />
			)}
		</section>
	);
}

export default Dashboard;
