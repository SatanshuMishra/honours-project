import fetchStats from "./FetchStats";
export default async function sendStatisticsForProcessing() {
	try {
		let matrix = await fetchStats();

		if (!matrix) throw new Error("Statistics is null!");

		console.log("Processing Statistics...\n ", matrix);
		const res = await fetch("../questionnaire/api/processstatistics", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ matrix }),
			cache: "no-cache",
			credentials: "include",
		});

		let resBody: {
			data: any;
			status: number;
		} = JSON.parse(await res.text());

		console.log("Fetched Predictions: ", resBody.data);

		return resBody.data;
	} catch (error) {
		console.error("[FETCH STATS] Error:\n", error);
	}
}
