import Image from "next/image";
import uLogo from "@/public/icons/ulearn-logo.svg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AdminToolbar({toggleDrawer}: any) {
  return (
    <div className="rounded-full flex flex-row justify-between items-center absolute left-1/2 bottom-10 bg-white w-fit -translate-x-1/2 py-1 px-4 translate-y-0.5 hover:-translate-y-0.5 transition-all duration-300 ease-in-out shadow-lg">
      <Image src={uLogo} alt="uLearn Logo" width={25} height={25} />
      <div className="flex-1 flex flex-row justify-center mx-1">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="text-lg w-8 h-8 text-black rounded-full font-normal bg-white hover:bg-[#38bdf8] hover:text-white hover:cursor-pointer"
                onClick={toggleDrawer}
              >
                <i className="ri-apps-2-add-fill"></i>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Questions</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="text-lg w-8 h-8 text-black rounded-full font-normal bg-white hover:bg-[#38bdf8] hover:text-white hover:cursor-pointer"
              >
                <i className="ri-pie-chart-2-fill"></i>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Review Reports</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
