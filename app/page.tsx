"use client";
import React, { useState, useRef, useEffect } from "react";

type Command = {
	type: string;
	message: string;
};

export default function Home() {
	const Database = require("../model/Database");

	const myDb = new Database();

	const [commands, setCommands] = useState<Command[]>([]);
	const processCommand = (command: string) => {
		setBlockInput(true);

		let cmdarr: string[] = command.split(" ");
		let compResponse: string = "";
		if (cmdarr.length === 0) {
			compResponse = "Invalid Command";
		} else {
			if (cmdarr.length === 1) {
				if (
					cmdarr[0].toLowerCase() === "what" ||
					cmdarr[0].toLowerCase() === "what?"
				) {
					compResponse =
						"Hi there, this is a terminal emulator. You can type in commands and see the response. Try typing in 'help' or 'h' to see a list of commands.";
				} else if (
					cmdarr[0].toLowerCase() === "help" ||
					cmdarr[0].toLowerCase() === "h"
				) {
					compResponse =
						"Here is a list of commands you can try: <br><br>" +
						"help - displays this list of commands <br>" +
						"what - displays a description of this terminal emulator <br>" +
						"clear - clears the terminal screen <br>" +
						"ls - lists all the files in the current directory <br>" +
						"cd - changes the current directory <br>" +
						"cat - displays the contents of a file <br>" +
						"mkdir - creates a new directory <br>" +
						"touch - creates a new file <br>" +
						"rm - deletes a file or directory <br>" +
						"mv - moves a file or directory <br>" +
						"cp - copies a file or directory <br>" +
						"pwd - displays the current directory <br>" +
						"history - displays the history of commands <br>" +
						"date - displays the current date and time <br>" +
						"exit - exits the terminal emulator";
				} else {
					compResponse = "Invalid Command";
				}
			} else {
				compResponse = "Invalid Command";
			}
		}
		setCommands((prevCommands) => [
			...prevCommands,
			{ type: "Computer", message: compResponse },
		]);
		setBlockInput(false);
	};

	const [userInput, setUserInput] = useState<string>("");
	const [blockInput, setBlockInput] = useState<boolean>(false);

	const messagesContainerRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop =
				messagesContainerRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [commands]);

	const handleInputSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setCommands([...commands, { type: "User", message: userInput }]);
		processCommand(userInput);
		setUserInput("");
	};

	return (
		<main className="flex min-h-screen flex-col items-center p-24 bg-[#2a2c3c]">
			<div
				ref={messagesContainerRef}
				className="font-mono text-lg flex-grow rounded-xl w-full h-32 overflow-auto p-10
      bg-[#2a2c3c] shadow-[20px_20px_60px_rgb(34,36,49),-20px_-20px_60px_rgb(50,52,71)]"
			>
				{commands.map((command, index) => {
					return (
						<div
							key={index}
							className={`w-full p-2 mb-2 rounded-xl  ${
								command.type === "User"
									? "bg-black text-green-500"
									: " bg-slate-500 text-black"
							}`}
						>
							<p className="font-bold">
								{command.type !== "Computer" ? "You: " : ""}
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
			<form onSubmit={handleInputSubmit} className="w-full">
				<input
					disabled={blockInput}
					className="rounded-l-xl bg-white w-4/5 text-black border-2 border-orange-500 p-2"
					placeholder={blockInput ? "input blocked" : "terminal"}
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
				/>
				<button
					disabled={blockInput}
					className="rounded-r-xl bg-black w-1/5 text-orange-200 border-2 border-orange-200 p-2 hover:bg-orange-200 hover:text-black transition"
					type="submit"
					value="Submit"
				>
					{blockInput ? "running" : "Enter"}
				</button>
			</form>
		</main>
	);
}
