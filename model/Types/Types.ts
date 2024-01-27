import { serverTimestamp } from 'firebase/firestore';

export type ProcessResponse = {
    type: string,
    response:string,
    arg: number
}

export type Command = {
	type: string;
	message: string;
};

export type User = {
    userId: string | null;
    email: string | null;
    displayName: string | null;
}
