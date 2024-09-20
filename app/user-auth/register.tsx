'use client';

import Image from "next/image";
import React from "react";
import RegisterSVG from "../../public/unDraw_Register.svg";
import Input from "../components/formElements/Input";
import ULearnLogo from "../components/uLearnLogo/ULearnLogo";
import { useFormik } from "formik";


type AuthProps = {
	setSignIn: (arg0: boolean) => void;
	displaySignIn: boolean;
};

function SignUp({ setSignIn, displaySignIn }: AuthProps) {
	const formik = useFormik({
		initialValues: {
			name: "",
			username: "",
			password: "",
		},
		onSubmit: (values) => {
			handleSignUp(values);
		},
	});

	const handleSignUp = async (values: {
		name: string;
		username: string;
		password: string;
	}) => {
		const response = await fetch(`./user-auth/api/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
			cache: "no-cache",
		});
		let res: {
			data: string | null;
			status: number;
			message: string;
			pgErrorObject: any | null;
		} = JSON.parse(await response.text());

		console.info("Sign-Up Respnse: ", res);

		if (res.status === 201) {
			console.debug("Entered Router Container.");
			// toast({
			// 	title: "Sign-Up Succesful",
			// 	description: "You were signed up successfully! Please login to access the quiz.",
			// 	variant: "default",
			// })
			setSignIn(true);
		} else {
			if (res.status === 422) {
				// toast({
				// 	title: "Security Risks Detected",
				// 	description: "Possible security risks detected in your inputs for name, username or password. Please review your inputs and try again!",
				// 	variant: "destructive",
				// });
			}
			if (res.status === 500) {
				if (res.pgErrorObject.name === 'PrismaClientKnownRequestError') {
					// toast({
					// 	title: "Sign-Up Failed",
					// 	description: "You are using the same student code as another student. Please use an unique code.",
					// 	variant: "destructive",
					// });
				}
			}
		}
	};

	return (
		<main className="h-screen w-screen p-6 bg-[#E261C6] mobile:bg-transparent">
			<section className="h-full w-full rounded-lg shadow-lg flex flex-row justify-evenly bg-white">
				<section className="w-full h-full flex flex-col justify-between overflow-y-scroll overflow-x-hidden">
					<div className="w-full">
						<div className="p-4">
							<ULearnLogo />
						</div>
						<div className="w-full h-full p-8">
							<h1 className="font-bold text-[40px] my-4">Register</h1>
							<form className="w-full" onSubmit={formik.handleSubmit}>
								<Input name="Full Name" htmlFor="name" onChangeFunction={formik.handleChange} />
								<Input name="Username" htmlFor="username" onChangeFunction={formik.handleChange} description="This username should have been pre-assigned to you by your instructor. No other usernames will be accepted." />
								<Input name="Password" htmlFor="password" onChangeFunction={formik.handleChange} />
								<Input name="Confirm Password" htmlFor="confpassword" onChangeFunction={formik.handleChange} />
								<button className="w-full px-4 py-2 my-4 font-semibold text-xl text-white bg-blue-600 hover:bg-blue-700 rounded-lg" type="submit">Start your Learning Journey</button>
							</form>
						</div>
					</div>
					<div className="w-full p-8">
						<p className="w-auto text-lg font-light py-2">
							Already have an account?
						</p>
						<a
							className="inline-block w-full px-4 py-2 font-semibold text-xl text-center hover:cursor-pointer text-white bg-black hover:bg-gray-700 rounded-lg" onClick={() => setSignIn(!displaySignIn)}
						>
							Sign In
						</a>

					</div>
				</section>
				<section className="hidden mobile:inline-block w-full h-full p-4">
					<div className="w-full h-full bg-[#E261C6] rounded-lg flex flex-col justify-center items-center">
						<Image src={RegisterSVG} alt="LoginSVG" className="h-fit w-full mobile:w-fit p-8" priority={true} />
					</div>
				</section>
			</section>
		</main>
	);
}

export default SignUp;
