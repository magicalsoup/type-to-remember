import { CardsProvider } from "../components/StudyCards/CardsContext";
import AddCard from "../components/StudyCards/AddCard";
import CardsList from "../components/StudyCards/CardsList";
import { NavBar } from "../components/NavBar";
import SaveStudyList from "../components/StudyCards/SaveStudyList";


export default function Home () {
    return (
        <main>
            <NavBar/>
            <div className="flex flex-col pb-20">
                <div className="flex flex-col items-center"> 
                    <CardsProvider>
                        <div className="flex w-[768px] py-8 justify-between px-2">
                            <h1 className="font-raleway text-3xl">Your Study List</h1>
                            <div className="flex self-end h-full">
                                <AddCard />
                                <SaveStudyList />
                            </div>
                        </div>
                        <CardsList />
                    </CardsProvider>
                </div>
            </div>
       </main>
    )
}