import { useEffect } from "react";
import TextStateController from "./TextStateController";
import { useMultiTextDispatch, useMultiTextState } from "./MultiTextContext";
import { MultiTextContextActionTypes, TextData } from "./TypeTextSchema";
import TypeTimer from "./TypeTimer";
import TypingResults from "./TypingResults";
import { EXAMPLE_TIME_LIMIT_IN_SEC } from "../../lib/constants";


export default function MultiText({ textArray }: { textArray: TextData[] }) {
  const multiTextDispatch = useMultiTextDispatch();

  useEffect(() => {
    multiTextDispatch({
      type: MultiTextContextActionTypes.INITIALIZE,
      numberOfTexts: textArray.length,
    });
  }, [textArray]);

  return (
    <>
      <div className="flex flex-col gap-[20px]">
        {textArray.map((textData, index) => (
          <TextStateController
            key={index}
            text={textData.text}
            title={textData.title}
            curTextIndex={index}
          />
        ))}
      </div>
    </>
  );
}

export function MulitTextWrapper({ textArray }: { textArray: TextData[] }) {
  const multiTextState = useMultiTextState();
  if (!multiTextState.finishTyping) {
    return (
      <div className="flex flex-col justify-between items-center w-full h-screen select-none">
        <div className="flex flex-col w-[800px] pt-20 gap-y-3">
          <div className="font-raleway text-4xl">Type to Remember</div>
          <div className="font-raleway pl-1">start typing to begin</div>
        </div>
        <div className="flex flex-col min-h-[368px]">
          <TypeTimer timeLimitInSeconds={EXAMPLE_TIME_LIMIT_IN_SEC} />
          <MultiText textArray={textArray} />
        </div>
        <div>{/**Empty div*/}</div>
      </div>
    );
  } else {
    return <TypingResults texts={textArray} />;
  }
}
