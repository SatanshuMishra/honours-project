"use client";
import { useRouter } from "next/navigation";
import React, { useEffect , useState} from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Domino from "@/public/domino.svg";
import parseJSON from "../scripts/parseJSON";
import validateToken from "../scripts/validateToken";

function Dashboard() {
	const router = useRouter();
	const [studentID, setStudentID] = useState();

	useEffect(() => {
		const token = Cookies.get("token");
			
		// CHECK IF JWT TOKEN EXISTS. IF NOT, RETURN TO AUTH.
		if (!token) {
			router.replace("/user-auth");
			return;
		}

		// VALIDATE JWT TOKEN
		// const validateToken = async () => {
		// 	try {
		// 		const res = await fetch("./user-auth/api/validateToken", {
		// 			method: "POST",
		// 			headers: {
		// 				"Content-Type": "application/json",
		// 				Authorization: `Bearer ${token}`,
		// 			},
		// 			body: null,
		// 			cache: "no-cache",
		// 			credentials: "include",
		// 		});
		// 		let resBody: {
		// 			data: {
		// 				exp: number;
		// 				iat: number;
		// 				studentID: any;
		// 			} | null;
		// 			message: string;
		// 			status: number;
		// 			jwtError: any | null;
		// 		} = JSON.parse(await res.text());
		// 		if (resBody.status === 401) {
		// 			console.log(resBody);
		// 			Cookies.remove("token");
		// 			router.push("/user-auth");
		// 		} else {
		// 			console.log(resBody.data?.studentID);
		// 		}
		// 	} catch (error) {
		// 		console.error(error);
		// 		router.push("/user-auth");
		// 	}
		// };
		// validateToken();

		validateToken(token).then((response) => {
			if(!response)
				router.push("/user-auth");
			else
				setStudentID(response);
		});	
	}, []);

	console.log("StudentID:\n", studentID);

	return (
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
			</section>
			<section className="m-10 p-2">
				<div>
					<h1 className="font-bold text-4xl">
						Welcome,
						<br />
						<span className="font-normal">Satanshu Mishra</span>
					</h1>
				</div>
			</section>
			<section className="m-10 p-2">
				<a href="/sandbox" className="block w-fit">
					<div className="shadow-lg drop-shadow-md hover:shadow-2xl transition-all duration-300 w-fit p-8 rounded-xl flex flex-col justify-between items-center cursor-pointer">
						<Image
							src={Domino}
							alt="Recursion Icon"
							className="w-[146px] h-[146px] my-2"
						/>
						<h4 className="font-light my-2 text-xl">Recursion</h4>
					</div>
				</a>
			</section>
		</>
	);
}

export default Dashboard;
