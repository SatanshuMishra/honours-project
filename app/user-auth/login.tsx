import Image from "next/image";
import React from "react";
import LoginSVG from "../../public/unDraw_Login.svg";
import ULearnLogo from "../components/uLearnLogo/ULearnLogo";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

import Input from "../components/formElements/Input";

type AuthProps = {
	setSignIn: (arg0: boolean) => void;
	displaySignIn: boolean;
};

export default function LogIn({ setSignIn, displaySignIn }: AuthProps) {
	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
		},
		onSubmit: (values) => {
			handleSignIn(values);
		},
	});

	const handleSignIn = async (values: {
		username: string;
		password: string;
	}) => {
		const response = await fetch(`./user-auth/api/login`, {
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
		console.info("Sign-In Response: ", res);
		if (res.status === 201) {
			document.cookie = `token=${res.data}; path=/`;
			router.push("/dashboard");
		} else {
		}
	};
	return (
		<main className="h-screen w-screen p-6 bg-blue-600 mobile:bg-transparent">
			<section className="h-full w-full rounded-lg shadow-lg flex flex-row justify-evenly bg-white">
				<section className="w-full h-full flex flex-col justify-between overflow-y-scroll overflow-x-hidden">
					<div className="w-full">
						<div className="p-4">
							<ULearnLogo />
						</div>
						<div className="w-full h-full p-8">
							<h1 className="font-bold text-[40px] my-4 text-black">Log In</h1>
							<form className="w-full" onSubmit={formik.handleSubmit}>
								<Input name="Username" htmlFor="username" handleOnBlur={formik.handleBlur} onChangeFunction={formik.handleChange} description="This username should have been pre-assigned to you by your instructor." />
								<Input name="Password" htmlFor="password" isPassword={true} handleOnBlur={formik.handleBlur} onChangeFunction={formik.handleChange} />
								<button className="w-full px-4 py-2 my-4 font-semibold text-xl text-white bg-blue-600 hover:bg-blue-700 rounded-lg" type="submit">Start Learning</button>
							</form>
							<div className="w-full">
								<p className="w-auto text-lg font-light py-2 text-black">
									Don't remember your password?
								</p>
								<a
									className="inline-block w-full px-4 py-2 font-semibold text-xl text-center text-white bg-pink-600 hover:bg-pink-700 rounded-lg"
									href="/forgotpassword"
								>
									Reset your Password
								</a>
							</div>
						</div>
					</div>
					<div className="w-full px-8 py-4">
						<p className="w-auto text-lg font-light py-2 text-black">
							First time? Create an account to get started!
						</p>
						<a
							className="inline-block w-full px-4 py-2 font-semibold text-xl text-center hover:cursor-pointer text-white bg-black hover:bg-gray-700 rounded-lg" onClick={() => setSignIn(!displaySignIn)}
						>
							Register	
						</a>
					</div>
				</section>
				<section className="hidden mobile:inline-block w-full h-full p-4">
					<div className="w-full h-full bg-blue-600 rounded-lg flex flex-col justify-center items-center">
						<Image src={LoginSVG} alt="LoginSVG" className="h-fit w-full p-8" priority={true} />
					</div>
				</section>
			</section>
		</main>
	);
}
