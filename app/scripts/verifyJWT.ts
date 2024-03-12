import Cookies from "js-cookie";
import validateToken from "./validateToken";

/**
 * Validates the JWT. Returns `boolean` response. If `getData = true`, returns stringified `JSON Object` with the JWT data.
 */

export default async function verifyJWT(
	getData: boolean = false
): Promise<boolean | string> {
	const token = Cookies.get("token");

	//  INFORMATION: RETURN TO SIGN-IN IF JWT DOESN'T EXIST.

	if (!token) return false;

	//  INFORMATION: VALIDATE TOKEN.

	return await validateToken(token, getData);
}
