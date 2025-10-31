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

    const [previewTable, setPreviewTable] = useState([]);

    const updatePreviewBounds = useCallback(
        (bounds, kuntaName) => {
            if (previewTable.length >= 2) {
                setPreviewTable([
                    previewTable[0],
                    { bounds: bounds, kuntaName: kuntaName },
                ]);
                /* setPreviewTable([previewTable[0], bounds]); */
            } else {
                setPreviewTable([
                    ...previewTable,
                    {
                        bounds: bounds,
                        kuntaName: kuntaName,
                    },
                ]);
            }
            //setPreview1(bounds);
        },
        [previewTable]
    );

    return (
        <div className="font-sans min-h-screen h-dvh w-dvw">
            <main className="relative h-[100%] w-[100%]">
                <div className="absolute h-full w-[50%]">
                    <DataSelector setParameter={setParameter} />
                    <PreviewMap
                        preview={previewTable[0]?.bounds}
                        kuntaName={previewTable[0]?.kuntaName}
                        position={0}
                    />
                    <PreviewMap
                        preview={previewTable[1]?.bounds}
                        kuntaName={previewTable[1]?.kuntaName}
                        position={1}
                    />
                </div>
                <Map
                    onUpdatePreviewBounds={updatePreviewBounds}
                    parameter={parameter}
                />
            </main>
        </div>
    );
}
