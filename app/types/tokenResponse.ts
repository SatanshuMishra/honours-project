import Student from "./student";

export default interface TokenRes {
  data: {
    studentID: Student["studentID"];
    name: Student["name"];
    username: Student["username"];
    exp: number;
    iat: number;
  } | null;
  message: string;
  status: number;
  jwtError: any | null;
}
