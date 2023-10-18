import { getCharacterInformation, getLastMatchedIndex } from "../../lib/logic";
import { useMultiTextState } from "./MultiTextContext";
import { TypedWord } from "./TypeText";

export default function Text({
  typedWords,
  wordIndex,
  textIsActive,
}: {
  typedWords: TypedWord[];
  wordIndex: number;
  textIsActive: boolean;
}) {
  const multiTextState = useMultiTextState();
  function getWord(
    word: string,
    correctWord: string,
    matchedToIndex: number,
    idx: number
  ) {
    const isActive = idx === wordIndex && textIsActive;

    const wordData = getCharacterInformation(word, correctWord, matchedToIndex);

    const typedword =
      word.length >= correctWord.length
        ? correctWord
        : correctWord.slice(0, word.length);
    const cursorWordData = getCharacterInformation(
      word,
      typedword,
      getLastMatchedIndex(word, typedword)
    );

    const isCorrect =
      word === correctWord || idx >= wordIndex ? "" : "incorrect-word";

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
        {isActive && (
          <div className={multiTextState.startTyping ? "cursor-no-blink" : "cursor"}>
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
      {typedWords.map((word, idx) => {
        return getWord(word.word, word.correctWord, word.lastMatchedIndex, idx);
      })}
    </div>
  );
}
