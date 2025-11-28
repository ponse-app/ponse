"use client";

import dynamic from "next/dynamic";
//import Map from "../components/Map/Map";
import DataSelector from "../components/DataSelector/DataSelector";
import Logo from "../components/TopBar/Logo";
import { useEffect, useState, useRef, useCallback } from "react";

const Map = dynamic(() => import("../components/Map/Map"), {
    ssr: !!false,
});
const PreviewMap = dynamic(() => import("../components/Map/PreviewMap"), {
    ssr: !!false,
});

import MenuButton from "@/components/TopBar/MenuButton";

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
            } else {
                setPreviewTable([
                    { bounds: bounds, kuntaName: kuntaName, previewFeature: feature },
                    previewTable[1],
                ]);
                if (previewTable[1] == null) {
                    setSelectedPreview(1);
                }
            }
        },
        [previewTable, selectedPreview]
    );

    const handlePreviewSelection = useCallback((index) => {
        setSelectedPreview(index);
    }, []);

    return (
        <div className="font-sans min-h-screen lg:h-dvh w-dvw">
            <main className="relative flex flex-col lg:h-[100%] w-[100%] min-h-fit">
                <div className="relative h-[10vh]">
                    <MenuButton />
                    <Logo />
                </div>
                <DataSelector setParameter={setParameter} />
                <Map
                    onUpdatePreviewBounds={updatePreviewBounds}
                    parameter={parameter}
                />
                <div className="lg:absolute relative lg:top-0 lg:h-full w-full lg:w-[50%] lg:block flex">
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
            </main>
        </div>
    );
}
