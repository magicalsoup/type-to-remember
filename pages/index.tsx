import { MultiTextProvider } from "../components/TypeText/MultiTextContext";
import { MultiText} from "../components/TypeText/MultiText";
import Menu from "../components/Landing/Menu";
import { landingPageTextArray } from "../lib/constants";

export default function Home() {
    return (
        <>
            <div className="flex flex-row max-h-screen">
                <Menu />
                <div className="flex flex-col py-12 px-20 gap-y-24">
                    <div className="font-raleway text-4xl">type to remember</div>
                    <MultiTextProvider >
                        <MultiText textArray={landingPageTextArray}/>
                    </MultiTextProvider>
                </div>
            </div>
        </>
    );
}
