import { useEffect } from "react";
import TypeText from "./TypeText";
import { MultiTextContextActionTypes, useMultiTextDispatch, useMultiTextState } from "./MultiTextContext";
import TypeTimer from "./TypeTimer";
import TypingResults from "./TypingResults";

export interface TextData {
    text: string;
    title: string;
}

export default function MultiText({textArray} : {textArray: TextData[]}) {

    const multiTextDispatch = useMultiTextDispatch();

    useEffect(() => {
        multiTextDispatch({
            type: MultiTextContextActionTypes.INITIALIZE,
            numberOfTexts: textArray.length,
        });
    },[]);

    return (
    <>
        <div className="flex flex-col gap-[20px]">
            {textArray.map((textData, index) => 
                <TypeText key={index} text={textData.text} title={textData.title} curTextIndex={index}/>
            )}
        </div>
    </>
    )
}

export function MulitTextWrapper({textArray} : {textArray: TextData[]}) {
    const multiTextState = useMultiTextState();
    if (!multiTextState.finishTyping) {
        return (
            <div className="flex flex-col justify-between items-center w-full h-screen select-none">
                <div className="flex flex-col w-[800px] pt-20 gap-y-3">
                <div className="font-raleway text-4xl">
                    Type to Remember
                </div>
                <div className="font-raleway pl-1">
                    start typing to begin
                </div>
                </div>
                    <div className="flex flex-col min-h-[368px]">
                        <TypeTimer />
                        <MultiText textArray={textArray}/>
                    </div>
                <div>{/**Empty div*/}</div>
            </div>
        )
    } else {
        return <TypingResults texts={textArray}/>
    }
}