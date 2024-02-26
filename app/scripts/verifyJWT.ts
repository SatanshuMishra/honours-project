import Cookies from "js-cookie";
import validateToken from "./validateToken";

export default async function verifyJWT(getData: boolean = false) {
	const token = Cookies.get("token");

	// RETURN TO SIGN-IN IF JWT DOESN'T EXIST.
	if (!token) {
		return false;
	}

	const valid = await validateToken(token, getData);

	return valid;
}
