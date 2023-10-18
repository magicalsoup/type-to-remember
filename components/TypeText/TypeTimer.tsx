import { useState, useEffect } from "react";
import { MultiTextContextActionTypes, useMultiTextDispatch, useMultiTextState } from "./MultiTextContext";
import { getTypeStatistic } from "../../lib/logic";

const TIME_LIMIT = 5;

export default function TypeTimer() {
    const multiTextState = useMultiTextState();
    const multiTextDispatch = useMultiTextDispatch();
    const [timeInSeconds, setTimeInSeconds] = useState<number>(TIME_LIMIT);
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
                setTimeInSeconds(Math.round(TIME_LIMIT - timeDiff / 1000.0));
            }, 10);
            return () => clearInterval(interval);
        }
    }, [startTime, timeInSeconds]);

    useEffect(() => {
        // if time ran out or if we have ran out of texts
        if (timeElapsedInMS && timeElapsedInMS >= TIME_LIMIT * 1000 || multiTextState.finishTyping) {
            multiTextDispatch({
                type: MultiTextContextActionTypes.END,
                elapsedTimeInMS: timeElapsedInMS
            });
        }
    }, [multiTextState.finishTyping, timeElapsedInMS]);
    return (
        <>
            <div>{timeElapsedInMS}</div>
            <div className="font-raleway text-xl text-lime-900 font-bold">Time: {timeInSeconds}</div>
        </>
    )
}