import { handleLogin } from "@/model/Firebase/Account";
import { auth } from "@/model/Firebase/Firebase";
import React, { useState, useEffect } from "react";
import { setUser } from "@/StateManagement/features/user-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/StateManagement/store";

interface ModalProps {
	setShowModal: (value: boolean) => void;
	setUserName: (value: string) => void;
}

const SignInModal = ({ setShowModal, setUserName }: ModalProps) => {
	const [signedIn, setSignedIn] = useState<boolean>(false);

	const dispatch = useDispatch<AppDispatch>();

	// Authentication check function
	// const authenticationCheck = new Promise<void>((resolve) => {
	// 	const unsubscribe = auth.onAuthStateChanged((user) => {
	// 		if (user) {
	// 			setSignedIn(true);
	// 			dispatch(
	// 				setUser({
	// 					email: user.email,
	// 					displayName: user.displayName,
	// 					userId: user.uid,
	// 				})
	// 			);
	// 			setUserName(user.displayName?.split(" ")[0] || "User");
	// 		} else {
	// 			setUserName("Guest");
	// 			setSignedIn(false);
	// 		}
	// 		// Resolve the promise after the authentication check
	// 		resolve();
	// 	});

	// 	// Return an unsubscribe function to clean up the listener if needed
	// 	return unsubscribe;
	// });

	// useEffect(() => {
	// 	// Check if user has visited before
	// 	authenticationCheck.then(() => {
	// 		if (signedIn) {
	// 			setShowModal(false);
	// 		} else {
	// 			// If user hasn't visited before, set the flag and show modal
	// 			setShowModal(true);
	// 		}
	// 	});
	// }, []);

	const handleSignIn = async () => {
		try {
			// Your sign-in logic here
			const user = await handleLogin();
			if (user !== null) {
				setSignedIn(true);
				dispatch(
					setUser({
						email: user.email,
						displayName: user.displayName,
						userId: user.uid,
					})
				);
				setUserName(user.displayName?.split(" ")[0] || "User");
			}
		} catch (error) {
			console.error("Error during login:", error);
		} finally {
			// Close the modal or perform any cleanup actions
			setShowModal(false);
		}
	};

	const handleCancel = () => {
		// Handle cancel action, if needed
		setShowModal(false);
	};

	return (
		<div className="fixed inset-0 z-10 flex items-center justify-center">
			<div className="absolute inset-0 bg-black opacity-50"></div>
			<div className="relative bg-green-500 p-8 rounded-lg">
				<h2 className="text-2xl font-bold mb-4 text-white">Welcome!</h2>
				<p className="text-white mb-4">Would you like to sign in?</p>
				<div className="flex space-x-4">
					<button
						className="bg-white text-green-500 px-4 py-2 rounded-md hover:bg-green-400 transition duration-300"
						onClick={handleSignIn}
					>
						Sign In
					</button>
					<button
						className="bg-white text-green-500 px-4 py-2 rounded-md hover:bg-green-400 transition duration-300"
						onClick={handleCancel}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default SignInModal;
