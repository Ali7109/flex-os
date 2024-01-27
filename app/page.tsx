"use client";
import { processInputToCommand } from "@/model/CommandProcess";
import Database from "@/model/CommandDataStructures/Database";
import { SetupCommandList } from "@/model/CommandDataStructures/SetupCommandList";
import { Command, User } from "@/model/Types/Types";
import React, { useState, useRef, useEffect } from "react";
import InputForm from "./InputForm/InputForm";
import TerminalDisplay from "./TerminalDisplay/TerminalDisplay";
import SignInModal from "./SignInModal/SignInModal";
import { useAppSelector } from "@/StateManagement/store";

export default function Home() {
	// Accessibility synthesizer:
	const currentSpeechUtterance = useRef<SpeechSynthesisUtterance | null>(
		null
	);

	// Database initialization
	const dbIntance = Database.getInstance();
	const user = useAppSelector((state) => state.userReducer.value);

	// const user = {
	// 	email: "test@.cop",
	// 	displayName: "Test User",
	// 	userId: "dasfaskjdfgbnslkjdfg",
	// };

	//Authentication state
	const [userName, setUserName] = useState<string>("Guest");

	// Command based data structure initialization
	const trie = SetupCommandList();
	const [commands, setCommands] = useState<Command[]>([]);

	// Component based state management
	const [blockInput, setBlockInput] = useState<boolean>(false);
	const [textToSpeechRequired, setTextToSpeechRequired] =
		useState<boolean>(false);
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	const [showModal, setShowModal] = useState<boolean>(true); // Initially set to true to trigger the modal

	// Useeffects
	useEffect(() => {
		scrollToBottom();
	}, [commands]);

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

		let compResponse = processInputToCommand(user, command, trie);

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
			{showModal && (
				<SignInModal
					setShowModal={setShowModal}
					setUserName={setUserName}
				/>
			)}
			<TerminalDisplay
				{...{ commands, messagesContainerRef, userName }}
			/>
			<InputForm
				{...{ commands, setCommands, processCommand, blockInput }}
			/>
		</main>
	);
}
