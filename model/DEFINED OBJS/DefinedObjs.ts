import { ProcessResponse } from "../Types/Types";

export const INVALID_COMMAND:ProcessResponse = {
    type: "invalid",
    response: "Invalid command or usage. Please type <strong>help</strong> for a list of commands and usage.",
    arg: -1
}
