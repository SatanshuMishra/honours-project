"use client";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ResetPasswordSVG from "@/public/unDraw_ResetPassword.svg";
import ULearnLogo from "../components/uLearnLogo/ULearnLogo";
import Input from "../components/formElements/Input";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import "remixicon/fonts/remixicon.css";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const resetPasswordSchema = z.object({
	password: z.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[0-9]/, "Password must contain at least one number"),
	confirmpassword: z.string()
		.min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmpassword, {
	message: "Passwords must match",
	path: ["confirmpassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordComponent() {
	const [token, setToken] = useState<string>("");
	const [isMatching, setIsMatching] = useState(false);
	const searchParams = useSearchParams();
	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		const urlToken = searchParams.get("token");
		if (!urlToken) {
			toast({
				title: "Invalid Request",
				description: "Missing reset token. Redirecting to login...",
				variant: "destructive",
				action: <ToastAction altText="Try again">Try again</ToastAction>
			});
			setTimeout(() => router.push("./user-auth"), 2000);
			return;
		}
		setToken(urlToken);
	}, [searchParams, router, toast]);

	const formik = useFormik<ResetPasswordValues>({
		initialValues: {
			password: "",
			confirmpassword: "",
		},
		validationSchema: toFormikValidationSchema(resetPasswordSchema),
		onSubmit: async (values) => {
			await handleSubmitValues(values);
		},
	});

	useEffect(() => {
		if (formik.values.password && formik.values.confirmpassword) {
			setIsMatching(formik.values.password === formik.values.confirmpassword);
		}
	}, [formik.values.password, formik.values.confirmpassword]);

	const handleSubmitValues = async ({ password }: ResetPasswordValues) => {
		try {
			const response = await fetch(`./resetpassword/api/changePassword`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token,
					password,
				}),
				cache: "no-cache",
			});

			const res: {
				status: number;
				data: null;
				message: string;
			} = JSON.parse(await response.text());

			console.info("Reset Password Response: ", res);

			switch (res.status) {
				case 200:
					toast({
						title: "Success",
						description: "Your password has been reset successfully.",
						action: <ToastAction altText="Go to login">Go to login</ToastAction>
					});
					setTimeout(() => router.push("./user-auth"), 2000);
					break;

				case 401:
					toast({
						title: "Token Expired",
						description: "Your reset link has expired. Please request a new one.",
						variant: "destructive",
						action: <ToastAction altText="Try again">Try again</ToastAction>
					});
					setTimeout(() => router.push("./forgotpassword"), 2000);
					break;

				default:
					toast({
						title: "Error",
						description: res.message || "Failed to reset password. Please try again.",
						variant: "destructive",
						action: <ToastAction altText="Try again">Try again</ToastAction>
					});
			}

			return res.status === 200;

		} catch (error) {
			console.log("Reset Password Error: ", error);
			toast({
				title: "Connection Error",
				description: "Failed to connect to the server. Please try again.",
				variant: "destructive",
				action: <ToastAction altText="Try again">Try again</ToastAction>
			});
			return false;
		} finally {
			formik.setSubmitting(false);
		}
	};

	const getPasswordFieldStyle = (fieldName: "password" | "confirmpassword") => {
		if (formik.touched[fieldName] && formik.touched.confirmpassword) {
			return isMatching
				? "border-teal-600 focus:!border-teal-600"
				: "border-pink-600 focus:!border-pink-600";
		}
		return "focus:border-black";
	};

	return (
		<main className="h-screen w-screen p-6 bg-[#6EDADA] mobile:bg-transparent">
			<section className="h-full w-full rounded-lg shadow-lg flex flex-row justify-evenly bg-white">
				<section className="w-full h-full flex flex-col justify-between overflow-y-scroll overflow-x-hidden">
					<div className="w-full">
						<div className="p-4">
							<ULearnLogo />
						</div>
						<div className="w-full h-full p-8">
							<h1 className="font-bold text-[40px] my-4 text-black">Reset Password</h1>
							<p className="text-lg text-gray-600 mb-6">
								Please enter your new password below.
							</p>
							<form className="w-full" onSubmit={formik.handleSubmit}>
								<Input
									name="Password"
									isPassword={true}
									htmlFor="password"
									onChangeFunction={formik.handleChange}
									handleOnBlur={formik.handleBlur}
									error={formik.touched.password && formik.errors.password}
									additionalCSS={getPasswordFieldStyle("password")}
									description="Password must be at least 8 characters and contain uppercase, lowercase, and numbers"
								/>
								<Input
									name="Confirm Password"
									isPassword={true}
									htmlFor="confirmpassword"
									onChangeFunction={formik.handleChange}
									handleOnBlur={formik.handleBlur}
									error={formik.touched.confirmpassword && formik.errors.confirmpassword}
									additionalCSS={getPasswordFieldStyle("confirmpassword")}
									description={
										formik.touched.password && formik.touched.confirmpassword
											? isMatching
												? "Passwords match!"
												: "Passwords do not match."
											: ""
									}
								/>

								{!formik.isSubmitting && (
									<button
										className="w-full px-4 py-2 my-4 font-semibold text-xl text-white bg-blue hover:bg-blue-700 rounded-lg"
										style={{ background: "#0083ff" }}
										type="submit"
										disabled={formik.isSubmitting}
									>
										Reset Password
									</button>
								)}
								{formik.isSubmitting && (
									<div
										className="w-full px-4 py-2 my-4 font-semibold text-xl rounded-lg bg-blue-50 flex items-center justify-center"
										style={{ minHeight: "2.75rem" }}
									>
										<Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
										<span className="text-blue-600">Resetting Password</span>
									</div>
								)}
							</form>
							<div className="w-full flex flex-row justify-center">
								<a
									className="text-center text-lg font-light hover:cursor-pointer hover:text-blue-600 transition-colors"
									href="./user-auth"
								>
									<i className="ri-arrow-left-line text-lg pr-2"></i>
									Back to Log In
								</a>
							</div>
						</div>
					</div>
					<div className="flex flex-row justify-evenly py-8">
						<span className="h-4 w-[15rem] bg-[#cccccc] rounded-full"></span>
						<span className="h-4 w-[15rem] rounded-full" style={{ background: "#0083ff" }}></span>
					</div>
				</section>
				<section className="hidden mobile:inline-block w-full h-full p-4">
					<div className="w-full h-full bg-[#6EDADA] rounded-lg flex flex-col justify-center items-center">
						<Image
							src={ResetPasswordSVG}
							alt="Reset Password Illustration"
							className="h-fit w-full mobile:w-fit p-8"
							priority={true}
						/>
					</div>
				</section>
			</section>
		</main>
	);
}

export function LoadingComponent() {
	return (
		<div
			className="w-full px-4 py-2 my-4 font-semibold text-xl rounded-lg bg-blue-50 flex items-center justify-center"
			style={{ minHeight: "2.75rem" }}
		>
			<Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
			<span className="text-blue-600">Loading Reset Password Page</span>
		</div>
	);
}

export default function ResetPassword() {
	return (
		<Suspense fallback={<LoadingComponent />}>
			<ResetPasswordComponent />
		</Suspense>
	);
}
