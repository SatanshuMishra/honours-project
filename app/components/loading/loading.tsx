import Image from "next/image";
import React from "react";
import PenguinGIF from "@/public/penguin.gif";

export default function Loading(){
	return(
		<section className="w-full h-full bg-blue-700 flex flex-col justify-center items-center">	
			<Image className="w-[20rem] h-auto" src={PenguinGIF} alt="Penguin GIF" />
			<h1 className="text-xl my-4 font-bold text-gray-100">LOADING...</h1>
			<p className="text-xl text-white">Sit tight while we get everything setup for you!</p>
		</section>
	);
}
