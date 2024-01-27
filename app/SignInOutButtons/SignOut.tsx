import { setUser } from "@/StateManagement/features/user-slice";
import { AppDispatch } from "@/StateManagement/store";
import { handleLogout } from "@/model/Firebase/Account";
import React from "react";
import { useDispatch } from "react-redux";

interface SignOutProps {
	setUserName: (value: string) => void;
}

const SignOut = ({ setUserName }: SignOutProps) => {
	const dispatch = useDispatch<AppDispatch>();

	const handleSignOut = async () => {
		try {
			// Your sign-in logic here
			const successLogout = await handleLogout();
			if (successLogout) {
				dispatch(
					setUser({
						displayName: "Guest",
						email: "",
						userId: "",
					})
				);
				setUserName("Guest");
			}
		} catch (error) {
			console.error("Error during login:", error);
		} finally {
			// Close the modal or perform any cleanup actions
			window.location.reload();
		}
	};

	return (
		<div className="flex flex-col items-center">
			<button
				onClick={handleSignOut}
				className="absolute top-5 bg-[#2a3a3c] p-2 pl-6 pr-6 left-1/2 -translate-x-1/2 translation text-green-500 hover:bg-white rounded-xl hover:text-red-500"
			>
				Sign out
			</button>
		</div>
	);
};

export default SignOut;
