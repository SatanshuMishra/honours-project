import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {
		// const requestText = await request.text();
		// const requestBody = JSON.parse(requestText);

		/* 		console.info("Data Recieved: ", requestBody); */

		const categoryData = {
			A: [1, 0, 1, 1, 0, 1, 0],
			B: [0, 1, 1, 1, 0, 1, 1],
			C: [0, 0, 1, 1, 0, 1, 1],
			D: [0, 0, 1, 1, 0, 1, 1],
			E: [0, 0, 1, 1, 0, 1, 1],
			F: [0, 0, 1, 1, 0, 1, 1]
			// ... other categories
		};

		const response = await fetch(
			"http://localhost:8728/estimate_difficulty",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(categoryData),
				cache: "no-cache",
				credentials: "include",
			}
		);

		console.info(response);

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
