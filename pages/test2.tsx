import { useEffect, useMemo, useState } from "react";
import { getCharacterInformation, getLastMatchedIndex, isAllowedCharacter } from "../lib/logic";

export default function Home() {
  const TEXT =
    "lim_{rightarrow a} there exists an delta > 0 such that if 0 < |x - a| < delta, we have |f(x) - L| < a";

  const WORDS = TEXT.split(" ");

  const WORDS_LENGTH = WORDS.length;
  const TOTAL_TIME = 100;
  const INCORRECT_CHAR_COLOR = "red";
  const CORRECT_CHAR_COLOR = "green";
  const DEFAULT_CHAR_COLOR = "gray";

  const [activeWord, setActiveWord] = useState("");
  const [spaceCounter, setSpaceCounter] = useState(0);
  const [correctWordCount, setCorrectWordCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [timeInSeconds, setTimeInSeconds] = useState(TOTAL_TIME);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [backSpaceCounter, setBackSpaceCounter] = useState(false);
  const [lastSavedIndex, setLastSavedIndex] = useState(0); // allow users to backspace the most recent word they skipped
  const [typedWords, setTypedWords] = useState<
    {
      word: string;
      correctWord: string;
      lastMatchedIndex: number;
      isActive: boolean;
    }[]
  >(
    useMemo(() => {
      let res = [];
      for (let i = 0; i < WORDS.length; i++) {
        res.push({
          word: "",
          correctWord: WORDS[i],
          lastMatchedIndex: 0,
          isActive: false,
        });
      }
      return res;
    }, [])
  );
  const [getText, setText] = useState(
    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", width:"600px"}}>
      {typedWords.map((wordData, idx) => {
        return getWord(
          wordData.word,
          wordData.correctWord,
          wordData.lastMatchedIndex,
          idx
        );
      })}
    </div>
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInSeconds((prevSecond) => {
        if (prevSecond === 0 || !gameStart) return prevSecond;
        return prevSecond - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStart]);

  useEffect(() => {
    if (
      (index == WORDS_LENGTH - 1 &&
        activeWord === typedWords[index].correctWord) ||
      timeInSeconds === 0
    ) {
      setGameFinished(true);
    }
  }, [index, timeInSeconds, activeWord]);

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
        setActiveWord((prevText) => prevText + event.key);
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
      setActiveWord(typedWords[index - 1].word);
      setBackSpaceCounter(false);
    }
  }, [backSpaceCounter, activeWord]);

  useEffect(() => {
    if (activeWord.length > 0 && index < WORDS_LENGTH) {
      // if the user presses space to skip a word
      if (activeWord === typedWords[index].correctWord) {
        setLastSavedIndex(index + 1);
      }
      setTypedWords((prevTypedWords) => {
        prevTypedWords[index] = {
          word: activeWord,
          correctWord: prevTypedWords[index].correctWord,
          lastMatchedIndex: getLastMatchedIndex(
            activeWord,
            prevTypedWords[index].correctWord
          ),
          isActive: false,
        };
        return prevTypedWords;
      });

      setIndex((prevIndex) => prevIndex + 1);
      setActiveWord("");
    }
  }, [spaceCounter]);

  useEffect(() => {
    let count = 0; // correct words
    for (let i = 0; i < WORDS_LENGTH; i++) {
      if (!typedWords[i] || !typedWords[i].word) continue;
      if (typedWords[i].word === typedWords[i].correctWord) count++;
    }
    setCorrectWordCount(count);
  }, [activeWord, index, gameFinished]);

  useEffect(() => {
    if (index < WORDS_LENGTH) {
      setTypedWords((prevTypedWords) => {
        prevTypedWords[index] = {
          word: activeWord,
          correctWord: prevTypedWords[index].correctWord,
          lastMatchedIndex: getLastMatchedIndex(
            activeWord,
            prevTypedWords[index].correctWord
          ),
          isActive: true,
        };

        setText(
        <div style={{ display: "flex",  flexWrap: "wrap",  gap: "5px", width:"600px"}}>
            {typedWords.map((wordData, idx) => {
              return getWord(
                wordData.word,
                wordData.correctWord,
                wordData.lastMatchedIndex,
                idx
              );
            })}
          </div>
        );
        return prevTypedWords;
      });
    }
  }, [activeWord, index]);


  function getWord(
    word: string,
    correctWord: string,
    matchedToIndex: number,
    idx: number
  ) {
    const isActive = idx === index;
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
      word === correctWord || idx >= index ? "" : "incorrect-word";

    return (
      <div
        className="word"
        key={idx}
        style={{ display: "inline-block", position: "relative", paddingRight: "1px"}}
      >
        <div className={isCorrect}>
          {wordData.map((charData, index) => {
            return (
              <div
                style={{ display: "inline-block", color: charData.color }}
                key={index}
              >
                {charData.character}
              </div>
            );
          })}
        </div>
        {isActive && <div className="cursor">
          {cursorWordData.map((charData, index) => {
              return (
                <div
                  style={{ display: "inline-block", color: charData.color }}
                  key={index}
                >
                  {charData.character}
                </div>
              );
            })}
        </div>}
      </div>
    );
  }

  if (!gameFinished) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div>active word: {activeWord}</div>
        <div>actual word: {WORDS[index]}</div>
        <div>{index}</div>
        <div>
          Correctwords: {correctWordCount} | Time: {timeInSeconds}s
        </div>
        <div>{getText}</div>
      </div>
    );
  } else {
    return <div>CorrectWords: {correctWordCount}</div>;
  }
}
