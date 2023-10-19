import { MultiTextProvider } from "../components/TypeText/MultiTextContext";
import { MulitTextWrapper } from "../components/TypeText/MultiText";
import { useEffect, useState } from "react";
import { Card } from "../components/StudyCards/CardsContext";
import { getPracticeList } from "../lib/logic";
import { TEXT_DATA } from "../public/TEXT_DATA";
import { TextData } from "../components/TypeText/TypeTextSchema";

const userPracticeListName = "userPracticeList";

export default function Home() {
    const [textArray, setTextArray] = useState<TextData[]>([]);

    useEffect(() => {
        let curTextArray = getPracticeList(TEXT_DATA);
        if (typeof localStorage !== "undefined") {
            if (localStorage.getItem(userPracticeListName)) {
                const cards = JSON.parse(localStorage.getItem(userPracticeListName) as string);
                console.log("got user cached words", cards);
                if (cards.length > 0) {
                    curTextArray = getPracticeList(cards.map((card: Card) => {
                        return {title: card.title, text: card.text}}
                    ));
                }
            }
        }
        setTextArray(curTextArray);
    },[]);

    return (
        <MultiTextProvider >
            <MulitTextWrapper textArray={textArray}/>
        </MultiTextProvider>
    );
}
