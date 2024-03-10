import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {
		// const requestText = await request.text();
		// const requestBody = JSON.parse(requestText);

/* 		console.info("Data Recieved: ", requestBody); */

		const response = await fetch(
			"http://localhost:7218/estimate_difficulty",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: "",
				cache: "no-cache",
				credentials: "include",
			}
		);

		if (!response.ok) console.error("Something went wrong with REST API!");

		return new Response(
			JSON.stringify({
				data: null,
				status: 201,
			})
		);
	} catch (e) {
		console.log(e);
		return new Response(
			JSON.stringify({
				data: null,
				status: 501,
			})
		);
	}
}
