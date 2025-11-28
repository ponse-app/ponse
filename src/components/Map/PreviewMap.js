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

const PreviewMap = ({ preview, previewFeature, kuntaName, position, handlePreviewSelection, isSelectedPreview, parameter }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    
    const [selectedPno, SetSelectedPno] = useState(null);
    const [kuntaNameCurrent, setKuntaNameCurrent] = useState("");

    proj4.defs(
        "EPSG:3067",
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
    );

    useEffect(() => {
        if (map.current == null) {
            map.current = L.map(mapContainer.current, {});
        } // stops map from intializing more than once
        if (!previewFeature) {
            console.log("previewFeature ei ole annettu", previewFeature);
            return;
        }

        proj4.defs(
            "EPSG:3067",
            "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
        );

        console.log("feature: ", previewFeature);

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

        const sorted = sortBy(preProcessedData.features, parameter);
        
        const grouped = group(sorted, parameter, Math.min(sorted.length, 9));

        const featureStyle = (feature) => {
            return {
                fillColor: getColor(feature.properties[parameter], grouped, parameter),
                weight: 1.5,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity: 1,
            };
        };

        const pnoLayer = L.Proj.geoJson(
            preProcessedData, {
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
                });
                layer.addEventListener("mouseout", (e) => {
                    e.target.setStyle(featureStyle(feature));
                });
                layer.addEventListener("click", (e) => {
                    console.log(feature.properties);
                    SetSelectedPno(feature.properties);
                    console.log(selectedPno);
                });
            },
        }).addTo(map.current);
        console.log(previewFeature, selectedPno);
        if (kuntaNameCurrent != kuntaName) {
            setKuntaNameCurrent(kuntaName);
            SetSelectedPno(null);
            map.current.fitBounds(pnoLayer.getBounds(), {
                animate: false,
            });
            map.current.setMaxBounds(pnoLayer.getBounds().pad(0.3));
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

        // Add legend
        const legend = createLegend(parameter, grouped);
        legend.addTo(map.current);

        return () => {
            legend.remove();

            if (map.current == null) return;
            map.current?.eachLayer((layer) => {
                layer.off();
                map.current.removeLayer(layer);
            });
            console.log("PreviewMap useEffect return");
        };
    }, [previewFeature, preview, parameter, selectedPno, kuntaName, kuntaNameCurrent]); // Block user pan the map out of view.

    const styles = {
        visibility: preview ? "visible" : "hidden",
        left: 0,
        right: "",
    };

    if (position == 1) {
        styles.left =  "",
        styles.right = 0
    }

    const selectedStyle = {
        color: isSelectedPreview ? "yellow" : "red",
    };

    return (
        <div
            className="lg:absolute lg:bottom-0 max-w-[100%] lg:block flex flex-col-reverse lg:flex-col flex-none justify-end"
            style={styles}
        >
            <PreviewStatTable
                pnoInfo={selectedPno}
                kuntaName={kuntaName}
                parameter={parameter}
            />
            <p
                className="text-center"
                style={selectedStyle}
                onClick={(e) => {
                    handlePreviewSelection(position);
                }}
            >
                {kuntaName}
            </p>
            <div ref={mapContainer} className="h-[25vh] lg:w-[25vw] w-[50vw] flex-none"></div>
        </div>
    );
};

export default memo(PreviewMap);
