import dynamic from "next/dynamic";
//import Map from "../components/Map/Map";

export default function Home() {
    const Map = dynamic(() => import("../components/Map/Map"), {
        ssr: !!false,
    });

    return (
        <div className="flex">
            <div className="flex w-2/7 h-screen">
                <p>Some content here</p>
            </div>
            <main className="flex w-5/7 h-screen">
                <Map />
            </main>
        </div>
    );
}
