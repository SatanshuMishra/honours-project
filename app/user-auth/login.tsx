import Image from "next/image";
import React from "react";
import LoginSVG from "../../public/unDraw_Login.svg";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";


type AuthProps = {
	setSignIn: (arg0: boolean) => void;
	displaySignIn: boolean;
};

export default function LogIn({ setSignIn, displaySignIn }: AuthProps) {
	const router = useRouter();
	const { toast } = useToast();

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
			if (res.status === 400){
				toast({
					title: "Missing Fields",
					description: "Please provide both your username and password and try again!",
					variant: "destructive",
				})
			}
			if (res.status === 422) {
				toast({
					title: "Security Risks Detected",
					description: "Possible security risks detected in your inputs for username or password. Please review your inputs and try again!",
					variant: "destructive",
				})
			}
			if (res.status === 401){
				toast({
					title: "Invalid Username or Password",
					description: "You entered an invalid username or password. Please review your inputs and try again!",
					variant: "destructive",
				})
			}
			if (res.status === 500){
				toast({
					title: "Something Unexpected Happend",
					description: "We aren't quite sure what happend! Please report this behavior to satanshu@student.ubc.ca.",
					variant: "destructive",
				})
			}
		}
	};
	return (
		<section className="flex flex-row justify-evenly items-center w-screen h-screen">
			<div className="w-full max-w-3xl flex flex-col justify-center items-center bg-white shadow-xl rounded-lg p-10 min-w-[20rem] mx-10">
				<div className="w-full flex flex-col justify-center items-start">
					<h1 className="text-5xl font-bold my-10">LOG IN</h1>
					<form
						className="w-full flex flex-col justify-center items-start text-black text-xl mb-5"
						onSubmit={formik.handleSubmit}
					>
						<label className="font-bold my-2" htmlFor="username">
							USERNAME
						</label>
						<input
							className="p-2 border-2 border-black rounded-lg w-full"
							id="username"
							type="username"
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
							LOG IN
						</button>
						<a className="p-2 text-black text-center w-full" href="/forgotpassword">Forgot Password</a>
					</form>
				</div>
				<p className="text-xl my-5 w-full text-center"> - OR - </p>
				<p className="text-xl w-full text-left">
					If you do not have an account, you can access registration
					below:
				</p>
				<button
					className="text-xl p-2 text-white rounded-lg w-full font-bold my-5 bg-[#82D400] hover:bg-[#78c200]"
					onClick={() => {
						setSignIn(!displaySignIn);
					}}
				>
					REGISTER
				</button>
			</div>
			<div className="hidden w-full xl:flex flex-col justify-center items-center mx-10">
				<Image
					src={LoginSVG}
					alt="LoginSVG"
					className="h-fit w-auto"
					priority={true}
				/>
			</div>
		</section>
	);
}
