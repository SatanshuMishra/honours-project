"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ForgotPasswordSVG from "@/public/unDraw_ForgotPassword.svg";
import ULearnLogo from "../components/uLearnLogo/ULearnLogo";
import Input from "../components/formElements/Input";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";
import 'remixicon/fonts/remixicon.css';
import HttpStatusCode from "../types/HttpStatusCode";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const forgotPasswordSchema = z.object({
	fullname: z.string()
		.min(1, "Full name is required")
		.max(100, "Full name is too long"),
	username: z.string()
		.min(1, "Username is required")
		.max(50, "Username is too long"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
	const router = useRouter();
	const { toast } = useToast();

	const formik = useFormik<ForgotPasswordValues>({
		initialValues: {
			fullname: "",
			username: "",
		},
		validationSchema: toFormikValidationSchema(forgotPasswordSchema),
		onSubmit: async (values) => {
			await handleSubmitValues(values);
		},
	});

	const handleSubmitValues = async ({ fullname, username }: ForgotPasswordValues) => {
		try {
			const validateUserRequest = await fetch(`./forgotpassword/api/validateCredentials`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fullname,
					username
				}),
				cache: "no-cache",
			});

			const validateUserResponse: {
				status: HttpStatusCode;
				data: {
					validated: boolean,
					token: string | null
				};
				message: string;
			} = JSON.parse(await validateUserRequest.text());

			console.info("Forgot Password Response: ", validateUserResponse);

			switch (validateUserResponse.status) {
				case 202:
					if (validateUserResponse.data.validated && validateUserResponse.data.token) {
						toast({
							title: "Verification Successful",
							description: "You will be redirected to reset your password.",
							action: <ToastAction altText="Try again">Try again</ToastAction>
						});
						router.push(`/resetpassword?token=${validateUserResponse.data.token}`);
						return true;
					}
					break;

				case 422:
					toast({
						title: "Invalid Input",
						description: validateUserResponse.message,
						variant: "destructive",
						action: <ToastAction altText="Try again">Try again</ToastAction>
					});
					break;

				case 403:
					toast({
						title: "Security Alert",
						description: validateUserResponse.message,
						variant: "destructive",
						action: <ToastAction altText="Try again">Try again</ToastAction>
					});
					break;

				case 400:
					toast({
						title: "Verification Failed",
						description: validateUserResponse.message,
						variant: "destructive",
						action: <ToastAction altText="Try again">Try again</ToastAction>
					});
					break;

				default:
					toast({
						title: "Error",
						description: "An unexpected error occurred. Please try again.",
						variant: "destructive",
						action: <ToastAction altText="Try again">Try again</ToastAction>
					});
			}

			return false;

		} catch (error) {
			console.log("Forgot Password Error: ", error);
			toast({
				title: "Connection Error",
				description: "Failed to connect to the server. Please try again.",
				variant: "destructive",
				action: <ToastAction altText="Try again">Try again</ToastAction>
			});
			return false;
		}

		finally {
			formik.setSubmitting(false);
		}
	};

	return (
		<main className="h-screen w-screen p-6 bg-[#F36262] mobile:bg-transparent">
			<section className="h-full w-full rounded-lg shadow-lg flex flex-row justify-evenly bg-white">
				<section className="w-full h-full flex flex-col justify-between overflow-y-scroll overflow-x-hidden">
					<div className="w-full">
						<div className="p-4">
							<ULearnLogo />
						</div>
						<div className="w-full h-full p-8">
							<h1 className="font-bold text-[40px] my-4 text-black">Forgot Password</h1>
							<p className="text-lg text-gray-600 mb-6">
								Enter your full name and username to reset your password.
							</p>
							<form className="w-full" onSubmit={formik.handleSubmit}>
								<Input
									name="Full Name"
									htmlFor="fullname"
									onChangeFunction={formik.handleChange}
									handleOnBlur={formik.handleBlur}
									error={formik.touched.fullname && formik.errors.fullname}
									description="Enter your full name exactly as provided to your instructor"
								/>
								<Input
									name="Username"
									htmlFor="username"
									onChangeFunction={formik.handleChange}
									handleOnBlur={formik.handleBlur}
									error={formik.touched.username && formik.errors.username}
									description="Enter your assigned username"
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
										<span className="text-blue-600">Verifying your Identity</span>
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
						<span className="h-4 w-[15rem] rounded-full" style={{ background: "#0083ff" }}></span>
						<span className="h-4 w-[15rem] bg-[#cccccc] rounded-full"></span>
					</div>
				</section>
				<section className="hidden mobile:inline-block w-full h-full p-4">
					<div className="w-full h-full bg-[#F36262] rounded-lg flex flex-col justify-center items-center">
						<Image
							src={ForgotPasswordSVG}
							alt="Forgot Password Illustration"
							className="h-fit w-full mobile:w-fit p-8"
							priority={true}
						/>
					</div>
				</section>
			</section>
		</main>
	);
}
