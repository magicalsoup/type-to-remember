import { useState, useEffect } from "react";
import { useMultiTextDispatch, useMultiTextState } from "./MultiTextContext";
import { MS_IN_A_SEC } from "../../lib/constants";
import { MultiTextContextActionTypes } from "./TypeTextSchema";

export default function TypeTimer({
  timeLimitInSeconds,
}: {
  timeLimitInSeconds: number;
}) {
  const multiTextState = useMultiTextState();
  const multiTextDispatch = useMultiTextDispatch();
  const [timeInSeconds, setTimeInSeconds] =
    useState<number>(timeLimitInSeconds);
  const [timeElapsedInMS, setTimeElapsed] = useState<number>();
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (startTime === null && multiTextState.startTyping) {
      setStartTime(Date.now());
    }
  }, [startTime, multiTextState.startTyping]);

  useEffect(() => {
    if (startTime !== null) {
      const interval = setInterval(() => {
        const timeDiff = Date.now() - startTime;
        setTimeElapsed(timeDiff);
        setTimeInSeconds(
          Math.round(timeLimitInSeconds - timeDiff / MS_IN_A_SEC)
        );
      }, 10);
      return () => clearInterval(interval);
    }
  }, [startTime, timeLimitInSeconds]);

  useEffect(() => {
    // if time ran out or if we have ran out of texts
    if (
      (timeElapsedInMS &&
        timeElapsedInMS >= timeLimitInSeconds * MS_IN_A_SEC) ||
      multiTextState.textIndex >= multiTextState.numberOfTexts
    ) {
      multiTextDispatch({
        type: MultiTextContextActionTypes.END,
        elapsedTimeInMS: timeElapsedInMS,
      });
    }
  }, [multiTextState.textIndex, multiTextState.numberOfTexts, timeElapsedInMS, multiTextDispatch, timeLimitInSeconds]);
  return (
    <>
      <div className="font-raleway text-xl text-lime-900 font-bold">
        Time: {timeInSeconds}
      </div>
    </>
  );
}
