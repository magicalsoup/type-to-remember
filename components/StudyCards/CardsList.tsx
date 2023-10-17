import { useEffect } from "react";
import { Card, useCards, useCardsDispatch } from "./CardsContext";
import StudyCard from "./StudyCard";

export default function CardsList() {
    const cards = useCards();
    const dispatch = useCardsDispatch();
    useEffect(() => {
        if (typeof localStorage !== "undefined") {
            dispatch({
                type: "set",
                cards: JSON.parse(localStorage.getItem("userPracticeList") as string)
            })
        }
    }, []);

    return (
        <>
            <main className="">
                <div className="flex flex-col gap-y-6">
                    {cards?.map((card: Card, index:number) => (
                        <StudyCard key={index} card={card} index={index}/>
                    ))}
                </div>
            </main>
        </>
    )
}