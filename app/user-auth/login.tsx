import Image from "next/image";
import React from "react";
import LoginSVG from "../../public/icons/login.svg";
import uLearnLogo from "@/public/icons/ulearn-logo.svg";
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
      if (res.status === 400) {
        toast({
          title: "Missing Fields",
          description:
            "Please provide both your username and password and try again!",
          variant: "destructive",
        });
      }
      if (res.status === 422) {
        toast({
          title: "Security Risks Detected",
          description:
            "Possible security risks detected in your inputs for username or password. Please review your inputs and try again!",
          variant: "destructive",
        });
      }
      if (res.status === 401) {
        toast({
          title: "Invalid Username or Password",
          description:
            "You entered an invalid username or password. Please review your inputs and try again!",
          variant: "destructive",
        });
      }
      if (res.status === 500) {
        toast({
          title: "Something Unexpected Happend",
          description:
            "We aren't quite sure what happend! Please report this behavior to satanshu@student.ubc.ca.",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <section className="h-screen w-screen overflow-x-hidden overflow-y-scroll flex flex-row justify-center items-center">
      <div className="h-full flex flex-col justify-start items-center w-3/4 p-4">
        <div className="flex flex-row justify-start items-center w-full h-fit">
          <Image src={uLearnLogo} alt="uLearn Logo" width={45} height={45} />
          <p className="font-bold text-4xl">uLearn</p>
        </div>
        <form
          className="h-full flex flex-col justify-center items-start p-2"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="font-bold text-5xl my-4">LOG IN</h1>
          <label className="font-bold text-xl" htmlFor="username">
            USERNAME
          </label>
          <p className="w-auto text-lg">
            This username should have been pre-assigned to you by your
            instructor.
          </p>
          <input
            className="w-full p-2 border-2 border-black my-4 rounded-lg"
            id="username"
            type="username"
            onChange={formik.handleChange}
          />
          <label className="font-bold text-xl" htmlFor="password">
            PASSWORD
          </label>
          <input
            className="w-full p-2 border-2 border-black my-4 rounded-lg"
            id="password"
            type="password"
            onChange={formik.handleChange}
          />
          <button
            className="w-full p-4 font-bold text-xl text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            type="submit"
          >
            LOG IN
          </button>

          <p className="w-auto text-lg" style={{marginTop: "1rem", marginBottom: "1rem"}}>
            Don't remember your password? Reset your password.
          </p>

          <a
            className="w-full p-4 font-bold text-xl text-center text-white bg-pink-600 hover:bg-pink-700 rounded-lg"
            href="/forgotpassword"
          >
            FORGOT PASSWORD
          </a>
          <p className="w-auto text-lg my-4">
            First time logging in? Create an account to get started!
          </p>
          <button
            className="w-full p-4 font-bold text-xl text-white bg-green-600 hover:bg-green-700 rounded-lg"
            type="button"
            onClick={() => {
              setSignIn(!displaySignIn);
            }}
          >
            REGISTER
          </button>
        </form>
      </div>
      <div className="h-screen w-full rounded-md p-4">
        <div className="h-full w-full bg-blue-600 rounded-lg flex flex-col justify-center items-center">
          <Image
            src={LoginSVG}
            alt="LoginSVG"
            className="h-fit w-auto"
            priority={true}
          />
        </div>
      </div>
    </section>
  );
}
