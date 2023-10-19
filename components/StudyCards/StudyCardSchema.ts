// shared
export interface Card {
    id: string;
    title: string | null;
    text: string | null; 
}

export interface CardAction {
    type: CardActionTypes;
    card?: Card;
    cards?: Card[];
}

// CardContext
export const enum CardActionTypes {
    ADD_CARD,
    CHANGE_CARD,
    DELETE_CARD,
    SET_CARDS,
}