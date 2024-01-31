import { Command } from "@/model/Types/Types";
import React, { useRef, useState } from "react";

interface InputFormProps {
	commands: Command[];
	setCommands: React.Dispatch<React.SetStateAction<Command[]>>;
	processCommand: (command: string) => void;
	blockInput: boolean;
	showModal: boolean;
}

const InputForm = ({
	commands,
	setCommands,
	processCommand,
	blockInput,
	showModal,
}: InputFormProps) => {
	const [mouseIn, setMouseIn] = useState<boolean>(false);
	const [userInput, setUserInput] = useState<string>("");
	const inputRef = useRef<HTMLInputElement>(null);

	const handleInputSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setCommands([...commands, { type: "User", message: userInput }]);
		processCommand(userInput);
		setUserInput("");
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	return (
		<form onSubmit={handleInputSubmit} className="w-full">
			<input
				ref={inputRef}
				disabled={blockInput || showModal}
				className="md:rounded-bl-xl bg-white w-4/5 text-black border-b-2 border-green-500 p-2 disabled:bg-gray-800"
				placeholder={
					blockInput
						? "input blocked"
						: mouseIn
						? "type here"
						: "terminal ready to use"
				}
				onFocus={() => setMouseIn(true)}
				onBlur={() => setMouseIn(false)}
				value={userInput}
				onChange={(e) => setUserInput(e.target.value)}
			/>
			<button
				disabled={blockInput || showModal}
				className="md:rounded-br-xl bg-black w-1/5 text-green-500 border-b-2 border-green-500 p-2 hover:bg-gray-800 transition disabled:bg-green-500 disabled:text-black"
				type="submit"
				value="Submit"
			>
				{blockInput ? "running" : "Enter"}
			</button>
		</form>
	);
};

export default InputForm;
