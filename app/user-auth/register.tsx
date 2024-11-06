"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import RegisterSVG from "../../public/unDraw_Register.svg";
import Input from "../components/formElements/Input";
import ULearnLogo from "../components/uLearnLogo/ULearnLogo";
import { useFormik } from "formik";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ToastAction } from "@/components/ui/toast";

type AuthProps = {
	setSignIn: (arg0: boolean) => void;
	displaySignIn: boolean;
};

const registerSchema = z.object({
	name: z.string().min(1, "Full name is required"),
	username: z.string().min(1, "Username is required"),
	password: z.string()
		.min(8, "Password must be at least 8 characters"),
	confpassword: z.string()
		.min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confpassword, {
	message: "Passwords must match",
	path: ["confpassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function SignUp({ setSignIn, displaySignIn }: AuthProps) {
	const { toast } = useToast();
	const [isMatching, setIsMatching] = useState(false);

	const formik = useFormik<RegisterFormValues>({
		initialValues: {
			name: "",
			username: "",
			password: "",
			confpassword: "",
		},
		validationSchema: toFormikValidationSchema(registerSchema),
		onSubmit: (values) => {
			handleSignUp(values);
		},
	});

	useEffect(() => {
		if (formik.values.password && formik.values.confpassword) {
			setIsMatching(formik.values.password === formik.values.confpassword);
		}
	}, [formik.values.password, formik.values.confpassword]);

	const handleSignUp = async (values: RegisterFormValues) => {
		const response = await fetch(`./user-auth/api/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
			cache: "no-cache",
		});
		const res: {
			data: string | null;
			status: number;
			message: string;
			pgErrorObject: any | null;
		} = JSON.parse(await response.text());

		console.info("Sign-Up Response: ", res);

		if (res.status === 201) {
			toast({
				title: "Sign-Up Successful",
				description: "You were signed up successfully! Please login to access the quiz.",
				action: <ToastAction altText="Try again">Ok</ToastAction>
			});
			setSignIn(true);
		} else {
			if (res.status === 422) {
				toast({
					title: "Security Risks Detected",
					description: "Possible security risks detected in your inputs for name, username or password. Please review your inputs and try again!",
					variant: "destructive",
					action: <ToastAction altText="Try again">Try again</ToastAction>
				});
			}
			if (res.status === 500 && res.pgErrorObject?.name === "PrismaClientKnownRequestError") {
				toast({
					title: "Sign-Up Failed",
					description: "You are using the same student code as another student. Please use a unique code.",
					variant: "destructive",
					action: <ToastAction altText="Try again">Try again</ToastAction>
				});
			}
		}
	};

	const getPasswordFieldStyle = (fieldName: "password" | "confpassword") => {
		if (formik.touched[fieldName] && formik.touched.confpassword) {
			return isMatching
				? "border-teal-600 focus:!border-teal-600"
				: "border-pink-600 focus:!border-pink-600";
		}
		return "focus:border-black";
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
							<h1 className="font-bold text-[40px] my-4 text-black">
								Register
							</h1>
							<form className="w-full" onSubmit={formik.handleSubmit}>
								<Input
									name="Full Name"
									htmlFor="name"
									onChangeFunction={formik.handleChange}
									handleOnBlur={formik.handleBlur}
									error={formik.touched.name && formik.errors.name}
								/>
								<Input
									name="Username"
									htmlFor="username"
									onChangeFunction={formik.handleChange}
									handleOnBlur={formik.handleBlur}
									description="This username should have been pre-assigned to you by your instructor. No other usernames will be accepted."
									error={formik.touched.username && formik.errors.username}
								/>
								<Input
									name="Password"
									isPassword={true}
									htmlFor="password"
									onChangeFunction={formik.handleChange}
									handleOnBlur={formik.handleBlur}
									description={
										formik.touched.password && formik.touched.confpassword
											? isMatching
												? `Passwords match!`
												: `Passwords do not match.`
											: ``
									}
									additionalCSS={getPasswordFieldStyle("password")}
									error={formik.touched.password && formik.errors.password}
								/>
								<Input
									name="Confirm Password"
									isPassword={true}
									htmlFor="confpassword"
									onChangeFunction={formik.handleChange}
									handleOnBlur={formik.handleBlur}
									additionalCSS={getPasswordFieldStyle("confpassword")}
									error={formik.touched.confpassword && formik.errors.confpassword}
								/>
								<button
									className="w-full px-4 py-2 my-4 font-semibold text-xl text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
									type="submit"
									style={{ background: "#165EF0" }}
								>
									Start your Learning Journey
								</button>
							</form>
						</div>
					</div>
					<div className="w-full p-8">
						<p className="w-auto text-lg font-light py-2 text-black">
							Already have an account?
						</p>
						<a
							className="inline-block w-full px-4 py-2 font-semibold text-xl text-center hover:cursor-pointer text-white bg-black hover:bg-gray-700 rounded-lg"
							onClick={() => setSignIn(!displaySignIn)}
						>
							Sign In
						</a>
					</div>
				</section>
				<section className="hidden mobile:inline-block w-full h-full p-4">
					<div className="w-full h-full bg-[#E261C6] rounded-lg flex flex-col justify-center items-center">
						<Image
							src={RegisterSVG}
							alt="LoginSVG"
							className="h-fit w-full mobile:w-fit p-8"
							priority={true}
						/>
					</div>
				</section>
			</section>
		</main>
	);
}

export default SignUp;
