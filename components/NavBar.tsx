import Link from "next/link";

export function NavBar() {
    return (
        <div className="flex gap-x-8 px-8 py-8">
            <Link href="/">
                <div className="font-raleway text-xl">
                    Type to Remember
                </div>
            </Link>
            <Link href="/studylist">
                <div className="font-raleway text-lg text-lime-900">
                    study list
                </div>
            </Link>
         
        </div>
    )
}