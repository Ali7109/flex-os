import { responseList } from "./CommandDataStructures/CommandList";
import { ARG_COMMAND, FREE_COMMAND, INVALID_COMMAND, SYSTEM_ERROR } from "./Defined Constants/DefinedObjs";
import Database from "./CommandDataStructures/Database";
import { getCurrentDateAndTime, getDate, isNumeric } from "./HelperFunctions";
import { ProcessResponse, User } from "./Types/Types";
import { addToFileSystem, deleteFile, getFileContent, getFiles } from "@/Controller/AccountController";


const runProcess = async (user:User, processArr: string[]): Promise<ProcessResponse> => {

    let cmd = processArr[0].toLowerCase(); 
    let db = Database.getInstance();

    let guestUser = (user.displayName === "Guest" && user.email === "");

    if (processArr.length === 1){

        if (cmd === "date"){
            let date = new Date();
            return FREE_COMMAND("date", getDate(date.getDate(), date.getDay(), date.getFullYear()));
        } else if (cmd === "ls"){
            
            if(!guestUser){
                let files = await getFiles(user);
                return FREE_COMMAND("ls", files);
            }

            if (db !== null){
                return FREE_COMMAND("ls", db.listKeys());
            } 
            return SYSTEM_ERROR("Database not initialized.");
        } else if(cmd === "exit"){
            return FREE_COMMAND("exit", "Exiting terminal emulator...");
        }

    } else if (processArr.length === 2){
        
        let argument = processArr[1];
        if(cmd === "wait"){
            if (isNumeric(argument) && parseInt(argument) > 0){
                return ARG_COMMAND("wait", "Waiting for " + argument + " seconds.", parseInt(argument));
            } else {
                return INVALID_COMMAND("Correct usage for 'wait': <strong>wait (time in seconds)</strong>");
            }
        } else if (cmd === "read" || cmd === "rm"){

            if (!guestUser){
                if(cmd === "read"){
                    let fileContent = await getFileContent(user, argument);
                    if(fileContent == null){
                        return INVALID_COMMAND("Object with key '" + argument + "' does not exist.");
                    } else {
                        return FREE_COMMAND("read", fileContent);
                    }       
                } else {
                    let deleted = await deleteFile(user, argument);
                    if (deleted){
                        return FREE_COMMAND("rm", "Removed object with key: " + argument);
                    } else {
                        return INVALID_COMMAND("Object with key '" + argument + "' does not exist.");
                    }
                }
            }

            if (db !== null){
                let value:string = db.get(argument);
                if (value !== "Missing key"){
                    if (cmd === "rm"){
                        db.delete(argument);
                        return FREE_COMMAND("rm", "Deleted object with key: " + argument);
                    } else {
                        return FREE_COMMAND("read", value);
                    }
                } else {
                    return INVALID_COMMAND("Object with key '" + argument + "' does not exist.");
                }
            }
            return SYSTEM_ERROR("Database not initialized.");
        }

    } else if (processArr.length > 2){
        
        let argument = processArr[1];
        
        if (cmd === "touch"){
            let content:string = processArr.slice(2).join(" ");
            if(!guestUser){
                let timeOfCreation:string = getCurrentDateAndTime();

                let added = await addToFileSystem(timeOfCreation, user, argument, content);
                if (!added){
                    return INVALID_COMMAND("Object with key '" + argument + "' already exists.");
                }
                return FREE_COMMAND("touch", "Created object with key: " + argument);
            }
            if (db !== null){
                // let added = db.set(argument, content);
                let added = await addToFileSystem("", user, argument, content);
                if (!added){
                    return INVALID_COMMAND("Object with key '" + argument + "' already exists.");
                }
                return FREE_COMMAND("touch", "Created object with key: " + argument);
            }
            
            return SYSTEM_ERROR("Database not initialized.");
        }
    }

    return INVALID_COMMAND("");
}

export const processInputToCommand = (user:User, command: string, trie:CommandTrie): Promise<ProcessResponse> | ProcessResponse => {

    let cmdarr: string[] = command.toLowerCase().trim().split(" ");
    let cmd: string = cmdarr[0];
   
    if (cmdarr.length > 0) {
        
        let res = trie.search(cmd);
        if (res !== null) {

            let responseToCommand = responseList.get(res);
            if (responseToCommand !== undefined) {
                if (responseToCommand === ""){
                    return runProcess(user, cmdarr);
                } else {
                    return FREE_COMMAND(res, responseToCommand);
                }
            }
        }
    }
    return INVALID_COMMAND("");
}

