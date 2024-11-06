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
  className?: string;
  error?: string;
}

export default function Input({ 
  name, 
  isPassword = false, 
  htmlFor, 
  placeholder = '', 
  onChangeFunction, 
  description, 
  additionalCSS = 'focus:border-black', 
  handleOnBlur,
  className = '',
  error
}: Props) {
  const inputClassName = twJoin(
    'p-2 border-[2px] border-[#E1E1E1] rounded-md w-full text-lg focus:outline-none text-black',
    additionalCSS,
    className,
    error && !additionalCSS.includes('border-teal-600') && !additionalCSS.includes('border-pink-600')
      ? 'border-red-500 focus:border-red-500' 
      : ''
  );

  return (
    <div className="py-2">
      <label className="font-bold text-lg my-2 text-black" htmlFor={htmlFor}>
        {name}
      </label>
      
      {description && (
        <p className={twJoin(
          "w-auto text-lg font-light",
          description.includes("match") 
            ? description.includes("Passwords match!") 
              ? "text-teal-600"
              : "text-pink-600"
            : "text-black"
        )}>
          {description}
        </p>
      )}
      
      <input
        className={inputClassName}
        id={htmlFor}
        type={isPassword ? `password` : `text`}
        onChange={onChangeFunction}
        onBlur={handleOnBlur}
        placeholder={placeholder}
      />
      
      {error && !description?.includes("match") && (
        <p className="text-red-500 text-sm mt-1" style={{color: "#ef4444", marginTop: "0.25rem"}}>{error}</p>
      )}
    </div>
  );
}
