import { useAppSelector } from "@/StateManagement/store";
import { Command } from "@/model/Types/Types";
import React from "react";

interface TerminalProps {
	commands: Command[];
	messagesContainerRef: React.RefObject<HTMLDivElement>;
	userName: string;
}

const TerminalDisplay = ({
	commands,
	messagesContainerRef,
	userName,
}: TerminalProps) => {
	return (
		<div
			ref={messagesContainerRef}
			className="font-mono text-lg flex-grow rounded-t-xl w-full h-32 overflow-auto p-10
      bg-[#2a2c3c] neuro-shadow"
		>
			{commands.map((command, index) => {
				if (command.message === "") {
					return;
				}
				return (
					<div
						key={index}
						className={`w-full p-2 mb-2 rounded-xl ${
							command.type === "User"
								? "bg-black text-green-500"
								: " bg-slate-500 text-black"
						}`}
					>
						<p className="font-bold">
							{command.type !== "Computer" ? userName : ""}
						</p>
						<p
							className=""
							dangerouslySetInnerHTML={{
								__html: command.message,
							}}
						></p>
					</div>
				);
			})}
		</div>
	);
};

export default TerminalDisplay;
