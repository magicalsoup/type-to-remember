import {
  MultiTextProvider,
  useMultiTextState,
} from "../components/TypeText/MultiTextContext";
import { MulitTextWrapper } from "../components/TypeText/MultiText";
import { useEffect, useState } from "react";
import { getPracticeList } from "../lib/logic";
import { TEXT_DATA } from "../public/TEXT_DATA";
import { TextData } from "../components/TypeText/TypeTextSchema";
import { NavBar } from "../components/NavBar";
import { Card } from "../components/StudyCards/StudyCardSchema";
import TypingResults from "../components/TypeText/TypingResults";

const userPracticeListName = "userPracticeList";

function Home() {
  const multiTextState = useMultiTextState();

  const [textArray, setTextArray] = useState<TextData[]>([]);

  useEffect(() => {
    let curTextArray = getPracticeList(TEXT_DATA);
    if (typeof localStorage !== "undefined") {
      if (localStorage.getItem(userPracticeListName)) {
        const cards = JSON.parse(
          localStorage.getItem(userPracticeListName) as string
        );
        console.log("got user cached words", cards);
        if (cards.length > 0) {
          curTextArray = getPracticeList(
            cards.map((card: Card) => {
              return { title: card.title, text: card.text };
            })
          );
        }
      }
    }
    setTextArray(curTextArray);
  }, []);

  if (!multiTextState.finishTyping) {
    return (
      <>
        <div className="flex flex-col gap-y-10 items-center w-full max-h-screen select-none">
          <div className="flex flex-col w-[800px] gap-y-3">
            <div className="font-raleway pt-10">start typing to begin!</div>
          </div>
          <MulitTextWrapper textArray={textArray} />
        </div>
      </>
    );
  } else {
    return <TypingResults texts={textArray} />;
  }
}

export default function HomeWrapper() {
  return (
    <>
      <NavBar />
      <MultiTextProvider>
        <Home />
      </MultiTextProvider>
    </>
  );
}
