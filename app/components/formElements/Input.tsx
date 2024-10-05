"use client";

import { twJoin } from 'tailwind-merge';

type Props = {
	name: string;
	isPassword?: boolean;
	htmlFor: string;
	handleOnBlur: any;
	placeholder?: string;
	onChangeFunction: any;
	description?: string;
	additionalCSS?: string;
}

export default function Input({ name, isPassword = false, htmlFor, placeholder = '', onChangeFunction, description, additionalCSS = 'focus:border-black', handleOnBlur }: Props) {
	return (
		<div className="py-2">
			<label className="font-bold text-lg my-2 text-black" htmlFor={htmlFor}>
				{name}
			</label>
			{description && <p className="w-auto text-lg font-light text-black">{description}</p>}
			<input
				className={twJoin(`p-2 border-[2px] border-[#E1E1E1] rounded-md w-full text-lg focus:outline-none text-black`, additionalCSS)}
				id={htmlFor}
				type={isPassword ? `password` : `text`}
				onChange={onChangeFunction}
				onBlur={handleOnBlur}
				placeholder={placeholder}
			/>
		</div>
	);
}
