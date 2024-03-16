interface Props {
	currentIdx: number;
}

export default function ProgressBar({currentIdx}: Props) {
	const progressItems = Array(20)
		.fill(null)
		.map((_, index) => {
			return index < currentIdx ? (
				<div className={`h-2 p-1.5 rounded bg-[#19AC9B] flex-1`}></div>
			) : index === currentIdx ? (
				<div className={`h-2 p-1.5 rounded bg-[#0185ff] flex-1`}></div>
			) : (
				<div className={`h-2 p-1.5 rounded bg-white flex-1`}></div>
			);
		});
	return (
		<div className="flex flex-row w-full items-center space-x-1 py-2">
			{progressItems}
		</div>
	);
}
