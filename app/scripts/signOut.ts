export default async function signOut(): Promise<boolean> {
	try {
		const res = await fetch("../user-auth/api/signOut", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: null,
			cache: "no-cache",
			credentials: "include",
		});

		let response: {
			data: null;
			status: number;
			message: string;
			pgErrorObject: null;
		} = JSON.parse(await res.text());

		console.info("Endpoint: Sign-Out\nResponse: ", response);
		return true;
	} catch (error: any) {
		console.error("Sign Out was unsuccessful.", error);
		return false;
	}
}
