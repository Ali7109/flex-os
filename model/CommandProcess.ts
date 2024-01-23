import { responseList } from "./CommandList";
import { ARG_COMMAND, FREE_COMMAND, INVALID_COMMAND, SYSTEM_ERROR } from "./DEFINED OBJS/DefinedObjs";
import { getDate, isNumeric } from "./HelperFunctions";
import { ProcessResponse } from "./Types/Types";

let db:Database|null = null;

const runProcess = (processArr: string[]):ProcessResponse => {

    let cmd = processArr[0].toLowerCase();

    if (processArr.length === 1){

        if (cmd === "date"){
            let date = new Date();
            return FREE_COMMAND("date", getDate(date.getDate(), date.getDay(), date.getFullYear()));
        } else if (cmd === "ls"){
            if (db !== null){
                                
                return FREE_COMMAND("ls", db.list());
            } 
            return SYSTEM_ERROR("Database not initialized.");
        }

    } else if (processArr.length === 2){
        
        let argument = processArr[1];
        if(cmd === "wait"){
            if (isNumeric(argument) && parseInt(argument) > 0){
                return ARG_COMMAND("wait", "Waiting for " + argument + " seconds.", parseInt(argument));
            } else {
                return INVALID_COMMAND("Correct usage for 'wait': <strong>wait (time in seconds)</strong>");
            }
        } 

    } else if (processArr.length > 2){
            
        let argument = processArr[1];
        let argument2 = processArr[2];
        if (cmd === "touch"){
            if (db !== null){
                db.set(argument, argument2);
                return FREE_COMMAND("touch", "Created object with key: " + argument + " and content: " + argument2);
            }
            return SYSTEM_ERROR("Database not initialized.");
        }
    }

    return INVALID_COMMAND("");
}

export const processInputToCommand = (command: string, myDb:Database, trie:CommandTrie):ProcessResponse => {

    let cmdarr: string[] = command.toLowerCase().trim().split(" ");
    let cmd: string = cmdarr[0];
    db = myDb;

    if (cmdarr.length > 0) {
        
        let res = trie.search(cmd);
        if (res !== null) {

            let responseToCommand = responseList.get(res);
            if (responseToCommand !== undefined) {
                if (responseToCommand === ""){
                    return runProcess(cmdarr);
                } else {
                    return FREE_COMMAND(res, responseToCommand);
                }
            }
        }
    }
    return INVALID_COMMAND("");
}

