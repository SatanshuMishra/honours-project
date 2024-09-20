"use client";

type Props = {
	name: string;
	htmlFor: string;
	placeholder?: string;
	onChangeFunction: any;
	description?:string;
}

export default function Input({ name, htmlFor, placeholder = '', onChangeFunction, description }: Props) {
	return (
		<div className="py-2">
			<label className="font-bold text-lg my-2" htmlFor={htmlFor}>
				{name}
			</label>
			{description && <p className="w-auto text-lg font-light">{description}</p>}
			<input
				className="p-2 border-[2px] border-[#E1E1E1] rounded-md w-full text-lg"
				id={htmlFor}
				type="text"
				onChange={onChangeFunction}
				placeholder={placeholder}
			/>
		</div>
	);
}
