"use client";

type Props = {
	name: string;
	htmlFor: string;
	placeholder?: string;
	onChangeFunction: any;
}

export default function Input({ name, htmlFor, placeholder = '', onChangeFunction }: Props) {
	return (
		<>
			<label className="font-bold my-2" htmlFor={htmlFor}>
				{name}
			</label>
			<input
				className="p-2 border-[2px] border-[#E1E1E1] rounded-md w-full"
				id={htmlFor}
				type="text"
				onChange={onChangeFunction}
				placeholder={placeholder}
			/>
		</>
	);
}
