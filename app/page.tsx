"use client";
import { processInputToCommand } from "@/model/CommandProcess";
import Database from "@/model/CommandDataStructures/Database";
import { SetupCommandList } from "@/model/CommandDataStructures/SetupCommandList";
import { Command } from "@/model/Types/Types";
import React, { useState, useRef, useEffect } from "react";
import InputForm from "./InputForm/InputForm";
import TerminalDisplay from "./TerminalDisplay/TerminalDisplay";

export default function Home() {
	// Accessibility synthesizer:
	const currentSpeechUtterance = useRef<SpeechSynthesisUtterance | null>(
		null
	);

	// Database initialization
	const dbIntance = Database.getInstance();

	// Command based data structure initialization
	const trie = SetupCommandList();
	const [commands, setCommands] = useState<Command[]>([]);

	// Component based state management
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
		if (command.trim().toLowerCase() === "clear") {
			setCommands([]);
			setBlockInput(false);
			return;
		}

		let compResponse = processInputToCommand(command, trie);

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
		} else if (compResponse.type === "exit") {
			setTimeout(() => {
				setBlockInput(false);
				if (confirm("Do you want to exit?")) {
					window.close();
					return;
				}
				setCommands((prevCommands) => [
					...prevCommands,
					{ type: "Computer", message: "Exit aborted." },
				]);
			}, compResponse.arg * 2000);
		} else {
			setBlockInput(false);
		}
	};

	const scrollToBottom = () => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop =
				messagesContainerRef.current.scrollHeight;
		}
	};

	return (
		<main className="flex min-h-screen flex-col items-center p-24 bg-black">
			<TerminalDisplay {...{ commands, messagesContainerRef }} />
			<InputForm
				{...{ commands, setCommands, processCommand, blockInput }}
			/>
		</main>
	);
}
