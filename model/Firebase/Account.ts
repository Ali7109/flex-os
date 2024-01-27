import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./Firebase";


export const handleLogin = async () => {
    try {
        const creds = await signInWithPopup(auth, provider);
        return creds.user;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const handleLogout = async (): Promise<boolean> => {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
