import * as fs from 'fs';
const input = fs.readFileSync('./dictionary/words_beta.txt', 'utf-8')

class TrieNode {
    val: string;
    children: Map<string, TrieNode>;
    setOfValidWords: Set<string>;

    constructor(value?: string, child?: TrieNode){
        if(this.val !== undefined){
            this.val = value;
        }
        this.children = new Map<string, TrieNode>();
        this.setOfValidWords = new Set<string>();
    }
}

class Trie {
    root: TrieNode;

    constructor(){
        this.root = new TrieNode();
    }

    add(newWord: string){
        let pointer = this.root

        for(let i = 0; i < newWord.length; i++){
            if(pointer.children.has(newWord[i])){
                pointer.setOfValidWords.add(newWord);
                pointer = pointer.children.get(newWord[i]);
            } else {
                let temp = new TrieNode(newWord[i]);
                pointer.children.set(newWord[i], temp);
                pointer.setOfValidWords.add(newWord);
                pointer = temp;
            }
        }
        pointer.setOfValidWords.add(newWord);
    }

    search(searchWord: string){
        
        //If we are worried about searching too many times on number of characters inputted
        //From the client. We can prevent serches less than 3 characters. 

        // Production level feature:
        /*
            if(searchWord.length < 3){
                return new Set<string>();
            }
        */

        let pointer = this.root;

        for(let i = 0; i < searchWord.length; i++){
            if(pointer.children.has(searchWord[i])){
                if(pointer.children.get(searchWord[i]).setOfValidWords.size !== 0){
                    pointer = pointer.children.get(searchWord[i]);
                } else {
                    return pointer.setOfValidWords;
                }
            } else {
                return new Set<string>();
            }
        }

        return pointer.setOfValidWords;
    }
}

function main(){
    let dictionary = new Trie();

    const words:string[] = input.split('\n');
    for(let word of words){
        dictionary.add(word);
    }

    //Test Case 1: Search for an empty string. Return all values in dictionary
    const test1 = dictionary.search('');
    if(test1.size !== 370105){
        console.error('Error: Failed Test Case 1');
    }
    console.log('Test 1 Passed');

    //Test Case 2: Search for first value in dictionary.
    const test2 = dictionary.search('a');
    if(test2.size !== 25417){
        console.error('Error: Failed Test Case 2')
    }
    console.log('Test 2 Passed');

    //Test Case 3: Search for specific value in dictionary.
    const test3 = dictionary.search('aah');
    if(test3.size !== 4){
        console.error('Error: Failed Test Case 3, size incorrect')
    }
    if(!(test3.has('aah') && test3.has('aahed') && test3.has('aahing') && test3.has('aahs'))) {
        console.error('Error: Failed Test Case 3, values incorrect')
    }
    console.log('Test 3 Passed');

    //Test Case 4: Search for a word that returns a lot of results from the dictionary.
    const test4 = dictionary.search('aa');
    if(test4.size !== 28){
        console.error('Error: Failed Test Case 4');
    }
    console.log('Test 4 Passed');

    //Test Case 5: Search for a full word in dicionary that is not apart of any other word.
    const test5 = dictionary.search('aahed');
    if(!(test5.size === 1 && test5.has('aahed'))){
        console.error('Error: Failed Test Case 5')
    }
    console.log('Test 5 Passed');

    //Test Case 6: Search for a word with lots of values in the dictionary after the dictionary is full.
    const test6 = dictionary.search('zul');
    if(test6.size !== 8){
        console.error('Error: Failed Test Case 6, size incorrect');
    }
    if(!(test6.has('zuleika') && test6.has('zulhijjah') && test6.has('zulinde') && test6.has('zulkadah') && test6.has('zulu') && test6.has('zuludom') && test6.has('zuluize') && test6.has('zulus'))){
        console.error('Error: Failed Test Case 6, values incorrect');
    }
    console.log('Test 6 Passed');

    //Test Case 7: Search for the last value in the dictionary.
    const test7 = dictionary.search('zwitterionic');
    if(!(test7.has('zwitterionic') && test7.size === 1)){
        console.error('Error: Failed Test Case 7');
    }
    console.log('Test 7 Passed');

    //Test Case 8: Checking the add function of the dictionary.
    dictionary.add('sakthi');
    const test8 = dictionary.search('sakthi');
    if(!(test8.size === 1 && test8.has('sakthi'))){
        console.error('Addition function of Dictionary has failed');
    }
    console.log('Test 8 Passed');

    //Test Case 9: Checking the add function of the dictionary of the same word more than once.
    dictionary.add('sankarraman');
    dictionary.add('sankarraman');
    dictionary.add('sankarraman');

    const test9 = dictionary.search('sakthi');
    if(!(test9.size === 1 && test9.has('sakthi'))){
        console.error('Addition function of Dictionary has failed on multiple entries');
    }
    console.log('Test 9 Passed');
}

main();
