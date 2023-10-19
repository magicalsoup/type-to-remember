import { Dispatch, createContext, useContext, useReducer } from "react";
import { Card, CardAction, CardActionTypes } from "./StudyCardSchema";

const initialCards: Card[] = [];

const CardsContext = createContext<Card[]>(initialCards);
const CardsDispatchContext = createContext<Dispatch<CardAction>>({} as Dispatch<CardAction>);

export function CardsProvider({ children } : {children: React.ReactNode}) {
    const [cards, dispatch] = useReducer(
        cardsReducer,
        initialCards,
    );

    return <CardsContext.Provider value={cards}>
        <CardsDispatchContext.Provider value={dispatch}>
            {children}
        </CardsDispatchContext.Provider>
    </CardsContext.Provider>
}

export function useCards() {
    const cardsContext = useContext(CardsContext);
    if (!cardsContext) {
        throw new Error(
            "useCards has to be used within <CardsContext.Provider>"
        )
    }
    return cardsContext;
}

export function useCardsDispatch() {
    const cardsDispatchContext = useContext(CardsDispatchContext);
    if (!cardsDispatchContext) {
        throw new Error(
            "useCardsDispatch has to be used within <CardsDispatchContext.Provider>"
        )
    }
    return cardsDispatchContext;
}

function cardsReducer(cards: Card[], action: CardAction) {
    switch(action.type) {
        case CardActionTypes.ADD_CARD: {
            const newCard = action.card;
            if (newCard) {
                const newCards = [...cards, newCard];
                return newCards;
            }
            return cards;
        }
        case CardActionTypes.CHANGE_CARD: {
            const changedCard = action.card;
            if (changedCard) {
                const newCards = cards.map((card) => card.id === changedCard.id? changedCard : card);
                return newCards;
            }
            return cards;
        }
        case CardActionTypes.DELETE_CARD: {
            const deletedCard = action.card;
            if (deletedCard) {
                const newCards = cards.filter((card) => card.id !== deletedCard.id);
                return newCards;
            }
            return cards;
        }
        case CardActionTypes.SET_CARDS: {
            if (action.cards) {
                return action.cards;
            }
            return cards;
        }
        default: {
            throw Error('Unknown action ' + action.type)
        }
    }
}

