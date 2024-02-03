import TokenRes from "../types/tokenResponse";

export default async function validateToken(token: string){
	try {
		const res = await fetch("../user-auth/api/validateToken", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: null,
			cache: "no-cache",
			credentials: "include",
		});
		let resBody: TokenRes = JSON.parse(await res.text());
		if (resBody.status === 401) {
			return false;
		} else {
			return resBody.data?.studentID;
		}
	} catch (error) {
		console.error("[VALIDATE TOKEN] Error:\n", error);
		return false;
	}
}
