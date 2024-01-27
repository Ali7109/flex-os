import { addAccount } from "@/Controller/AccountController";
import { setUser } from "@/StateManagement/features/user-slice";
import { AppDispatch } from "@/StateManagement/store";
import { handleLogin } from "@/model/Firebase/Account";
import { User } from "@/model/Types/Types";
import React from "react";
import { useDispatch } from "react-redux";

interface SignInProps {
	setUserName: (value: string) => void;
}

const SignIn = ({ setUserName }: SignInProps) => {
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
		}
	};

	return (
		<div className="flex flex-col items-center">
			<button
				onClick={handleSignIn}
				className="absolute top-5 bg-[#2a3a3c] p-2 pl-6 pr-6 left-1/2 -translate-x-1/2 translation text-green-500 hover:bg-white rounded-xl hover:text-green-500"
			>
				Sign In
			</button>
		</div>
	);
};

export default SignIn;
