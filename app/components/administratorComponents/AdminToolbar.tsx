import Image from "next/image";
import uLogo from "@/public/icons/ulearn-logo.svg";

export default function AdminToolbar({toggleDrawer}: any) {
	return (
		<div className="rounded-full flex flex-row justify-between items-center absolute left-1/2 bottom-10 bg-white w-fit -translate-x-1/2 py-1 px-4 translate-y-0.5 hover:-translate-y-0.5 transition-all duration-300 ease-in-out shadow-lg">
			<Image src={uLogo} alt="uLearn Logo" width={25} height={25} />
			<p className="bg-gradient-to-r from-[#3267e3] to-[#000000] text-transparent bg-clip-text text-lg font-medium mx-2 select-none font-jetbrains-mono">
				Developer Tools
			</p>
			<div className="flex-1 flex flex-row justify-center mx-1">
				<button
					className="text-lg w-10 h-10 text-black rounded-full font-normal bg-white hover:bg-gray-300 hover:cursor-pointer"
					onClick={toggleDrawer}
				>
					<i className="ri-apps-2-add-fill"></i>
				</button>
				<button
					className="text-lg w-10 h-10 text-black rounded-full font-normal bg-white hover:bg-gray-300 hover:cursor-pointer"
				>
					<i className="ri-pie-chart-2-fill"></i>
				</button>
			</div>
		</div>
	);
}
