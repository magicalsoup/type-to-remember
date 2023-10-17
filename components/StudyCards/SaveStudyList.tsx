import Link from "next/link";
import { useCards } from "./CardsContext";

export default function SaveStudyList() {
    const cards = useCards();
    const saveChanges = () => {
        console.log("hallo", cards);
        localStorage.setItem("userPracticeList", JSON.stringify(cards));
    }
    return (
        <div className="pl-3">
            <button onClick={saveChanges}>
                <Link href="/">
                    Done
                </Link>
            </button>
        </div>
    )
}