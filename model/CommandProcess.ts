import { responseList } from "./CommandList";

const runProcess = (process: string) => {
    if (process === "clear") {
        // need to start implementing processes, firstly clear
        
    }
}
export const processInputToCommand = (command: string, myDb:Database, trie:CommandTrie) => {

    let cmdarr: string[] = command.split(" ");
    let cmd: string = cmdarr[0];

    if (cmdarr.length > 0) {
        
        let res = trie.search(cmd);
        if (res !== null) {
            let responseToCommand = responseList.get(res);
            if (responseToCommand !== undefined) {
                if (res === ""){
                    runProcess(res);
                }
                return responseToCommand; 
            }
        }
    }
    return "Invalid Command"
}

