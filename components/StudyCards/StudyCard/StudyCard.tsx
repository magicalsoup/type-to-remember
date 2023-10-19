import { useState } from "react";
import { useCards, useCardsDispatch } from "../CardsContext";
import { Card, CardActionTypes } from "../StudyCardSchema";
import MinimizedCard from "./MinimizedCard";

export default function StudyCard({card, index} : {card: Card; index:number}) {
    const dispatch = useCardsDispatch();
    const [text, setText] = useState(card.text);
    const [title, setTitle] = useState(card.title);
    const [openCard, toggleOpenCard] = useState<Boolean>(false);
    const changeCard = () => {
        if (text === card.id && title === card.title) {
            return; // do nothing if nothing changed
        }
        const changedCard = {
            ...card,
            text: text,
            title: title,
        };
        dispatch({
            type: CardActionTypes.CHANGE_CARD,
            card: changedCard
        });
    }
    return (
        <div>
            <div className="flex flex-col w-[768px] border border-2 border-black border-rounded-xl rounded-xl font-raleway">
                <div className="flex justify-between w-full px-8 py-4 bg-lime-900 border-rounded-xl rounded-t-lg text-white">
                    <h1 className="text-xl">{card.title === null? "New Card" : card.title}</h1>
                    <div className="flex gap-x-3 font-medium">
                        <button onClick={() => {
                            if (openCard) {
                                changeCard();
                            }
                            toggleOpenCard((prevOpenCard) => !prevOpenCard);
                        }}>
                            {openCard? "Save" : "Edit"}
                        </button>
                        <button onClick={() => {
                            dispatch({
                                type: CardActionTypes.DELETE_CARD,
                                card: card
                            })
                        }}>Delete</button>
                    </div>
                </div>
                {openCard &&
                <div className="flex flex-col py-8 px-8 gap-y-8">
                    <input className="border-b border-b-4 border-b-lime-900 text-xl w-full p-2 bg-transparent" 
                        value={title? title: ""}
                        type="text"
                        placeholder="What do you wish to remember?"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="w-full h-52 border border-1 rounded-xl ">
                        <textarea
                            className="w-full h-full rounded-xl p-4"
                            placeholder={"What is this?"}
                            value={text? text : ""}
                            onChange={(e) => setText(e.target.value)}
                            style={{resize: "none"}}
                        >
                        </textarea>
                    </div>
                </div>}
                {!openCard && <MinimizedCard card={card}/>}
            </div>
        </div>
    )
}
