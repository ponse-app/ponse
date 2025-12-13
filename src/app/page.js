"use client"

import dynamic from "next/dynamic";
import DataSelector from "../components/DataSelector/DataSelector";
import Logo from "../components/TopBar/Logo";
import { useState, useCallback } from "react";

const Map = dynamic(() => import("../components/Map/Map"), {
    ssr: !!false,
});
const PreviewMap = dynamic(() => import("../components/Map/PreviewMap"), {
    ssr: !!false,
});

import MenuButton from "@/components/TopBar/MenuButton";


export default function Home() {
    const [parameter, setParameter] = useState("pinta_ala_km2");

    const [previewTable, setPreviewTable] = useState([null, null]);
    const [selectedPreview, setSelectedPreview] = useState(0);

    const updatePreviewBounds = useCallback(
        (bounds, kuntaName, feature) => {
            // If municipality is already in the preview
            if (previewTable.some(preview => preview?.kuntaName === kuntaName)) return;

            setPreviewTable(previewTable => {
                const copy = [...previewTable];
                copy[selectedPreview] = { bounds: bounds, kuntaName: kuntaName, previewFeature: feature }

                return copy;
            })
            
            if (previewTable[1] === null) setSelectedPreview(1);
        },
        [previewTable, selectedPreview]
    );

    const handlePreviewSelection = useCallback((index) => {
        setSelectedPreview(index);
    }, []);


    return (
        <div className="font-sans min-h-screen lg:h-dvh w-dvw">
            <main className="relative flex flex-col lg:h-[100%] w-[100%] min-h-fit">
                <div className="relative h-[10vh] lg:w-[50vw] w-[100vw]">
                    <MenuButton />
                    <Logo />
                </div>
                <DataSelector setParameter={setParameter} />
                <Map onUpdatePreviewBounds={updatePreviewBounds} parameter={parameter} />
                <div className="lg:absolute relative lg:bottom-0 lg:h-screen w-full lg:w-[50vw] flex justify-evenly">
                    <PreviewMap
                        key={previewTable[0]?.kuntaName ?? "map0"}
                        preview={previewTable[0]?.bounds}
                        previewFeature={previewTable[0]?.previewFeature}
                        kuntaName={previewTable[0]?.kuntaName}
                        handlePreviewSelection={handlePreviewSelection}
                        isSelectedPreview={selectedPreview == 0}
                        position={0}
                        parameter={parameter}
                    />
                    <PreviewMap
                        key={previewTable[1]?.kuntaName ?? "map1"}
                        preview={previewTable[1]?.bounds}
                        previewFeature={previewTable[1]?.previewFeature}
                        kuntaName={previewTable[1]?.kuntaName}
                        handlePreviewSelection={handlePreviewSelection}
                        isSelectedPreview={selectedPreview == 1}
                        position={1}
                        parameter={parameter}
                    />
                </div>
            </main>
        </div>
    );
}
