import Image from "next/image";
import React from "react";
import LoginSVG from "../../public/unDraw_Login.svg";
import ULearnLogo from "../components/uLearnLogo/ULearnLogo";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Input from "../components/formElements/Input";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ToastAction } from "@/components/ui/toast";

type AuthProps = {
	setSignIn: (arg0: boolean) => void;
	displaySignIn: boolean;
};

const loginSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LogIn({ setSignIn, displaySignIn }: AuthProps) {
	const { toast } = useToast();
	const router = useRouter();

	const formik = useFormik<LoginFormValues>({
		initialValues: {
			username: "",
			password: "",
		},
		validationSchema: toFormikValidationSchema(loginSchema),
		onSubmit: (values) => {
			handleSignIn(values);
		},
	});

	const handleSignIn = async (values: LoginFormValues) => {
		const response = await fetch(`./user-auth/api/login`, {
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
		console.info("Sign-In Response: ", res);
		if (res.status === 201) {
			document.cookie = `token=${res.data}; path=/`;
			router.push("/dashboard");
		} else {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: "There was a problem signing you in! Check your username or password.",
				action: <ToastAction altText="Try again">Try again</ToastAction>
			});
		}
	};

	const getInputErrorClass = (fieldName: keyof LoginFormValues) => {
		return formik.touched[fieldName] && formik.errors[fieldName]
			? "border-red-500 focus:border-red-500"
			: "";
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
								<Input
									name="Username"
									htmlFor="username"
									handleOnBlur={formik.handleBlur}
									onChangeFunction={formik.handleChange}
									description="This username should have been pre-assigned to you by your instructor."
									className={getInputErrorClass("username")}
								/>
								{formik.touched.username && formik.errors.username && (
									<div className="text-red-500 text-sm mt-1" style={{color: "#ef4444"}}>{formik.errors.username}: Please enter your username.</div>
								)}

								<Input
									name="Password"
									htmlFor="password"
									isPassword={true}
									handleOnBlur={formik.handleBlur}
									onChangeFunction={formik.handleChange}
									className={getInputErrorClass("password")}
								/>
								{formik.touched.password && formik.errors.password && (
									<div className="text-red-500 text-sm mt-1" style={{color: "#ef4444"}}>{formik.errors.password}: Please enter your password.</div>
								)}

								<button
									className="w-full px-4 py-2 my-4 font-semibold text-xl text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
									type="submit"
									style={{ background: "#0185FF" }}
								>
									Start Learning
								</button>
							</form>
							<div className="w-full">
								<p className="w-auto text-lg font-light py-2 text-black">
									Don&apos;t remember your password?
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
							className="inline-block w-full px-4 py-2 font-semibold text-xl text-center hover:cursor-pointer text-white bg-black hover:bg-gray-700 rounded-lg"
							onClick={() => setSignIn(!displaySignIn)}
						>
							Register
						</a>
					</div>
				</section>
				<section className="hidden mobile:inline-block w-full h-full p-4">
					<div
						className="w-full h-full bg-[#3182ce] rounded-lg flex flex-col justify-center items-center"
						style={{ background: "#0185FF" }}
					>
						<Image
							src={LoginSVG}
							alt="LoginSVG"
							className="h-fit w-full p-8"
							priority={true}
						/>
					</div>
				</section>
			</section>
		</main>
	);
}
