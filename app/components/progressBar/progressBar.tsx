//  NOTE: THIS COMPONENT REPRESENTING THE PROGRESS BAR IN THE QUIZ UI

import React from "react";

interface Props {
	size: number;
	currentIdx: number;
}

export default function ProgressBar({ size = 20, currentIdx }: Props) {
	const progressItems = Array(size)
		.fill(null)
		.map((_, index) => {
			return index < currentIdx ? (
				<div
					key={index}
					className={`h-2 p-1.5 rounded bg-[#19AC9B] flex-1`}
				></div>
			) : index === currentIdx ? (
				<div
					key={index}
					className={`h-2 p-1.5 rounded bg-[#0185ff] flex-1`}
				></div>
			) : (
				<div
					key={index}
					className={`h-2 p-1.5 rounded flex-1 bg-gr`}
						style={{background: '#d9d9d9'}}
				></div>
			);
		});
	return (
		<div className="flex flex-row w-full items-center space-x-1 py-2">
			{progressItems}
		</div>
	);
}
