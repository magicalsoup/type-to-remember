
export function getCharacterInformation(typedWord:string, actualWord:string, matchedIndex:number, 
    correctColor:string, incorrectColor:string, defaultColor:string) {
    let data = [];
    for(let i=0; i<Math.max(actualWord.length, (typedWord? typedWord.length : 0)); i++) {
        let curColor = defaultColor;
        let character = actualWord[i];
        if(i < typedWord.length) {
            curColor = (typedWord[i] === actualWord[i] && i <= matchedIndex)? correctColor : incorrectColor;
        }
        if(i < actualWord.length) {
            character = actualWord[i];
        }
        else if(i >= actualWord.length) {
            character = typedWord[i];
            curColor = incorrectColor;
        }
    
        data.push({
            character: character,
            color: curColor,
        })
    }

    return data;
}

export function getLastMatchedIndex(typedWord:string, actualWord:string) {
    let matchedIndex = 0;
    if(!typedWord || !actualWord) {
        return -1;
    }
    while(matchedIndex < Math.min(typedWord.length, actualWord.length)) {
        if(typedWord[matchedIndex] !== actualWord[matchedIndex]) {
            return matchedIndex - 1;
        }
        matchedIndex++;
    }
    return matchedIndex-1; // error?
}

export function isAllowedCharacter(s: string) {
    if (s.length !== 1) return false;
    return s[0] >= `!` && s[0] <= `~`;
};