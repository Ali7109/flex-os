export const CommandList:string[] = [
    "help",
    "what",
    "clear",
]

export const responseList = new Map<string, string>([
    ["help",  "Here is a list of commands you can try: <br><br>" +
    "help - displays this list of commands <br>" +
    "what - displays a description of this terminal emulator <br>" +
    "clear - clears the terminal screen <br>" +
    "ls - lists all the files in the current directory <br>" +
    "cd - changes the current directory <br>" +
    "cat - displays the contents of a file <br>" +
    "mkdir - creates a new directory <br>" +
    "touch - creates a new file <br>" +
    "rm - deletes a file or directory <br>" +
    "mv - moves a file or directory <br>" +
    "cp - copies a file or directory <br>" +
    "pwd - displays the current directory <br>" +
    "history - displays the history of commands <br>" +
    "date - displays the current date and time <br>" +
    "exit - exits the terminal emulator"],
    ["what", "This is a terminal emulator that simulates a Linux terminal."],
    ["clear", ""],
]);
    
