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

import MenuButton from "@/components/MenuButton";

export default function Home() {
    const [parameter, setParameter] = useState("miehet");

    const [previewTable, setPreviewTable] = useState([null, null]);
    const [selectedPreview, setSelectedPreview] = useState(0);

    const updatePreviewBounds = useCallback(
        (bounds, kuntaName, feature) => {
            if (selectedPreview == 1) {
                setPreviewTable([
                    previewTable[0],
                    { bounds: bounds, kuntaName: kuntaName, previewFeature: feature },
                ]);
            }
            else {
                setPreviewTable([
                    { bounds: bounds, kuntaName: kuntaName, previewFeature: feature },
                    previewTable[1]
                ]);
                if (previewTable[1] == null) {
                    setSelectedPreview(1);
                }
            }
            //setPreview1(bounds);
        },
        [previewTable, selectedPreview]
    );

    const handlePreviewSelection = useCallback(
        (index) => {
            setSelectedPreview(index);
            //console.log("Selected preview :", selectedPreview.current);
        },
        []
    );

    return (
        <div className="font-sans min-h-screen h-dvh w-dvw">
            <main className="relative h-[100%] w-[100%]">
                <div className="absolute h-full w-[50%] grid grid-rows-3 grid-cols-4">
                    <MenuButton />
                    <DataSelector setParameter={setParameter} />
                    <PreviewMap
                        preview={previewTable[0]?.bounds}
                        previewFeature={previewTable[0]?.previewFeature}
                        kuntaName={previewTable[0]?.kuntaName}
                        handlePreviewSelection={handlePreviewSelection}
                        isSelectedPreview={selectedPreview == 0}
                        position={0}
                        parameter={parameter}
                    />
                    <PreviewMap
                        preview={previewTable[1]?.bounds}
                        previewFeature={previewTable[1]?.previewFeature}
                        kuntaName={previewTable[1]?.kuntaName}
                        handlePreviewSelection={handlePreviewSelection}
                        isSelectedPreview={selectedPreview == 1}
                        position={1}
                        parameter={parameter}
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
