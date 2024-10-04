"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ForgotPasswordSVG from "@/public/unDraw_ForgotPassword.svg";
import ULearnLogo from "../components/uLearnLogo/ULearnLogo";
import Input from "../components/formElements/Input";
import 'remixicon/fonts/remixicon.css'
import HttpStatusCode from "../types/HttpStatusCode";

type SubmitProps = {
	fullname: string;
	username: string;
};

export default function ForgotPassword() {
	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			fullname: "",
			username: "",
		},
		onSubmit: (values) => {
			handleSubmitValues(values);
		},
	});

	const handleSubmitValues = async ({ fullname, username }: SubmitProps) => {
		const validateUserRequest = await fetch(`./forgotpassword/api/validateCredentials`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				fullname,
				username
			}),
			cache: "no-cache",
		});

		let validateUserResponse: {
			status: HttpStatusCode;
			data: {
				validated: boolean,
				token: string | null
			};
			message: string;
		} = JSON.parse(await validateUserRequest.text());

		console.info("Forgot Password Response: ", validateUserResponse.data);

		if (validateUserResponse.status === 202 && validateUserResponse.data.validated)
			router.push(`/resetpassword?token=${validateUserResponse.data.token}`);
	}

	return (
		<main className="h-screen w-screen p-6 bg-[#F36262] mobile:bg-transparent">
			<section className="h-full w-full rounded-lg shadow-lg flex flex-row justify-evenly bg-white">
				<section className="w-full h-full flex flex-col justify-between overflow-y-scroll overflow-x-hidden">
					<div className="w-full">
						<div className="p-4">
							<ULearnLogo />
						</div>
						<div className="w-full h-full p-8">
							<h1 className="font-bold text-[40px] my-4">Register</h1>
							<form className="w-full" onSubmit={formik.handleSubmit}>
								<Input name="Full Name" htmlFor="fullname" onChangeFunction={formik.handleChange} />
								<Input name="Username" htmlFor="username" onChangeFunction={formik.handleChange} />
								<button className="w-full px-4 py-2 my-4 font-semibold text-xl text-white bg-blue-600 hover:bg-blue-700 rounded-lg" type="submit">Reset Password</button>
							</form>
							<div className="w-full flex flex-row justify-center">
								<a className="text-center text-lg font-light hover:cursor-pointer" href="./user-auth"><i className="ri-arrow-left-line text-lg pr-2"></i>Back to Log In</a>
							</div>
						</div>
					</div>
					<div className="flex flex-row justify-evenly py-8">
						<span className="h-4 w-[15rem] bg-blue-600 rounded-full"></span>
						<span className="h-4 w-[15rem] bg-[#cccccc] rounded-full"></span>
					</div>
				</section>
				<section className="hidden mobile:inline-block w-full h-full p-4">
					<div className="w-full h-full bg-[#F36262] rounded-lg flex flex-col justify-center items-center">
						<Image src={ForgotPasswordSVG} alt="LoginSVG" className="h-fit w-full mobile:w-fit p-8" priority={true} />
					</div>
				</section>
			</section>
		</main>
	);
}
