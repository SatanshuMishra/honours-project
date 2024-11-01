"use client";
import "remixicon/fonts/remixicon.css";
import { useState } from "react";
import React from "react";

export default function TipAccordion() {
	const [openAccordion, setOpenAccordion] = useState<boolean>(false);
	return (
		<div
			className="p-4 flex flex-col justify-center items-start w-full rounded-lg hover:cursor-pointer transition-all duration-300 ease-in-out"
			style={{ background: "#00AEFF" }}
			onClick={() => setOpenAccordion(!openAccordion)}
		>
			<p className="text-white text-lg font-bold p-0.5 transition-all duration-300 ease-in-out">
				<i
					className="ri-lightbulb-flash-fill"
					style={{ paddingRight: "0.5rem" }}
				>
				</i>Tip
			</p>
			{openAccordion && (
				<p className="text-white text-lg font-normal p-0.5 transition-all duration-300 ease-in-out">
					Evaluate the code line by line. If you cannot answer the
					question, then re-create the code in your IDE of choice.
				</p>
			)}
		</div>
	);
}
