import { useEffect, useState,} from "react";
import Results from "../components/Results";
import { TEXT_DATA } from "../public/TEXT_DATA";
import { getPracticeList } from "../lib/logic";
import { Card } from "../components/StudyCards/CardsContext";
import TypeText from "../components/TypeText/TypeText";
import { MultiTextProvider } from "../components/TypeText/MultiTextContext";

const userPracticeListName = "userPracticeList"

export default function Home() {
    const [textArray, setTextArray] = useState<{title:string; text:string}[]>([]);
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
      <div className="flex flex-col justify-between items-center w-full h-screen select-none">
        <div className="flex flex-col w-[800px] pt-20 gap-y-3">
          <div className="font-raleway text-4xl">
            Type to Remember
          </div>
          <div className="font-raleway pl-1">
            start typing to begin
          </div>
        </div>
        <div className="flex flex-col min-h-[368px]">
          <div className="font-raleway text-xl text-lime-900 font-bold">Time:</div>
          <MultiTextProvider>
            
                {textArray.map((textData, index) => 
                    <TypeText key={index} text={textData.text} title={textData.title} curTextIndex={index}/>
                )}
            
          </MultiTextProvider>
          
        </div>
        <div>{/**Empty div*/}</div>
      </div>
    );
  
}
