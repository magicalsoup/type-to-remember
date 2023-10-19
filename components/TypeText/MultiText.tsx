import { useEffect } from "react";
import TextStateController from "./TextStateController";
import { useMultiTextDispatch, useMultiTextState } from "./MultiTextContext";
import { MultiTextContextActionTypes, TextData } from "./TypeTextSchema";
import TypeTimer from "./TypeTimer";
import { EXAMPLE_TIME_LIMIT_IN_SEC } from "../../lib/constants";

export function MultiText({ textArray }: { textArray: TextData[] }) {
  const multiTextDispatch = useMultiTextDispatch();

  useEffect(() => {
    multiTextDispatch({
      type: MultiTextContextActionTypes.INITIALIZE,
      numberOfTexts: textArray.length,
    });
  }, [textArray]);

  return (
    <>
      <div className="flex flex-col gap-8 select-none">
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
    return (
      <>
          <div className="flex flex-col min-h-[368px]">
            <TypeTimer timeLimitInSeconds={EXAMPLE_TIME_LIMIT_IN_SEC} />
            <MultiText textArray={textArray} />
          </div>
          <div>{/**Empty div*/}</div>
      </>
    );
}
