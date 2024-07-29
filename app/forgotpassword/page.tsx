"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

import fingerprint from "@/public/icons/fingerprint.svg";
import Image from "next/image";
import Input from "@/components/form/Input";
import HttpStatusCode from "../types/HttpStatusCode";
import { use } from "react";

type SubmitProps = {
	fullname: string;
	username: string;
};

export default function forgotpassword() {
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

	const handleSubmitValues = async ({fullname, username}: SubmitProps) => {
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
		<section className="w-screen h-screen max-w-screen max-h-screen flex flex-row justify-evenly items-between p-2 basis-full">
			<div className="h-full w-full overflow-y-scroll border-black border-2 p-4 flex flex-col justify-between items-center">
				<div className="h-full w-full">
					<div className="flex flex-col justify-center items-center">
						<div className="bg-white rounded-md w-fit h-fit p-2 border-[1px] border-gray-100">
							<Image width={30} height={30} src={fingerprint} alt="Fingerprint Icon" />
						</div>
						<h1 className="font-black text-2xl">Forgot Password</h1>
						<p className="text-lg">Don't worry, we can reset your password.</p>
					</div>
					<form
						className="w-full flex flex-col justify-center items-start text-black text-xl mb-5"
						onSubmit={formik.handleSubmit}
					>
						<Input name="Full Name" htmlFor="fullname" onChangeFunction={formik.handleChange} />
						<Input name="Username" htmlFor="username" onChangeFunction={formik.handleChange} />
						<button
							className="p-2 text-white text-lg rounded-md w-full font-normal my-5 bg-red-500"
							type="submit"
						>
							Reset Password
						</button>
					</form>
				</div>
			</div>
		</section>
	);
}
