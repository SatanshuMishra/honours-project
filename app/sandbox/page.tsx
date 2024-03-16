"use client";
import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import Results from "../components/results/results";

function Sandbox() {
	return (
		<Results
			score={`15`}
			duration={`30000`}
		/>
	);
}

export default Sandbox;
