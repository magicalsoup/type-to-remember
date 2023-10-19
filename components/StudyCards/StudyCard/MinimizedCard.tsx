import { Card } from "../StudyCardSchema";

export default function MinimizedCard({card}: {card: Card}) {
    if (card.text === null) {
        return <p className="py-8 px-8 italic truncate">Description of this card...</p>
    }
    else {
        return <p className="py-8 px-8 truncate">{card.text}</p>
    }
}