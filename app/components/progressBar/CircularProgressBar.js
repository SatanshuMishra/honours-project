import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";

const CircularProgressBar = ({ percentage, image }) => {
	return (
		<div style={{ position: "relative", width: "120px", height: "120px" }}>
			<CircularProgressbar
				value={percentage}
				styles={buildStyles({
					pathColor: `#16db89`,
					trailColor: "#eee",
				})}
			/>
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
				}}
			>
				<Image
					src={image}
					alt="Recursion Icon"
					priority
				/>
			</div>
		</div>
	);
};

export default CircularProgressBar;
