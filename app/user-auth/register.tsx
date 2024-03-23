'use client';

import Image from "next/image";
import React from "react";
import RegisterSVG from "../../public/unDraw_Register.svg";
import { useFormik } from "formik";
import { useToast } from "@/components/ui/use-toast";

type AuthProps = {
	setSignIn: (arg0: boolean) => void;
	displaySignIn: boolean;
};

function SignUp({ setSignIn, displaySignIn }: AuthProps) {
	const { toast } = useToast();

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
			toast({
				title: "Sign-Up Succesful",
				description: "You were signed up successfully! Please login to access the quiz.",
				variant: "default",
			})
			setSignIn(true);
		} else {
			if (res.status === 422) {
				toast({
					title: "Security Risks Detected",
					description: "Possible security risks detected in your inputs for name, username or password. Please review your inputs and try again!",
					variant: "destructive",
				})
			}
			if (res.status === 500) {
				if (res.pgErrorObject.name === 'PrismaClientKnownRequestError') {
					toast({
						title: "Sign-Up Failed",
						description: "You are using the same student code as another student. Please use an unique code.",
						variant: "destructive",
					});
				}
			}
		}
	};

	return (
		<section className="flex flex-row-reverse justify-evenly items-center w-screen h-screen">
			<div className="w-full max-w-3xl flex flex-col justify-center items-center bg-white shadow-xl rounded-lg p-10 min-w-[20rem] mx-10">
				<div className="w-full flex flex-col justify-center items-start">
					<h1 className="text-5xl font-bold my-10">REGISTER</h1>
					<form
						className="w-full flex flex-col justify-center items-start text-black text-xl mb-5"
						onSubmit={formik.handleSubmit}
					>
						<label className="font-bold my-2" htmlFor="name">
							FULL NAME
						</label>
						<input
							className="p-2 border-2 border-black rounded-lg w-full"
							id="name"
							type="text"
							onChange={formik.handleChange}
						/>
						<label className="font-bold mt-2" htmlFor="username">
							USERNAME
						</label>
						<p className="font-light mb-2">
							Please use the code provided to you by the professor. No other usernames will be accepted.
						</p>
						<input
							className="p-2 border-2 border-black rounded-lg w-full"
							id="username"
							type="text"
							onChange={formik.handleChange}
						/>
						<label className="font-bold my-2" htmlFor="password">
							PASSWORD
						</label>
						<input
							className="p-2 border-2 border-black rounded-lg w-full"
							id="password"
							type="password"
							onChange={formik.handleChange}
						/>
						<button
							className="p-2 text-white rounded-lg w-full font-bold my-5 bg-[#1FC2FF] hover:bg-[#2ebef2]"
							type="submit"
						>
							CREATE AN ACCOUNT
						</button>
					</form>
				</div>
				<p className="text-xl my-5 w-full text-center"> - OR - </p>
				<p className="text-xl w-full text-left">
					Already have an account? You can access login below:
				</p>
				<button
					className="text-xl p-2 text-white rounded-lg w-full font-bold my-5 bg-[#82D400] hover:bg-[#78c200]"
					onClick={() => {
						setSignIn(!displaySignIn);
					}}
				>
					LOG IN
				</button>
			</div>
			<div className="hidden w-full xl:flex flex-col justify-center items-center mx-10">
				<Image
					src={RegisterSVG}
					alt="RegisterSVG"
					className="h-fit w-auto"
					priority={true}
				/>
			</div>
		</section>
	);
}

export default SignUp;
