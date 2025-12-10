"use client";

import React, { useRef, useEffect, useState, useImperativeHandle, memo } from "react";
import "leaflet/dist/leaflet.css";
import pno_stat from "../../app/pno_tilasto_2024.json";
import kunta_stat from "../../app/kunta_vaki2024.json";
import proj4 from "proj4";
import "proj4leaflet";
import { getColor, group, sortBy, createLegend } from "@/utlis/coloringTool";
import PreviewStatTable from "./PreviewStatTable";
import { preProcessData } from "@/utlis/dataPreProcessor";

import L from "leaflet";
import { useTranslation } from "react-i18next";

const PreviewMap = ({ preview, previewFeature, kuntaName, position, handlePreviewSelection,
    isSelectedPreview, parameter, lng }) => {

    const [t, i18n] = useTranslation();

    const mapContainer = useRef(null);
    const map = useRef(null);

    const [selectedPno, SetSelectedPno] = useState(null);
    const [kuntaNameCurrent, setKuntaNameCurrent] = useState("");

    const preProcessedRef = useRef([]);

    const [hoverValue, setHoverValue] = useState(null);
    const groupedRef = useRef(null);

    proj4.defs(
        "EPSG:3067",
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
    );

    useEffect(() => {
        if (map.current == null) {
            map.current = L.map(mapContainer.current, { minZoom: 5, maxZoom: 13 });
        } // stops map from intializing more than once
        if (!previewFeature) {
            return;
        }

        proj4.defs(
            "EPSG:3067",
            "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
        );

        // Here we look for the postnumbers of the municipality
        let postnumbers = [];
        for (const pno of pno_stat.features) {
            if (pno.properties.kunta == previewFeature.properties.kunta) {
                postnumbers.push(pno);
            }
        }

        var collection = {
            features: postnumbers,
            type: "FeatureCollection",
            crs: {
                type: "name",
                properties: {
                    name: "urn:ogc:def:crs:EPSG::3067",
                },
            },
        };

        const preProcessedData = {
            ...collection,
            features: preProcessData(collection.features, parameter),
        };
        preProcessedRef.current = preProcessedData;

        const sorted = sortBy(preProcessedData.features, parameter);

        groupedRef.current = group(sorted, parameter, Math.min(sorted.length, 9));

        const featureStyle = (feature) => {
            return {
                fillColor: getColor(feature.properties[parameter], groupedRef.current, parameter),
                weight: 1.5,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity: 1,
            };
        };


        const pnoLayer = L.Proj.geoJson(preProcessedData, {
            style: featureStyle,
            onEachFeature: function (feature, layer) {
                layer.addEventListener("mouseover", (e) => {
                    layer.setStyle({
                        fillColor: "#222222",
                        weight: 2,
                        opacity: 1,
                        color: "yellow",
                        dashArray: "3",
                        fillOpacity: 1,
                    });
                    setHoverValue(feature?.properties[parameter]);
                });
                layer.addEventListener("mouseout", (e) => {
                    e.target.setStyle(featureStyle(feature));
                    setHoverValue(null);
                });
                layer.addEventListener("click", (e) => {
                    SetSelectedPno(feature.properties);
                });
            },
        }).addTo(map.current);

        if (kuntaNameCurrent != kuntaName) {
            setKuntaNameCurrent(kuntaName);
            SetSelectedPno(null);
            console.log(preview);
            map.current.setMaxBounds(null);
            map.current.fitBounds(preview, {
                animate: false,
            });
            map.current.setMaxBounds(preview?.pad(2));
        }

        const kuntaLayer = L.Proj.geoJson(kunta_stat, {
            style: {
                fillColor: "#000000",
                weight: 2,
                opacity: 0.5,
                color: "blue",
                dashArray: "3",
                fillOpacity: 0,
            },
            interactive: false,
        }).addTo(map.current);

        return () => {
            if (map.current == null) return;
            map.current?.eachLayer((layer) => {
                layer.off();
                map.current.removeLayer(layer);
            });
        };
    }, [previewFeature, preview, parameter, selectedPno, kuntaName, kuntaNameCurrent]); // Block user pan the map out of view.

    useEffect(() => {
        // Add legend
        if (!preview) return;
        const legend = createLegend(
            parameter,
            groupedRef.current,
            hoverValue,
            "preview",
            t("coloringTool.noData")
        );
        legend.addTo(map.current);

        return () => {
            legend.remove();
        };
    }, [hoverValue, parameter, preview, t]);

    const styles = {
        visibility: preview ? "visible" : "hidden",
        left: 0,
        right: "",
    };

    if (position == 1) {
        styles.left = ""
        styles.right = 0;
    }

    const selectedStyle = {
        color: isSelectedPreview ? "yellow" : "red",
    };

    const collator = new Intl.Collator("fi", { sensitivity: "base" });

    function handleSearch(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            for (let pno of preProcessedRef.current.features) {
                if (
                    collator.compare(pno.properties.nimi.trim(), e.target.value.trim()) == 0 ||
                    collator.compare(
                        pno.properties.postinumeroalue.trim(),
                        e.target.value.trim()
                    ) == 0
                ) {
                    SetSelectedPno(pno.properties);
                    e.target.style.backgroundColor = "";
                    e.target.value = "";
                    break;
                } else {
                    e.target.style.backgroundColor = "#EE4B2B";
                }
            }
        }
    }
    
    return (
        <div
            className="lg:absolute max-w-full lg:max-w-1/2 lg:bottom-0 lg:block flex flex-col-reverse lg:flex-col flex-none justify-end"
            style={styles}
        >
            <PreviewStatTable pnoInfo={selectedPno} kuntaName={kuntaName} parameter={parameter} />
            <div className="flex lg:flex-row items-center gap-2 flex-col-reverse">
                <input
                    type="text"
                    className="box bg-white shadow-black text-black rounded-md p-2 max-w-1/2"
                    placeholder={t('previewMap.search')}
                    onKeyDown={(e) => handleSearch(e)}
                    onInput={(e) => {
                        e.target.style.backgroundColor = "";
                    }}
                ></input>
                <p
                    className="text-center"
                    style={selectedStyle}
                    onClick={(e) => {
                        handlePreviewSelection(position);
                    }}
                >
                    {kuntaName}
                </p>
            </div>
            <div ref={mapContainer} className="h-[40vh] lg:h-[25vh] lg:w-[24vw] w-[40vw] flex-none rounded-3xl"></div>
        </div>
    );
};

export default memo(PreviewMap);
