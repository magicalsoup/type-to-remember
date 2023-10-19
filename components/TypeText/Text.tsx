import { getCharacterInformation } from "../../lib/logic";
import { useMultiTextState } from "./MultiTextContext";
import { TypedWord } from "./TypeTextSchema";

export default function Word({
  typedWords,
  wordIndex,
  textIsActive,
}: {
  typedWords: TypedWord[];
  wordIndex: number;
  textIsActive: boolean;
}) {
  const multiTextState = useMultiTextState();
  function getWord(word: string, correctWord: string, wordIdx: number) {
    const isActive = wordIdx === wordIndex && textIsActive;

    const wordData = getCharacterInformation(word, correctWord);

    const typedword =
      word.length >= correctWord.length
        ? correctWord
        : correctWord.slice(0, word.length);
    const cursorWordData = getCharacterInformation(word, typedword);

    const isCorrect =
      word === correctWord || wordIdx >= wordIndex ? "" : "incorrect-word";

    return (
      <div
        className="word inline-block relative pr-[2.5px]" // note that the pr is equal to the cursor's width
        key={wordIdx}
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
        {isActive && (
          <div
            className={
              multiTextState.startTyping ? "cursor-no-blink" : "cursor"
            }
          >
            {cursorWordData.map((charData, index) => {
              return (
                <div className={`inline-block ${charData.color}`} key={index}>
                  {charData.character}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-[10px] font-robotomono text-2xl">
      {typedWords.map((wordData, wordIdx) => {
        return getWord(wordData.word, wordData.correctWord, wordIdx);
      })}
    </div>
  );
}
