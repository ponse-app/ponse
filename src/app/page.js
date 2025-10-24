"use client";

import dynamic from "next/dynamic";
//import Map from "../components/Map/Map";
import DataSelector from "../components/DataSelector/DataSelector";
import { useEffect, useState, useRef } from "react";

export default function Home() {
    const Map = dynamic(() => import("../components/Map/Map"), {
        ssr: !!false,
    });
    const PreviewMap = dynamic(() => import("../components/Map/PreviewMap"), {
        ssr: !!false,
    });

    const largeMapRef = useRef(null);

    const updateSelectedParameter = (parameter) => {
        largeMapRef.current?.setParameter(parameter);
        //largeMapRef.current?.countLayers();
        //largeMapRef.current?.clearLayers();
        largeMapRef.current?.update();
    }

    //const [parameter, setParameter] = useState("miehet");

    //const [preview1, setPreview1] = useState(null);
    const previewMap1 = useRef(null);

    const updatePreviewBounds = (bounds) => {
        //setPreview1(bounds);
        //previewMap1.current
        const newBounds = previewMap1.current?.giveBounds(bounds);
        previewMap1.current?.show();
        previewMap1.current?.update();
    };

    return (
        <div className="font-sans min-h-screen h-dvh w-dvw">
            <main className="relative h-[100%] w-[100%]">
                <div className="absolute h-full w-[50%]">
                    <DataSelector
                        setParameter={updateSelectedParameter}
                    />
                    <PreviewMap
                        previewRef = {previewMap1}
                    />
                </div>
                <Map
                ref={largeMapRef}
                onUpdatePreviewBounds={updatePreviewBounds}/>
            </main>
        </div>
    );
}
