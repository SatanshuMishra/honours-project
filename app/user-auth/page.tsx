"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import LoginSVG from "../../public/unDraw_Login.svg";
import RegisterSVG from "../../public/unDraw_Register.svg";
import LogIn from "./login";
import Register from "./register";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

function UserAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const token = Cookies.get("token");
    if (token) {
      router.replace("/dashboard");
      return;
    }
    setIsLoading(false);
  }, [router]);
  const [isSignIn, setIsSignIn] = useState(true);
  return (
    <>
      {!isLoading &&
        (isSignIn ? (
          <LogIn setSignIn={setIsSignIn} displaySignIn={isSignIn} />
        ) : (
          <Register setSignIn={setIsSignIn} displaySignIn={isSignIn} />
        ))}
    </>
  );
}

export default UserAuth;
