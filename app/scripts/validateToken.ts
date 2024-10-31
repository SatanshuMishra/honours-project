import TokenRes from "../types/tokenResponse";

/**
 * Validates the given token and returns user data as a JSON string if valid.
 * @param token The token to validate.
 * @returns A promise that resolves to either `false` if the token is invalid,
 * or a stringified `JSON Object` with the user data if the token is valid. 
 *
 * If data is provided, then it will return either a promise a stringified `JSON Object` or `boolean` based on the value of data.
 */

export default async function validateToken(
	token: string,
	data: boolean = true
): Promise<boolean | string> {
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
		const resBody: TokenRes = JSON.parse(await res.text());
		if (resBody.status === 401) return false;

		if (data)
			return JSON.stringify({
				studentID: resBody.data?.studentID,
				name: resBody.data?.name,
				username: resBody.data?.username,
			});

		return true;
	} catch (error) {
		console.error("[VALIDATE TOKEN] Error:\n", error);
		return false;
	}
}
