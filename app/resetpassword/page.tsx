"use client";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ResetPasswordSVG from "@/public/unDraw_ResetPassword.svg";
import ULearnLogo from "../components/uLearnLogo/ULearnLogo";
import Input from "../components/formElements/Input";
import "remixicon/fonts/remixicon.css";
import Image from "next/image";

type Props = {
  password: string;
  confirmpassword: string;
};

export default function resetpassword() {
  const [token, setToken] = useState<String>();

  const searchParams = useSearchParams();

  useEffect(() => {
    const token: String = searchParams.get(`token`) || ``;

    // if(!token) {
    // 	console.log(`Missing token. Redirecting...`);
    // }

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
      return;
    }

    const response = await fetch(`./resetpassword/api/changePassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password,
      }),
      cache: "no-cache",
    });

    let res: {
      status: number;
      data: null;
      message: string;
    } = JSON.parse(await response.text());
    console.info("Reset Password Response: ", res);
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
              <h1 className="font-bold text-[40px] my-4">Register</h1>
              <form className="w-full" onSubmit={formik.handleSubmit}>
                <Input
                  name="Password"
                  htmlFor="password"
                  onChangeFunction={formik.handleChange}
                />
                <Input
                  name="Confirm Password"
                  htmlFor="confirmpassword"
                  onChangeFunction={formik.handleChange}
                />
                <button
                  className="w-full px-4 py-2 my-4 font-semibold text-xl text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  type="submit"
                >
                  Reset Password
                </button>
              </form>
              <div className="w-full flex flex-row justify-center">
                <a
                  className="text-center text-lg font-light hover:cursor-pointer"
                  href="./user-auth"
                >
                  <i className="ri-arrow-left-line text-lg pr-2"></i>Back to Log
                  In
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-evenly py-8">
            <span className="h-4 w-[15rem] bg-[#cccccc] rounded-full"></span>
            <span className="h-4 w-[15rem] bg-blue-600 rounded-full"></span>
          </div>
        </section>
        <section className="hidden mobile:inline-block w-full h-full p-4">
          <div className="w-full h-full bg-[#6EDADA] rounded-lg flex flex-col justify-center items-center">
            <Image
              src={ResetPasswordSVG}
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
