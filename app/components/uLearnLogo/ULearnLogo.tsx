import Image from "next/image";
import uLogo from "@/public/icons/ulearn-logo.svg";

export default function ULearnLogo() {
	return (
		<div className="flex flex-row justify-start items-center w-full h-fit z-50">
			<Image src={uLogo} alt="uLearn Logo" width={45} height={45} />
			<p className="font-bold text-3xl">uLearn</p>
		</div>
	);
}
