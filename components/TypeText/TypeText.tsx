import { useEffect, useMemo, useReducer, useState } from "react";
import { getLastMatchedIndex, getTypeStatistic, isAllowedCharacter } from "../../lib/logic";
import Text from "./Text";
import { MultiTextContextActionTypes, useMultiTextDispatch, useMultiTextState } from "./MultiTextContext";

export interface TypedWord {
    word: string;
    correctWord: string;
    lastMatchedIndex: number;
    isActive: boolean;
}

const enum TextStateActionTypes {
    BACKSPACE,
    SPACE,
    ADD_LETTER
}

interface TextState {
    typedWords: TypedWord[];
    wordIndex: number,
    lastCorrectWordIndex: number,
    activeWord: string;
}

interface TextStateAction {
    type: TextStateActionTypes;
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

    function typedWordsReducer(oldTextState: TextState, action: TextStateAction) {
        const {typedWords: oldTypedWords, wordIndex: oldWordIndex, 
            lastCorrectWordIndex: oldLastCorrectWordIndex, activeWord: oldActiveWord } = oldTextState;

        if (curTextIndex !== multiTextState.textIndex || oldWordIndex >= oldTypedWords.length) { // not our turn, we should not do anything
            return oldTextState;
        }
        switch(action.type) {
            case TextStateActionTypes.BACKSPACE: {
                // if we are at the beginning of some word (but not the very first)
                if (oldWordIndex > 0 && oldWordIndex - 1 >= oldLastCorrectWordIndex && oldActiveWord === "") {
                    const newTypedWords: TypedWord[] = oldTypedWords.map((word, index) => {
                        if (index === oldWordIndex) {
                            return {
                                word: "",
                                correctWord: word.correctWord,
                                lastMatchedIndex: 0,
                                isActive: false,
                            }
                        }
                        if (index === oldWordIndex - 1) {
                            return {
                                ...word,
                                isActive: true,
                            }
                        }
                        return word;
                    })
                    return {
                        typedWords: newTypedWords,
                        wordIndex: oldWordIndex - 1,
                        lastCorrectWordIndex: oldLastCorrectWordIndex,
                        activeWord: oldTypedWords[oldTextState.wordIndex-1].word
                    }
                }
                if (oldActiveWord.length > 0) { // if we are in a middle of a word
                    const newActiveWord = oldActiveWord.slice(0, -1);
                    const newTypedWords: TypedWord[] = oldTypedWords.map((wordData, index) => {
                      if (index === oldWordIndex) {
                        return {
                            ...wordData,
                            word: newActiveWord,
                            lastMatchedIndex: getLastMatchedIndex(newActiveWord, wordData.correctWord),
                        }
                      } 
                      return wordData; 
                    })
                    return {
                        ...oldTextState,
                        typedWords: newTypedWords,
                        activeWord: newActiveWord,
                    }
                }
                return oldTextState;
            }
            case TextStateActionTypes.SPACE: {
                if (oldActiveWord === "") { // should do anything if active word is empty
                    return oldTextState;
                }
                const newLastCorrectWordIndex = 
                    oldActiveWord === oldTypedWords[oldWordIndex].correctWord? oldLastCorrectWordIndex + 1: oldLastCorrectWordIndex;
                const newTypedWords: TypedWord[] = oldTypedWords.map((wordData, index) => {
                    if (index === oldWordIndex) {
                        return {
                            ...wordData,
                            isActive: false,
                        }
                    }
                    if (index === oldWordIndex + 1) {
                        return {
                            word: "",
                            correctWord: wordData.correctWord,
                            lastMatchedIndex: 0,
                            isActive: true,
                        }
                    }
                    return wordData;
                });

                return {
                    typedWords: newTypedWords,
                    wordIndex: oldWordIndex + 1,
                    lastCorrectWordIndex: newLastCorrectWordIndex,
                    activeWord: "",
                }
            }
            case TextStateActionTypes.ADD_LETTER: {
                const MAX_LENGTH = oldTypedWords[oldWordIndex].correctWord.length + EXTRA_CHAR_LIMIT;
                const newActiveWord = (oldActiveWord + action.newCharacter).slice(0, MAX_LENGTH);
                const newTypedWords: TypedWord[] = oldTypedWords.map((wordData, index) => {
                    if (index === oldWordIndex) {
                        return {
                            ...wordData,
                            word: newActiveWord,
                            lastMatchedIndex: getLastMatchedIndex(newActiveWord, wordData.correctWord),
                            isActive: true,
                        }
                    }
                    return wordData;
                });
                return {
                    typedWords: newTypedWords,
                    wordIndex: oldWordIndex,
                    lastCorrectWordIndex: oldLastCorrectWordIndex,
                    activeWord: newActiveWord,
                }
            }
            default: {
                throw new Error("action type not recongized " + action.type);
            }
        }
    }

    // whenever we make a change, we should update the type statistics
    useEffect(() => {
        multiTextDispatch({
            type: MultiTextContextActionTypes.UPDATE_TYPE_STATISTICS,
            typeStatistic: getTypeStatistic(textState.typedWords),
        });
    }, [textState.typedWords]);

    // check if we finished the text
    useEffect(() => {
        if (textState.wordIndex >= initialTypedWords.length || 
            (textState.wordIndex === textState.typedWords.length - 1 && 
                textState.activeWord === textState.typedWords[textState.typedWords.length - 1].correctWord)){ // if we go out of bounds
            multiTextDispatch({ 
                type: MultiTextContextActionTypes.NEXT_TEXT,
                currentTextIndex: curTextIndex,
            });
        }
    }, [textState.wordIndex, textState.activeWord, textState.typedWords]);

    // update the text component whenever typedWords is changed
    useEffect(() => {
        setTextComponent(<Text typedWords={textState.typedWords} wordIndex={textState.wordIndex} textIsActive={curTextIndex === multiTextState.textIndex}/>)
    }, [textState.typedWords, textState.activeWord, multiTextState.textIndex]);

    // listen for keyboard events
    useEffect(() => {
        const keyDownHandler = (event: KeyboardEvent) => {
          if (text === "" ) { // should not do anything if there are no words to type
            return;
          }
          if (event.key === "Backspace") {
            textStateDispatch({
                type: TextStateActionTypes.BACKSPACE,
            })
          } else if (event.key === " ") {
            textStateDispatch({
                type: TextStateActionTypes.SPACE
            })
          } else if (isAllowedCharacter(event.key)) {
            textStateDispatch({
                type: TextStateActionTypes.ADD_LETTER,
                newCharacter: event.key  
            });
            if (!multiTextState.startTyping) { // if we haven't started
                multiTextDispatch({
                    type: MultiTextContextActionTypes.START,
                });
            }
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