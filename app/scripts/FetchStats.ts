export default async function fetchStats() {
  try {
    const res = await fetch("../questionnaire/api/fetchperformancestatistics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
      cache: "no-cache",
      credentials: "include",
    });

    let resBody: {
      data: any;
      status: number;
    } = JSON.parse(await res.text());

    if (resBody.status === 400)
      throw new Error(
        "An error occured during the pre-processing and fetching of statistics.",
      );

    console.log("Fetched Statistics: ", resBody.data);

    return resBody.data;
  } catch (error) {
    console.error("[FETCH STATS] Error:\n", error);
  }
}
