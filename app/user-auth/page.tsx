"use client";

import React, { useState, useEffect } from "react";
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
		<main className="bg-[#f0f4f9]">
			{!isLoading &&
				(isSignIn ? (
					<LogIn setSignIn={setIsSignIn} displaySignIn={isSignIn} />
				) : (
					<Register setSignIn={setIsSignIn} displaySignIn={isSignIn} />
				))}
		</main>
	);
}

export default UserAuth;
