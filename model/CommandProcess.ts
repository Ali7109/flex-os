import { responseList } from "./CommandList";
import { INVALID_COMMAND } from "./DEFINED OBJS/DefinedObjs";
import { getDate } from "./HelperFunctions";
import { ProcessResponse } from "./Types/Types";

function isNumeric(str:string){
    let pattern:RegExp  = /^[0-9]+$/;
    return pattern.test(str)
}


const runProcess = (processArr: string[]):ProcessResponse => {
    if (processArr.length === 1){

        if (processArr[0].toLowerCase() === "date"){
            let date = new Date();
            return {
                type: "date",
                response: getDate(date.getDate(), date.getDay(), date.getFullYear()),
                arg: -2
            }
        }

    } else if (processArr.length === 2){
        let argument = processArr[1];
        if(processArr[0].toLowerCase() === "wait"){
            if (isNumeric(argument) && parseInt(argument) > 0){
                return {
                    type: "wait",
                    response: "Waiting for " + argument + " seconds.",
                    arg: parseInt(argument)
                };
            } else {
                return {
                    type: "invalid",
                    response: "Invalid ; correct usage for 'wait': <strong>wait (time in seconds)</strong>",
                    arg: -1
                }
            }
        } 
    }
    return INVALID_COMMAND;
}

export const processInputToCommand = (command: string, myDb:Database, trie:CommandTrie):ProcessResponse => {

    let cmdarr: string[] = command.toLowerCase().trim().split(" ");
    let cmd: string = cmdarr[0];

    if (cmdarr.length > 0) {
        
        let res = trie.search(cmd);
        if (res !== null) {
            let responseToCommand = responseList.get(res);
            if (responseToCommand !== undefined) {
                if (responseToCommand === ""){
                    return runProcess(cmdarr);
                } else {
                    return {
                        type: "free",
                        response: responseToCommand,
                        arg: 0
                    }
                }
            }
        }
    }
    return INVALID_COMMAND;
}

