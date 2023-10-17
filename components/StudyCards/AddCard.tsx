import { useState } from "react";
import { Card, useCardsDispatch } from "./CardsContext";
import { v4 as uuidv4 } from "uuid";

export default function addCard() {
    const dispatch = useCardsDispatch();
    return (
        <div className="pr-3">
            <button className=""
                onClick={()=> {
                const blankCard: Card = {
                    id: uuidv4(),
                    title: "",
                    text: "",
                }
                console.log("new card id", blankCard.id);
                    dispatch({
                    type: 'added',
                    card: blankCard
                });
            }}>
            Add
            </button>
        </div>
    )
}

let nextId = 1;