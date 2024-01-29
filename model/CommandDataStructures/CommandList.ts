export const CommandList:string[] = [
    "help",
    "what",
    "clear",
    "wait",
    "date",
    "touch",
    "ls",
    "read",
    "rm",
    "exit"
]

export const responseList = new Map<string, string>([
    ["help",  "Here is a list of commands you can try: <br><br>" +
    "<strong>help</strong> - displays this list of commands. <br>" +
    "<strong>what</strong> - displays a description of what this is. <br>" +
    "<strong>clear</strong> - clears the terminal screen. <br>" +
    "<strong>ls</strong> - lists all the objects in the system. <br>" +
    "<strong>touch</strong> - creates a new object ; usage <strong>touch file_name 'all your content without quotations'</strong>. <br>" +
    "<strong>read</strong> - reads an object ; usage <strong>read file_name</strong>. <br>" +
    "<strong>rm</strong> - deletes an object ; usage <strong>rm file_name</strong>. <br>" +
    "<strong>wait</strong> - blocks input for some time, usage 'wait <strong>time</strong>, in seconds.' <br>" +
    "<strong>date</strong> - displays the current date and time. <br>" +
    "<strong>exit</strong> - exits the terminal emulator."],
    ["what", "This is a terminal emulator that simulates a Linux terminal."],
    ["clear", ""],
    ["wait", ""],
    ["date", ""],
    ["touch", ""],
    ["ls", ""],
    ["read", ""],
    ["rm", ""],
    ["exit", ""]
]);
    
