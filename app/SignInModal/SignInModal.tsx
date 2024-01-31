import { handleLogin } from "@/model/Firebase/Account";
import React, { useEffect, useState } from "react";
import { setUser } from "@/StateManagement/features/user-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/StateManagement/store";
import { addAccount } from "@/Controller/AccountController";
import { User } from "@/model/Types/Types";
import { FaGoogle } from "react-icons/fa";
interface ModalProps {
	setShowModal: (value: boolean) => void;
	setUserName: (value: string) => void;
	textToSpeechRequired: boolean;
}

const readFocus = (message: string) => {
	window.speechSynthesis.cancel();

	const speechInstance = new SpeechSynthesisUtterance();
	speechInstance.rate = 1.5;
	speechInstance.text = message;
	window.speechSynthesis.speak(speechInstance);
};

const SignInModal = ({
	setShowModal,
	setUserName,
	textToSpeechRequired,
}: ModalProps) => {
	const dispatch = useDispatch<AppDispatch>();

	const handleSignIn = async () => {
		try {
			// Your sign-in logic here
			const user = await handleLogin();
			if (user !== null) {
				dispatch(
					setUser({
						email: user.email,
						displayName: user.displayName,
						userId: user.uid,
					})
				);
				const userDetails: User = {
					userId: user.uid,
					email: user.email,
					displayName: user.displayName,
				};
				addAccount(userDetails);
				setUserName(user.displayName?.split(" ")[0] || "User");
			}
		} catch (error) {
			console.error("Error during login:", error);
		} finally {
			// Close the modal or perform any cleanup actions
			setShowModal(false);
		}
	};
	useEffect(() => {
		if (textToSpeechRequired) {
			readFocus("Would you like to sign in?");
		}
	}, []);

	const handleCancel = () => {
		// Handle cancel action, if needed
		setShowModal(false);
	};

	return (
		<div className="fixed inset-0 z-10 flex items-center justify-center">
			<div className="absolute inset-0 bg-black opacity-50"></div>
			<div className="relative bg-green-500 border-white border-b-4 border-r-4 p-8 rounded-lg">
				<h2 className="text-2xl font-bold mb-4 text-white bg-black w-fit px-4 rounded-md">
					Welcome!
				</h2>
				<p className="text-white mb-4">Would you like to sign in?</p>
				<div className="flex justify-around">
					<button
						className="bg-white text-green-500 flex items-center px-4 py-2 border-b-4 border-r-4 border-black rounded-md hover:bg-black hover:border-white -translate-x-1 hover:translate-x-0 -translate-y-1 hover:translate-y-0 transition duration-100"
						onClick={handleSignIn}
						onFocus={() => {
							if (textToSpeechRequired) readFocus("Sign In");
						}}
					>
						<FaGoogle className=" mr-2" />
						Sign In
					</button>
					<button
						className="bg-white text-green-500 px-4 py-2 border-b-4 border-r-4 border-black rounded-md hover:bg-black hover:border-white -translate-x-1 hover:translate-x-0 -translate-y-1 hover:translate-y-0 transition duration-300"
						onClick={handleCancel}
						onFocus={() => {
							if (textToSpeechRequired)
								readFocus("Cancel and dont sign in");
						}}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default SignInModal;
