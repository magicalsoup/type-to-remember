import { getCorrectWordCount, getTypingAccuracy, getWPM } from "../../lib/logic";
import { useMultiTextState } from "./MultiTextContext";

export default function TypingResults({texts} : {
    texts: {
        title:string;
        text: string;
    }[];
}) {
    const multiTextState = useMultiTextState();
    const typeStatistics = multiTextState.typeStatistics;
    const timeTakenInMS = multiTextState.elapsedTimeInMS;
    // bug time take inMS is 0,
    const timeTakenInSeconds = timeTakenInMS? Math.round(timeTakenInMS / 1000.0) : 0;
    const correctWordCount = getCorrectWordCount(typeStatistics);
    const accuracy = getTypingAccuracy(typeStatistics);
    const wordsPerMinute = getWPM(correctWordCount, timeTakenInMS);

    // need total words typed
    // console.log("[correctWordCount] [timeTakeInMs]", correctWordCount, timeTakenInMS);
    // console.log(timeTakenInSeconds);
   
    return (
        <div className="flex flex-col justify-center items-center py-16 max-h-screen w-full">
            <div className="flex flex-col w-3/5 max-w-[1284px] gap-y-16">
                <div className="font-raleway text-4xl">
                    Your Results
                </div>
                <div className="flex justify-between w-full">
                    <div className="grid grid-rows-2 grid-cols-2 gap-x-12 gap-y-12 w-1/2"> 
                        <div className="flex flex-col">
                            <div className="font-raleway text-3xl">wpm</div>
                            <div className="font-robotomono text-5xl text-lime-900">{wordsPerMinute}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="font-raleway text-3xl">time</div>
                            <div className="font-robotomono text-5xl text-lime-900">{timeTakenInSeconds}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="font-raleway text-3xl">acc</div>
                            <div className="font-robotomono text-5xl text-lime-900">{accuracy}%</div>
                        </div>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <p className="font-raleway text-xl">You just improved your memory on:</p>
                        <div className="pl-6 space-y-6">
                            {texts && texts.map(({title, text}, index) =>
                                <li className="font-robotomono text-xl" key={index}>
                                    {title}
                                </li>
                            )}
                        </div>
                    </div>
                </div>
                <button onClick={() => window.location.reload()} className="font-raleway text-2xl">
                    restart
                </button>
            </div>
        </div>
    )
}