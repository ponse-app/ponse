"use client";

import dynamic from "next/dynamic";
//import Map from "../components/Map/Map";
import DataSelector from "../components/DataSelector/DataSelector";
import { useEffect, useState } from "react";

export default function Home() {
    const Map = dynamic(() => import("../components/Map/Map"), {
        ssr: !!false,
    });
    const PreviewMap = dynamic(() => import("../components/Map/PreviewMap"), {
        ssr: !!false,
    });

    const [parameter, setParameter] = useState("miehet");

    const [preview1, setPreview1] = useState(null);

    const updatePreviewBounds = (bounds) => {
        setPreview1(bounds);
    };

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
                    <DataSelector
                        setParameter={(value) => setParameter(value)}
                    />
                    <PreviewMap
                        preview1 = {preview1}
                    />
                </div>
                <Map parameter={parameter} 
                    onUpdatePreviewBounds={updatePreviewBounds}/>
            </main>
        </div>
    );
}
