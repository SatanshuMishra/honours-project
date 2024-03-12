"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Domino from "@/public/domino.svg";
import parseJSON from "../scripts/parseJSON";
import Loading from "../components/loading/loading";
import verifyJWT from "../scripts/verifyJWT";
import signOut from "../scripts/signOut";

function Dashboard() {
	const router = useRouter();
	const [studentID, setStudentID] = useState<any>();
	const [studentName, setStudentName] = useState("");
	const [studentUsername, setStudentUsername] = useState("");

	// TEMPORARY TEST VARIABLES
	const [_, setStatistics] = useState<any[]>();

	useEffect(() => {
		// VALIDATE TOKEN AND SET PARSED STUDENT ID
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

	async function handleSignOut(): Promise<void> {
		await signOut();
		Cookies.remove("token");
		router.push("/user-auth");
	}

	return (
		<section className="w-full h-full">
			{studentID && studentName && studentUsername ? (
				<>
					<section className="flex flex-row-reverse m-4 sticky">
						<button
							className="text-lg p-2 text-white rounded-lg w-fit font-normal bg-pink-600"
							onClick={() => handleSignOut()}
						>
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
							onClick={() => fetchStats()}
						>
							FETCH MODEL
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
