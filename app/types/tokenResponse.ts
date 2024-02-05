export default interface TokenRes {
	data: {
		exp: number;
		iat: number;
		studentID: any;
	} | null;
	message: string;
	status: number;
	jwtError: any | null;
}
