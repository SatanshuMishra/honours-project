import verifyJWT from "@/app/scripts/verifyJWT";

export async function POST() {
	try {
		verifyJWT(false).then((response) => {
			if (response === false) {
				return new Response(
					JSON.stringify({
						data: null,
						status: 418,
						message:
							"A valid token doesn't exist. Sign-Out failed.",
						pgErrorObject: null,
					})
				);
			}
		});

		return new Response(
			JSON.stringify({
				data: null,
				status: 200,
				message: `Student account exists and can be signed out successfully.`,
				pgErrorObject: null,
			})
		);
	} catch (error: any) {
		console.error(error);
		return new Response(
			JSON.stringify({
				data: null,
				status: 500,
				message: `Something went wrong. Student cannot be signed-out successfully.`,
				pgErrorObject: null,
			})
		);
	}
}
