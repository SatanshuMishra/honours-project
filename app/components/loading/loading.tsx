import Image from "next/image";
import React from "react";
import PenguinGIF from "@/public/penguin.gif";
import { useState, useEffect } from "react";

export default function Loading() {
	const [loadingPhrase, setLoadingPhrase] = useState(
		"Sit tight while we get everything set up for you!"
	);

	useEffect(() => {
		//  INFO: THIS ARRAY CONTROLS THE LOADING SCREEN MESSAGES SHOWN TO THE USER
		const loadingPhrases: string[] = [
			"Sit tight while we get everything set up for you!",
			"Compiling your personalized learning path...",
			"Debugging your knowledge gaps...",
			"Syntax check in progress...",
			"Optimizing your learning experience...",
			"Booting up your coding potential...",
			"Downloading essential algorithms...",
			"Fetching fascinating coding facts...",
			"Building your computational toolkit...",
			"Accessing the world of computer science...",
			"Preparing for your coding journey...",
		];
		const randomIndex = Math.floor(Math.random() * loadingPhrases.length);
		setLoadingPhrase(loadingPhrases[randomIndex]);
	}, []);

	return (
		<section className="w-full h-full bg-[#00aaff] flex flex-col justify-center items-center">
			<Image
				className="w-[20rem] h-auto"
				src={PenguinGIF}
				alt="Penguin GIF"
				priority
			/>
			<h1 className="text-2xl my-4 font-black text-gray-100">LOADING</h1>
			<p className="text-xl text-white">{loadingPhrase}</p>
		</section>
	);
}
