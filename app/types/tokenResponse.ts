export default interface TokenRes {
	data: {
		studentID: string;
		name: string;
		username: string;
		exp: number;
		iat: number;	
	} | null;
	message: string;
	status: number;
	jwtError: any | null;
}
