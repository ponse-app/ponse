"use client";

import dynamic from "next/dynamic";
//import Map from "../components/Map/Map";
import DataSelector from "../components/DataSelector/DataSelector";
import { useEffect, useState, useRef, useCallback } from "react";

const Map = dynamic(() => import("../components/Map/Map"), {
    ssr: !!false,
});
const PreviewMap = dynamic(() => import("../components/Map/PreviewMap"), {
    ssr: !!false,
});

export default function Home() {



    const [parameter, setParameter] = useState("miehet");

    const [preview1, setPreview1] = useState(null);

    const updatePreviewBounds = useCallback((bounds) => {
        setPreview1(bounds);
    }, []);

    return (
        <div className="font-sans min-h-screen h-dvh w-dvw">
            <main className="relative h-[100%] w-[100%]">
                <div className="absolute h-full w-[50%]">
                    <DataSelector
                        setParameter={setParameter}
                    />
                    <PreviewMap
                        preview={preview1}
                    />
                </div>
                <Map
                    onUpdatePreviewBounds={updatePreviewBounds}
                    parameter={parameter} />
            </main>
        </div>
    );
}
