import { useEffect, useState,} from "react";
import Results from "../components/Results";
import { TEXT_DATA } from "../public/TEXT_DATA";
import { getAccuracy, getCharacterInformation, getLastMatchedIndex, getPracticeList, isAllowedCharacter } from "../lib/logic";

export default function Home() {

  const [textArray, setTextArray] = useState<{title:string; text:string}[]>([]);
  const TOTAL_TEXTS = 3;
  const TOTAL_TIME = 60;
  const INCORRECT_CHAR_COLOR = "text-rose-500";
  const CORRECT_CHAR_COLOR = "text-emerald-800";
  const DEFAULT_CHAR_COLOR = "text-gray-500";

  const EXTRA_CHAR_LIMIT = 5;

  const [activeWord, setActiveWord] = useState("");
  const [spaceCounter, setSpaceCounter] = useState(0);
  const [correctWordCount, setCorrectWordCount] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [timeInSeconds, setTimeInSeconds] = useState(TOTAL_TIME);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameIndex, setGameIndex] = useState(0);
  const [gameStart, setGameStart] = useState(false);
  const [backSpaceCounter, setBackSpaceCounter] = useState(false);
  const [lastSavedIndex, setLastSavedIndex] = useState(0); // allow users to backspace the most recent word they skipped
  const [typedWords, setTypedWords] = useState<
  {
    word: string;
    correctWord: string;
    lastMatchedIndex: number;
    isActive: boolean;
  }[][]>([]);

  useEffect(() => {
    const curTextArray = getPracticeList(TEXT_DATA);
    setTextArray(curTextArray);
    setText(getTextComponent(curTextArray));
    setTypedWords(() => {
      let result: { word: string; correctWord: string; lastMatchedIndex: number; isActive: boolean; }[][] = [];
      curTextArray.forEach(({title, text}, index) => {
        const WORDS = text.split(" ");
        let cur = [];
        for (let i = 0; i < WORDS.length; i++) {
            cur.push({
              word: "",
              correctWord: WORDS[i],
              lastMatchedIndex: 0,
              isActive: false,
            });
        }
        result.push(cur);
      })
      return result;
    });

  }, []);

  const [getText, setText] = useState(getTextComponent(textArray));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInSeconds((prevSecond) => {
        if (prevSecond === 0 || !gameStart || gameFinished) {
          return prevSecond;
        }
        return prevSecond - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStart, gameFinished]);


  useEffect(() => {
    if (typedWords[gameIndex] && 
      index == typedWords[gameIndex].length - 1 
      && activeWord === typedWords[gameIndex][index].correctWord
    ) {
      setIndex(0);
      setActiveWord("");
      setLastSavedIndex(0);
      setBackSpaceCounter(false);
      setGameIndex((prevIndex) => prevIndex + 1);
    }
  }, [index, timeInSeconds, activeWord]);

  useEffect(() => {
    if(gameIndex === TOTAL_TEXTS || timeInSeconds === 0) {
      setGameFinished(true);
    }
  }, [timeInSeconds, gameIndex]);

  // handle when user presses keys
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        // backspace
        setActiveWord((prevText) => prevText.slice(0, -1));
        setBackSpaceCounter(true);
      } else if (event.key === " ") {
        // space
        setSpaceCounter((prevIndex) => prevIndex + 1);
        setBackSpaceCounter(false);
      } else if (isAllowedCharacter(event.key)) {
        setGameStart(true);
        setActiveWord((prevText) => {
          //const MAX_LENGTH = typedWords[gameIndex][index].correctWord.length + EXTRA_CHAR_LIMIT;
          // TODO fix extra char limit - doesn't work with backspace 
          const res = prevText + event.key;
          return res;
        });
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  useEffect(() => {
    if (
      backSpaceCounter &&
      index > 0 &&
      !activeWord &&
      index - 1 >= lastSavedIndex
    ) {
      setIndex((prevIndex) => prevIndex - 1);
      setActiveWord(typedWords[gameIndex][index - 1].word);
      setBackSpaceCounter(false);
    }
  }, [backSpaceCounter, activeWord]);

  useEffect(() => {
    if (typedWords[gameIndex] && activeWord.length > 0 && index < typedWords[gameIndex].length) {
      // if the user presses space to skip a word
      if (activeWord === typedWords[gameIndex][index].correctWord) {
        setLastSavedIndex(index + 1);
      }
      setTypedWords((prevTypedWords) => {
        prevTypedWords[gameIndex][index] = {
          word: activeWord,
          correctWord: prevTypedWords[gameIndex][index].correctWord,
          lastMatchedIndex: getLastMatchedIndex(
            activeWord,
            prevTypedWords[gameIndex][index].correctWord
          ),
          isActive: false,
        };
        return prevTypedWords;
      });

      setIndex((prevIndex) => prevIndex + 1);
      setActiveWord("");
    }
  }, [spaceCounter]);

  // count the number of correct words
  useEffect(() => {
    let count = 0; // correct words
    let attempt = 0;
    for(let k=0; k<typedWords.length; k++) {
      for (let i = 0; i < typedWords[k].length; i++) {
        if (!typedWords[k][i] || !typedWords[k][i].word) continue;
        if (typedWords[k][i].word === typedWords[k][i].correctWord) count++;
        attempt++;
      }
    }
    setCorrectWordCount(count);
    setAttemptedCount(attempt);
  }, [activeWord, index, gameFinished]);

  useEffect(() => {
    if (typedWords[gameIndex] && index < typedWords[gameIndex].length) {
      setTypedWords((prevTypedWords) => {
        prevTypedWords[gameIndex][index] = {
          word: activeWord,
          correctWord: prevTypedWords[gameIndex][index].correctWord,
          lastMatchedIndex: getLastMatchedIndex(
            activeWord,
            prevTypedWords[gameIndex][index].correctWord
          ),
          isActive: true,
        };

        setText(getTextComponent(textArray));
        return prevTypedWords;
      });
    }
  }, [activeWord, index, textArray]);


  function getWord(
    word: string,
    correctWord: string,
    matchedToIndex: number,
    idx: number,
    gameidx: number
  ) {
    const isActive = idx === index && gameidx === gameIndex;
    const wordData = getCharacterInformation(
      word,
      correctWord,
      matchedToIndex,
      CORRECT_CHAR_COLOR,
      INCORRECT_CHAR_COLOR,
      DEFAULT_CHAR_COLOR
    );

    const typedword = word.length >= correctWord.length? correctWord : correctWord.slice(0, word.length);
    const cursorWordData = getCharacterInformation(
      word,
      typedword,
      getLastMatchedIndex(word, typedword),
      CORRECT_CHAR_COLOR,
      INCORRECT_CHAR_COLOR,
      DEFAULT_CHAR_COLOR
    )

    const isCorrect =
      word === correctWord || idx >= index || gameidx != gameIndex? "" : "incorrect-word";

    return (
      <div
        className="word inline-block relative pr-[2.5px]" // note that the pr is equal to the cursor's width
        key={idx}
      >
        <div className={isCorrect}>
          {wordData.map((charData, index) => {
            return (
              <div className={`inline-block ${charData.color}`} key={index}>
                {charData.character}
              </div>
            );
          })}
        </div>
        {isActive && <div className={gameStart? "cursor-no-blink" : "cursor"}>
          {cursorWordData.map((charData, index) => {
              return (
                <div className={`inline-block ${charData.color}`} key={index}>
                  {charData.character}
                </div>
              );
            })}
        </div>}
      </div>
    );
  }

  function getTextComponent(textData: {title:string; text:string}[]) {
    return (
      <div className="flex flex-col gap-[20px]">
      {textData && textData.map(({title, text}, index) => 
        <div className="flex flex-col" key={index}>
          <div className="font-raleway font-medium text-2xl w-fit">{title}</div>
          <div className="flex flex-wrap gap-[10px] font-robotomono text-2xl">
            {typedWords[index] && typedWords[index].map((wordData, idx) => {
              return getWord(
                wordData.word,
                wordData.correctWord,
                wordData.lastMatchedIndex,
                idx,
                index
              );
          })}
          </div>
        </div>
      )}
    </div>
    )
  }

  if (!gameFinished) {
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
        <div className="flex flex-col">
          <div className="font-raleway text-xl text-lime-900 font-bold">Time: {timeInSeconds}</div>
          <div className="w-[800px] ">{getText}</div>
        </div>
        <div>{/**Empty div*/}</div>
      </div>
    );
  } else {
    
    return <>
      <Results 
              correctWordCount={correctWordCount}
              timeTakenInSeconds={TOTAL_TIME - timeInSeconds}
              accuracy={getAccuracy(attemptedCount, correctWordCount)}
              texts={textArray}
            />;
        </>
  }
}
