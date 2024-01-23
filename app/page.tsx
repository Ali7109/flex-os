"use client";
import { processInputToCommand } from "@/model/CommandProcess";
import { SetupCommandList } from "@/model/SetupCommandList";
import { Command } from "@/model/Types/Types";
import React, { useState, useRef, useEffect } from "react";

export default function Home() {
	// Accessibility synthesizer:
	const currentSpeechUtterance = useRef<SpeechSynthesisUtterance | null>(
		null
	);

	// Database initialization
	const Database = require("../model/Database");
	const myDb = new Database();

	// Command based data structure initialization
	const trie = SetupCommandList();
	const [commands, setCommands] = useState<Command[]>([]);

	// Component based state management
	const [userInput, setUserInput] = useState<string>("");
	const [blockInput, setBlockInput] = useState<boolean>(false);
	const [textToSpeechRequired, setTextToSpeechRequired] =
		useState<boolean>(false);
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	// Useeffects
	useEffect(() => {
		scrollToBottom();
	}, [commands]);

	useEffect(() => {
		var msg = new SpeechSynthesisUtterance();
		msg.text = "Do you want to enable text to speech?";
		window.speechSynthesis.speak(msg);
		confirm("Do you want to enable text to speech?")
			? setTextToSpeechRequired(true)
			: setTextToSpeechRequired(false);
	}, []);

	// Helper functions
	const processCommand = (command: string) => {
		setBlockInput(true);
		if (currentSpeechUtterance.current) {
			window.speechSynthesis.cancel();
		}
		if (command === "clear") {
			setCommands([]);
			setBlockInput(false);
			return;
		}

		let compResponse = processInputToCommand(command, myDb, trie);

		if (textToSpeechRequired) {
			var msg = new SpeechSynthesisUtterance();
			msg.text = compResponse.response;
			currentSpeechUtterance.current = msg;
			window.speechSynthesis.speak(msg);
		}

		setCommands((prevCommands) => [
			...prevCommands,
			{ type: "Computer", message: compResponse.response },
		]);

		if (compResponse.type === "wait") {
			setTimeout(() => {
				setBlockInput(false);
			}, compResponse.arg * 1000);
		} else {
			setBlockInput(false);
		}
	};

	const handleInputSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setCommands([...commands, { type: "User", message: userInput }]);
		processCommand(userInput);
		setUserInput("");
	};

	const scrollToBottom = () => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop =
				messagesContainerRef.current.scrollHeight;
		}
	};

	const [textAlter, setTextAlter] = useState<boolean>();

	return (
		<main className="flex min-h-screen flex-col items-center p-24 bg-[#2a2c3c]">
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
					className=" rounded-bl-xl bg-white w-4/5 text-black border-2 border-green-500 p-2 disabled:bg-gray-800"
					placeholder={
						blockInput ? "input blocked" : "terminal ready to use"
					}
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
				/>
				<button
					disabled={blockInput}
					className="rounded-br-xl bg-black w-1/5 text-green-500 border-2 border-green-500 p-2 hover:bg-gray-800 transition disabled:bg-green-500 disabled:text-black"
					type="submit"
					value="Submit"
				>
					{blockInput ? "running" : "Enter"}
				</button>
			</form>
		</main>
	);
}
