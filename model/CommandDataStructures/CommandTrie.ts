class TrieNode {
    children: { [key: string]: TrieNode };
    isEndOfCommand: boolean;
    command: string | null;

    constructor() {
        this.children = {};
        this.isEndOfCommand = false;
        this.command = null;
    }
}

class CommandTrie {

    private root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    insert(command: string){
        let node = this.root;
        for(let char of command){
            if(!node.children[char]){
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfCommand = true;
        node.command = command;
    }

    search(input:string):string | null {
        let node = this.root;
        for (let char of input){
            if(!node.children[char]){
                return null;
            }
            node = node.children[char];
        }

        return node.isEndOfCommand ? node.command : null;
    }
}

module.exports = CommandTrie;