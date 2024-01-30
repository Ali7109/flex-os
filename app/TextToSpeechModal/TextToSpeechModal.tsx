import React from "react";
import { motion } from "framer-motion";

type TTSProps = {
	setTextToSpeechRequired: (value: boolean) => void;
	setShowTextToSpeechModal: (value: boolean) => void;
};

const TextToSpeechModal = ({
	setTextToSpeechRequired,
	setShowTextToSpeechModal,
}: TTSProps) => {
	return (
		<div className="absolute flex flex-col justify-center items-center text-center h-56 w-auto p-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-black z-30">
			<h1 className="text-white w-full mb-10">
				Would you like Text-to-Speech{" "}
				<strong className="text-green-500">enabled</strong>?
			</h1>

			<div className="flex justify-around w-full text-white mb-5">
				<button
					onClick={() => {
						setTextToSpeechRequired(true);
						setShowTextToSpeechModal(false);
					}}
					className="w-1/2 transition bg-green-500 hover:bg-green-600 text-black rounded-xl p-2"
				>
					<strong>Enable</strong> <br></br> (Spacebar key)
				</button>
				<button
					onClick={() => {
						setTextToSpeechRequired(false);
						setShowTextToSpeechModal(false);
					}}
					className="w-1/3 bg-white hover:bg-gray-400 text-black rounded-xl p-2"
				>
					<strong>Disable</strong> <br></br> (Esc key)
				</button>
			</div>
		</div>
	);
};

export default TextToSpeechModal;
