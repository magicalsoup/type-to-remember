import Link from "next/link";
import { useCards } from "./CardsContext";

export default function SaveStudyList() {
    const cards = useCards();
    const saveChanges = () => {
        // console.log("hallo", cards);
        // only allow cards with writing in them
        const filterCards = cards.filter((card) => card.id && card.title && card.text);
        localStorage.setItem("userPracticeList", JSON.stringify(filterCards));
    }
    return (
        <div className="pl-3">
            <button onClick={saveChanges}>
                <Link className="bg-lime-800 px-4 py-2.5 rounded-xl text-white" href="/type">
                    Done
                </Link>
            </button>
        </div>
    )
}