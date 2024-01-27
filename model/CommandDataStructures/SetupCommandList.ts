import { CommandList } from "./CommandList";

export const SetupCommandList = () => {
    const CommandTrie = require("./CommandTrie");
    const commandTrie = new CommandTrie();
    CommandList.forEach(command => {
        commandTrie.insert(command);
    })
    return commandTrie;
}

