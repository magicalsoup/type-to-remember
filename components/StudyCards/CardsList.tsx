import { useEffect } from "react";
import { useCards, useCardsDispatch } from "./CardsContext";
import StudyCard from "./StudyCard/StudyCard";
import { Card, CardActionTypes } from "./StudyCardSchema";
import { userPracticeListName } from "../../lib/constants";

export default function CardsList() {
  const cards = useCards();
  const dispatch = useCardsDispatch();
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      // console.log("[local storage]", localStorage.getItem(userPracticeListName) as string)
      dispatch({
        type: CardActionTypes.SET_CARDS,
        cards: JSON.parse(localStorage.getItem(userPracticeListName) as string),
      });
    }
  }, [dispatch]);

  return (
    <>
      <main className="">
        <div className="flex flex-col gap-y-6">
          {cards.length > 0 && cards.map((card: Card, index: number) => (
            <StudyCard key={index} card={card} index={index} />
          ))}
        </div>
        {cards.length === 0 && 
            <div className="font-raleway text-2xl pt-24">nothing to remember, nothing to study, you&apos;re a genius!</div>
        }
      </main>
    </>
  );
}
