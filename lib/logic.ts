import { TypedWord, TypeStatistic } from "../components/TypeText/TypeTextSchema";
import { MS_IN_A_MINUTE } from "./constants";

const INCORRECT_CHAR_COLOR = "text-rose-500";
const CORRECT_CHAR_COLOR = "text-emerald-800";
const DEFAULT_CHAR_COLOR = "text-gray-500";

export function getCharacterInformation(typedWord:string, actualWord:string) {
    let data = [];
    for(let i=0; i<Math.max(actualWord.length, (typedWord? typedWord.length : 0)); i++) {
        let curColor = DEFAULT_CHAR_COLOR;
        let character = actualWord[i];
        if(i < typedWord.length) {
            curColor = (typedWord[i] === actualWord[i])? CORRECT_CHAR_COLOR : INCORRECT_CHAR_COLOR;
        }
        if(i < actualWord.length) {
            character = actualWord[i];
        }
        else if(i >= actualWord.length) {
            character = typedWord[i];
            curColor = INCORRECT_CHAR_COLOR;
        }
    
        data.push({
            character: character,
            color: curColor,
        })
    }

    return data;
}

// export function getLastMatchedIndex(typedWord:string, actualWord:string) {
//     let matchedIndex = 0;
//     if(!typedWord || !actualWord) {
//         return -1;
//     }
//     while(matchedIndex < Math.min(typedWord.length, actualWord.length)) {
//         if(typedWord[matchedIndex] !== actualWord[matchedIndex]) {
//             return matchedIndex - 1;
//         }
//         matchedIndex++;
//     }
//     return matchedIndex-1; // error?
// }

export function isAllowedCharacter(s: string) {
    if (s.length !== 1) return false;
    return s[0] >= `!` && s[0] <= `~`;
}

// deprecated
export function getAccuracy(attemptedCount:number, correctWordCount: number) {
    return Math.ceil(correctWordCount / attemptedCount * 100);
}

export function getPracticeList(array: {title:string; text:string}[]) {
    let result = array;
    for(let i=result.length-1; i>=0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = result[j];
        result[j] = result[i];
        result[i] = tmp;
    }
    return result.slice(0, 3);
}

export function getTypeStatistic(typedWords: TypedWord[]) {
    let attempts = 0;
    let correct = 0; 

    for (let i = 0; i < typedWords.length; i++) {
        if (!typedWords[i].word || !typedWords[i].correctWord) continue;
        if (typedWords[i].word === typedWords[i].correctWord) correct++;
        attempts++;
    }

    return {
        correctWordsTyped: correct,
        attemptedWordsTyped: attempts
    }
}

export function getCorrectWordCount(typeStatistcs: TypeStatistic[]) {
    let totalCorrectWords = 0;
    typeStatistcs.forEach((stat) => totalCorrectWords += stat.correctWordsTyped);
    return totalCorrectWords;
}

export function getTypingAccuracy(typeStatistcs: TypeStatistic[]) {
    let totalCorrectWords = 0;
    let totalAttemptedWords = 0;
    typeStatistcs.forEach((stat) => {
        totalCorrectWords += stat.correctWordsTyped;
        totalAttemptedWords += stat.attemptedWordsTyped;
    })
    return totalAttemptedWords === 0? 
        100 : Math.round(totalCorrectWords / totalAttemptedWords * 100);
}

// words per minute
export function getWPM(correctWordCount: number, timeTakenInMS: number | null) {
    if (timeTakenInMS === null) {
        return "NaN";
    }

    return Math.ceil(correctWordCount / (timeTakenInMS / MS_IN_A_MINUTE));
}
