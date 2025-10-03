import dynamic from "next/dynamic";
//import Map from "../components/Map/Map";
import DataSelector from "../components/DataSelector/DataSelector";

export default function Home() {
    const Map = dynamic(() => import("../components/Map/Map"), {
        ssr: !!false,
    });

    /* return (
        <div className="font-sans grid items-center justify-items-center min-h-screen">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <Map />
            </main>
        </div>
    ); */
    return (
        <div className="font-sans min-h-screen h-dvh w-dvw">
            <main className="relative h-[100%] w-[100%]">
                <div className="absolute h-full w-[50%]">
                    <DataSelector />
                </div>
                <Map />
            </main>
        </div>
    )
}
