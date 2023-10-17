import { useEffect, useMemo, useReducer, useState } from "react";
import { getLastMatchedIndex, isAllowedCharacter } from "../../lib/logic";
import Text from "./Text";
import { useMultiTextDispatch, useMultiTextState } from "./MultiTextContext";

export interface TypedWord {
    word: string;
    correctWord: string;
    lastMatchedIndex: number;
    isActive: boolean;
}

interface TextState {
    typedWords: TypedWord[];
    wordIndex: number,
    lastCorrectWordIndex: number,
    activeWord: string;
}

interface TextStateAction {
    type: string;
    newCharacter?: string;
}

const EXTRA_CHAR_LIMIT = 5;

export default function TypeText({title, text, curTextIndex} : 
    {title:string; text: string; curTextIndex: number}) {
   
    const multiTextState = useMultiTextState();
    const multiTextDispatch = useMultiTextDispatch();
    
    const initialTypedWords = useMemo(() => {
            return text.split(" ")?.map((word) => {
                return {
                    word: "",
                    correctWord: word,
                    lastMatchedIndex: 0,
                    isActive: false,
                }
            })
    },[]);
    
    const [textState, textStateDispatch] = useReducer(
        typedWordsReducer,
        {
            typedWords: initialTypedWords,
            wordIndex: 0,
            lastCorrectWordIndex: 0,
            activeWord: "",
        } as TextState,
    );

    const [textComponent, setTextComponent] = 
        useState(<Text typedWords={initialTypedWords} wordIndex={textState.wordIndex} textIsActive={curTextIndex === multiTextState.textIndex}/>);

    function typedWordsReducer(textState: TextState, action: TextStateAction) {
        const {typedWords, wordIndex, lastCorrectWordIndex, activeWord } = textState;
        if (curTextIndex !== multiTextState.textIndex) { // not our turn, we should not do anything
            return textState;
        }
        if (wordIndex >= typedWords.length) { // should not do anything, we are done
            return textState;
        }
        switch(action.type) {
            case "backspace": {
                if (wordIndex > 0 && wordIndex - 1 >= lastCorrectWordIndex && activeWord === "") {
                    const newTypedWords: TypedWord[] = typedWords.map((word, index) => {
                        if (index === wordIndex) {
                            return {
                                word: "",
                                correctWord: word.correctWord,
                                lastMatchedIndex: 0,
                                isActive: false,
                            }
                        }
                        if (index === wordIndex - 1) {
                            return {
                                word: word.word,
                                correctWord: word.correctWord,
                                lastMatchedIndex: word.lastMatchedIndex,
                                isActive: true,
                            }
                        }
                        return word;
                    })
                    return {
                        typedWords: newTypedWords,
                        wordIndex: wordIndex - 1,
                        lastCorrectWordIndex: lastCorrectWordIndex,
                        activeWord: typedWords[textState.wordIndex-1].word
                    }
                }
                if (activeWord.length > 0) {
                    const newActiveWord = activeWord.slice(0, -1);
                    const newTypedWords: TypedWord[] = typedWords.map((word, index) => {
                      if (index === wordIndex) {
                        return {
                            word: newActiveWord,
                            correctWord: word.correctWord,
                            lastMatchedIndex: getLastMatchedIndex(newActiveWord, word.correctWord),
                            isActive: word.isActive,
                        }
                      } 
                      return word; 
                    })
                    return {
                        typedWords: newTypedWords,
                        wordIndex: wordIndex,
                        lastCorrectWordIndex: lastCorrectWordIndex,
                        activeWord: newActiveWord,
                    }
                }
                return textState;
            }
            case "space": {
                if (activeWord === "") { // should do anything if active word is empty
                    return textState;
                }
                const newLastCorrectWordIndex = 
                    activeWord === typedWords[wordIndex].correctWord? lastCorrectWordIndex + 1: lastCorrectWordIndex;
                const newTypedWords: TypedWord[] = typedWords.map((word, index) => {
                    if (index === wordIndex) {
                        return {
                            word: word.word,
                            correctWord: word.correctWord,
                            lastMatchedIndex: word.lastMatchedIndex,
                            isActive: false,
                        }
                    }
                    if (index === wordIndex + 1) {
                        return {
                            word: "",
                            correctWord: word.correctWord,
                            lastMatchedIndex: 0,
                            isActive: true,
                        }
                    }
                    return word;
                });

                return {
                    typedWords: newTypedWords,
                    wordIndex: wordIndex + 1,
                    lastCorrectWordIndex: newLastCorrectWordIndex,
                    activeWord: "",
                }
            }
            case "add-letter": {
                const MAX_LENGTH = typedWords[wordIndex].correctWord.length + EXTRA_CHAR_LIMIT;
                const newActiveWord = (activeWord + action.newCharacter).slice(0, MAX_LENGTH);
                const newTypedWords: TypedWord[] = typedWords.map((word, index) => {
                    if (index === wordIndex) {
                        return {
                            word: newActiveWord,
                            correctWord: word.correctWord,
                            lastMatchedIndex: getLastMatchedIndex(newActiveWord, word.correctWord),
                            isActive: true,
                        }
                    }
                    return word;
                });
                return {
                    typedWords: newTypedWords,
                    wordIndex: wordIndex,
                    lastCorrectWordIndex: lastCorrectWordIndex,
                    activeWord: newActiveWord,
                }
            }
            default: {
                throw new Error("action type not recongized " + action.type);
            }
        }
    }

    // check if we finished the text
    useEffect(() => {
        if (textState.wordIndex >= initialTypedWords.length || 
            (textState.wordIndex === textState.typedWords.length - 1 && 
                textState.activeWord === textState.typedWords[textState.typedWords.length - 1].correctWord)){ // if we go out of bounds
            multiTextDispatch({ // we are done
                type: 'done',
                prevTextIndex: curTextIndex
            });

        }
    }, [textState.wordIndex, textState.activeWord, textState.typedWords]);

    // update the text component whenever typedWords is changed
    useEffect(() => {
        setTextComponent(<Text typedWords={textState.typedWords} wordIndex={textState.wordIndex} textIsActive={curTextIndex === multiTextState.textIndex}/>)
    }, [textState.typedWords, multiTextState.textIndex]);

    // listen for keyboard events
    useEffect(() => {
        const keyDownHandler = (event: KeyboardEvent) => {
          if (text === "") { // should not do anything if there are no words to type
            return;
          }
          if (event.key === "Backspace") {
            // backspace
            textStateDispatch({
                type: "backspace",
            })
          } else if (event.key === " ") {
            // space
            textStateDispatch({
                type: "space"
            })
          } else if (isAllowedCharacter(event.key)) {
            textStateDispatch({
                type: "add-letter",
                newCharacter: event.key  
            })
          }
        };
        document.addEventListener("keydown", keyDownHandler);
        return () => {
          document.removeEventListener("keydown", keyDownHandler);
        };
      }, []);

    return (
        <div className="flex flex-col w-[800px]">
            <div className="font-raleway font-medium text-2xl w-fit">{title}</div>
            {textComponent}
        </div>
    )
}