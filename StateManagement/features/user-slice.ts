import {createSlice, PayloadAction} from "@reduxjs/toolkit"


type UserState = {
    email: string | null;
    displayName: string | null;
    userId: string | null;
}

type InitialState = {
    value: UserState;
}

const initialState = {
    value: {
        email: "",
        displayName: "Guest",
        userId: "",
    } as UserState
} as InitialState

export const user = createSlice({
    name: "user",
    initialState,
     reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            return {
                value: {
                    email: action.payload.email,
                    displayName: action.payload.displayName,
                    userId: action.payload.userId,
                }
            }
        },
     }
}) 



export const {setUser} = user.actions
export default user.reducer