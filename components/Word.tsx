import { getCharacterInformation } from "../lib/logic";

export default function Word({
    word, 
    matchedToIndex,
    isActive,
}: {
        word: string; 
        matchedToIndex: number;
        isActive: boolean;
}) {
    const wordData = getCharacterInformation(word, matchedToIndex, "green", "red")
    //console.table(wordData)
    return (
        <div className={isActive? "active-word" : ""} 
            style={{display: "inline-block", paddingRight: "5px"}}>
                {wordData.map((charData, index) => {
                    return <div style={{display: "inline-block", color: charData.color}} key={index}>
                        {charData.character}
                    </div>
                })}
        </div>
    )
}