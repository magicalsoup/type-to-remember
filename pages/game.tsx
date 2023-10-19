// idea to make this into a game, beat one level at a time
// with more
// should have commands panel

import { NavBar } from "../components/NavBar";
import { MultiText } from "../components/TypeText/MultiText";
import { MultiTextProvider } from "../components/TypeText/MultiTextContext";

export default function Home() {
    return (
        <>
            <NavBar/>
            <div className="p-8 flex flex-col">
                <p className="font-robotomono text-xl">
                    Nothing to see here.... how did you find this place? 
                </p>
                <MultiTextProvider >
                    <MultiText textArray={[{title: "", text: "still in progress..."}]} />
                </MultiTextProvider>
            </div>
        </>
    )
}
