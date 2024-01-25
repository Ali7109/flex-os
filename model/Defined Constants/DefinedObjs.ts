import { ProcessResponse } from "../Types/Types";

// For commands not available in the trie
export const INVALID_COMMAND = (invalidMsg:string):ProcessResponse => {

    let prefix:string = "Invalid command: ";
    let generalSuffix:string = "Please type <strong>help</strong> for a list of commands and usage.";
    let suffix:string = (invalidMsg.trim() !== "") ? invalidMsg.trim() : generalSuffix;
    return {
        type: "invalid",
        response: prefix + suffix,
        arg: -1
    }
}


// For commands with no argument
export const FREE_COMMAND = (type:string, responseToCommand:string):ProcessResponse => {
    return {
        type,
        response: responseToCommand,
        arg: 0
    }
}

// For commands with argument
export const ARG_COMMAND = (type:string, responseToCommand:string, arg:number):ProcessResponse => {
    return {
        type,
        response: responseToCommand,
        arg
    }
}

// System error, db init error or other non input related errors
export const SYSTEM_ERROR = (error:string):ProcessResponse => {
    return {
        type: "system_error",
        response: ("System error: " + error),
        arg: -2
    }
}