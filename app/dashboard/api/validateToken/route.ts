import jwt from "jsonwebtoken";
import { headers } from "next/headers";

export async function POST() {
	try {
		const headersInstance = headers();
		const authHeader = headersInstance.get("authorization") ?? "";

		const token = authHeader.split(" ")[1];
		console.log("Token: ", token);
		//process.env.JWT_SECRET
		const decoded = jwt.verify(
			token,
			"Hny2onndyOidLxzeMM1K6DQLK+6ce+sLuphrIAfuHU4="
		);
		// IF CODE REACHES THIS POINT, THE TOKEN HAS BEEN SUCCESSFULLY VERIFIED. ELSE, THE AN ERROR WILL BE THROWN BY THE jwt.verify FUNCTION ABOVE
		return new Response(
			JSON.stringify({
				data: decoded,
				message: "Token Verified",
				status: 200,
				jwtError: null,
			})
		);
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return new Response(
				JSON.stringify({
					data: null,
					message: "Token has Expired!",
					status: 401,
					jwtError: error,
				})
			);
		} else {
			return new Response(
				JSON.stringify({
					data: null,
					message: "Unauthorized Access!",
					status: 401,
					jwtError: error,
				})
			);
		}
	}
}
