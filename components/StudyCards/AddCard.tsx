import { useCardsDispatch } from "./CardsContext";
import { v4 as uuidv4 } from "uuid";
import { Card, CardActionTypes } from "./StudyCardSchema";

export default function AddCard() {
    const dispatch = useCardsDispatch();
    return (
        <div className="pr-3">
            <button className=""
                onClick={()=> {
                    const blankCard: Card = {
                        id: uuidv4(),
                        title: null,
                        text: null,
                    }
                    dispatch({
                    type: CardActionTypes.ADD_CARD,
                    card: blankCard
                });
            }}>
            Add
            </button>
        </div>
    )
}
