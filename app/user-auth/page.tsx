"use client";

import Image from "next/image";
import React, { useState } from "react";
import LoginSVG from "../../public/unDraw_Login.svg";
import RegisterSVG from "../../public/unDraw_Register.svg";
import LogIn from "./login";
import Register from "./register";

function UserAuth() {
  const [isSignIn, setIsSignIn] = useState(true);
  return <>{isSignIn ? <LogIn /> : <Register />}</>;
}

export default UserAuth;
