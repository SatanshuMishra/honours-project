"use client";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import fingerprint from "@/public/icons/wallet.svg";
import Image from "next/image";
import Input from "@/components/form/Input";

type Props = {
	password: string;
	confirmpassword: string;
};

export default function resetpassword() {
	const [token, setToken] = useState<String>();

	const searchParams = useSearchParams();

	useEffect(() => {	
		const token: String = searchParams.get(`token`) || ``;

		if(!token) {
			console.log(`Missing token. Redirecting...`);
		}

		setToken(token);
	}, []);

	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			password: "",
			confirmpassword: "",
		},
		onSubmit: (values) => {
			handleSubmitValues(values);
		},
	});

	const handleSubmitValues = async ({ password, confirmpassword }: Props) => {
		console.log(password, confirmpassword);
		if (password !== confirmpassword) {
			console.log("Passwords do not match!");
			return
		}

		const response = await fetch(`./resetpassword/api/changePassword`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				token,
				password
			}),
			cache: "no-cache",
		});

		let res: {
			status: number;
			data: null
			message: string;
		} = JSON.parse(await response.text());
		console.info("Reset Password Response: ", res);
	}
	return (
		<section className="w-screen h-screen max-w-screen max-h-screen flex flex-row justify-evenly items-between p-2 basis-full">
			<div className="h-full w-full overflow-y-scroll border-black border-2 p-4 flex flex-col justify-between items-center">
				<div className="h-full w-full">
					<div className="flex flex-col justify-center items-center">
						<div className="bg-white rounded-md w-fit h-fit p-2 border-[1px] border-gray-100">
							<Image width={30} height={30} src={fingerprint} alt="Fingerprint Icon" />
						</div>
						<h1 className="font-black text-2xl">Set New Password</h1>
						<p className="text-lg">The password must be at least 8 characters long.</p>
					</div>
					<form
						className="w-full flex flex-col justify-center items-start text-black text-xl mb-5"
						onSubmit={formik.handleSubmit}
					>
						<Input name="Password" htmlFor="password" onChangeFunction={formik.handleChange} />
						<Input name="Confirm Password" htmlFor="confirmpassword" onChangeFunction={formik.handleChange} />
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
