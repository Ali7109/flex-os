"use client";
import { processInputToCommand } from "@/model/CommandProcess";
import Database from "@/model/CommandDataStructures/Database";
import { SetupCommandList } from "@/model/CommandDataStructures/SetupCommandList";
import { Command } from "@/model/Types/Types";
import React, { useState, useRef, useEffect } from "react";
import InputForm from "./InputForm/InputForm";
import TerminalDisplay from "./TerminalDisplay/TerminalDisplay";
import SignInModal from "./SignInModal/SignInModal";
import { useAppSelector } from "@/StateManagement/store";
import SignOut from "./SignInOutButtons/SignOut";
import SignIn from "./SignInOutButtons/SignIn";
import TextToSpeechModal from "./TextToSpeechModal/TextToSpeechModal";

export default function Home() {
	// Accessibility synthesizer:
	const currentSpeechUtterance = useRef<SpeechSynthesisUtterance | null>(
		null
	);

	// Database initialization
	const dbIntance = Database.getInstance();
	const user = useAppSelector((state) => state.userReducer.value);

	//Authentication state
	const [userName, setUserName] = useState<string>("Guest");

	// Command based data structure initialization
	const trie = SetupCommandList(); //Constructor to initialize the trie
	const [commands, setCommands] = useState<Command[]>([]);

	// Component based state management
	const [blockInput, setBlockInput] = useState<boolean>(false);
	const [textToSpeechRequired, setTextToSpeechRequired] =
		useState<boolean>(false);
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	const [showModal, setShowModal] = useState<boolean>(true); // Initially set to true to trigger the modal
	const [showTextToSpeechModal, setShowTextToSpeechModal] =
		useState<boolean>(true);

	const [containerHeight, setContainerHeight] = useState(0);

	useEffect(() => {
		let speechInstance = new SpeechSynthesisUtterance();
		speechInstance.rate = 1.5;
		speechInstance.text =
			"Do you want to enable text to speech? If so, press the Spacebar or Space key. If not, then press Escape key.";
		window.speechSynthesis.speak(speechInstance);

		// Function to handle key press events
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key === "Spacebar" || event.key === " ") {
				window.speechSynthesis.cancel();
				setShowTextToSpeechModal(false);
				setTextToSpeechRequired(true);
				window.removeEventListener("keydown", handleKeyPress); // Remove the event listener after confirmation
			} else if (event.key === "Escape") {
				window.speechSynthesis.cancel();
				setShowTextToSpeechModal(false);
				setTextToSpeechRequired(false);
				window.removeEventListener("keydown", handleKeyPress); // Remove the event listener after cancellation
			}
		};
		const updateContainerHeight = () => {
			setContainerHeight(window.innerHeight);
		};

		// Initial height setup
		updateContainerHeight();

		// Update height on window resize
		window.addEventListener("resize", updateContainerHeight);

		// Add event listener for key presses
		window.addEventListener("keydown", handleKeyPress);

		// Clean up function to remove event listener on component unmount
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
			window.removeEventListener("resize", updateContainerHeight);
		};
	}, []);

	// Useeffects
	useEffect(() => {
		scrollToBottom();
	}, [commands]);

	useEffect(() => {
		setCommands([]);
	}, [user]);

	// Helper functions
	const processCommand = async (command: string) => {
		setBlockInput(true);
		if (currentSpeechUtterance.current) {
			window.speechSynthesis.cancel();
		}
		if (command.trim().toLowerCase() === "clear") {
			setCommands([]);
			setBlockInput(false);
			return;
		}

		let compResponse = await processInputToCommand(user, command, trie);

		if (textToSpeechRequired) {
			var msg = new SpeechSynthesisUtterance();

			console.log(command);
			msg.rate = 1.5;
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
		<main
			className="relative flex flex-col items-center md:p-10 md:pt-20 bg-black "
			style={{ height: containerHeight }}
		>
			{showTextToSpeechModal ? (
				<TextToSpeechModal
					setTextToSpeechRequired={setTextToSpeechRequired}
					setShowTextToSpeechModal={setShowTextToSpeechModal}
				/>
			) : showModal ? (
				<SignInModal
					setShowModal={setShowModal}
					setUserName={setUserName}
					textToSpeechRequired={textToSpeechRequired}
				/>
			) : user.displayName === "Guest" && user.email === "" ? (
				<SignIn setUserName={setUserName} />
			) : (
				<SignOut setUserName={setUserName} />
			)}
			<TerminalDisplay
				{...{ commands, messagesContainerRef, userName }}
			/>
			<InputForm
				{...{
					commands,
					setCommands,
					processCommand,
					blockInput,
					showModal,
				}}
			/>
		</main>
	);
}
