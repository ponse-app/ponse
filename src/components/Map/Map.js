"use client";

import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import "leaflet/dist/leaflet.css";
import kunta_stat from "../../app/kunta_vaki2024.json";
//import pno_stat from "../../app/pno_tilasto.json";
import proj4 from "proj4";
import "proj4leaflet";

import L from "leaflet";

const Map = ({ onUpdatePreviewBounds, ref, parameter, setKuntaName }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [mapLayer, setMapLayer] = useState(kunta_stat);
    const geoJsonLayer = useRef(null);

    const sortBy = () => {
        const sorted = mapLayer.features.sort(
            (a, b) => b.properties[parameter] - a.properties[parameter]
        );

        return sorted;
    };

    const sorted = sortBy();

    const group = useCallback((toBeGrouped) => {
        // Groups data to the following structure: [[200, 100, ..., 50], [ 40, ..., 30], ..., [29, ..., 10]]
        // Aims to group items equidistantly (every group have the same amount of items)
        // but designed to keep same values in the same group

        const maxAmountOfGroups = 30; // Maximum amount of groups
        const interval = Math.ceil(toBeGrouped.length / maxAmountOfGroups); // Roughfly how many items in a group

        let grouped = []; // Array for the final group

        for (let i = 0, groupNumber = 0; i < toBeGrouped.length; i++) {
            // If there's not a group already and a one is needed, create a new one
            if (grouped.length <= groupNumber) {
                grouped.push([]);
            }

            // Push current value to current group
            grouped[groupNumber].push(toBeGrouped[i]);

            // Check if current value is the same as next one.
            // If it's then delay group change to keep same values in the same group
            if (toBeGrouped[i].properties[parameter] === toBeGrouped[i+1]?.properties[parameter]) continue;

            // If current group have enough items, change group
            if (grouped[groupNumber].length >= interval) groupNumber++;
        }

        return grouped;
    }, [parameter]);

    const grouped = group(sorted)

    const getColor = useCallback(
        (value) => {
            const amountOfGaps = grouped.length;

            let whichGap = 0;
            for (let i = 0; i < amountOfGaps; i++) {
                const currentGap = grouped[i];
                if (currentGap[currentGap.length - 1].properties[parameter] <= value && value <= currentGap[0].properties[parameter]) {
                    whichGap = i;
                    break;
                }
            }

            const gapPercentage = (whichGap) / (amountOfGaps - 1) * 100;

            let lightness, hue;
            
            if (gapPercentage <= 50) {
                lightness = 50 + gapPercentage;
                hue = 120;
            } else {
                lightness = 50 + (100 - gapPercentage);
                hue = 0;
            }

            return `hsl(${hue} 100 ${lightness})`
        },
        [grouped, parameter]
    );

    proj4.defs(
        "EPSG:3067",
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
    );

    useEffect(() => {
        if (map.current == null) {
            console.log("Uusi pääkartta alustettu");
            map.current = L.map(mapContainer.current, { minZoom: 5 });
        } // stops map from intializing more than once

        const featureStyle = (feature) => {
            // console.log(feature.properties.vaesto); // Just for demonstrating purposes. This is how you can access to the properties and calculate the right color for that feature
            return {
                fillColor: getColor(feature.properties[parameter]),
                weight: 1.5,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity: 1,
            };
        };

        proj4.defs(
            "EPSG:3067",
            "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
        );

        geoJsonLayer.current?.remove();

        const pnoLayer = L.Proj.geoJson(mapLayer, {
            style: featureStyle,
            onEachFeature: function (feature, layer) {
                layer.addEventListener("click", (e) => {
                    //setMapLayer(pno_stat);
                    map.current?.fitBounds(e.target.getBounds(), { animate: true });
                    onUpdatePreviewBounds(e.target.getBounds(), feature.properties.nimi);
                    //setKuntaName(feature.properties.nimi);
                });
            },
        }).addTo(map.current);



        const legend = L.control({ position: "bottomright" });

        legend.onAdd = () => {
            const eLegendContainer = L.DomUtil.create("div", "info legend flex flex-col bg-white/80 p-2 shadow-md rounded-md text-black");

            grouped.forEach((a) => {
                const startValue = a[a.length - 1].properties[parameter];
                const endValue = a[0].properties[parameter];
                
                const eLegendLine = L.DomUtil.create("p", "legend-line flex gap-2 text-[0.9em]");
                eLegendLine.textContent = `${startValue}–${endValue}`;

                const eColorBox = L.DomUtil.create("i", "w-[17] h-[17]");
                eColorBox.style.backgroundColor = getColor(startValue);
                
                eLegendLine.prepend(eColorBox);
                eLegendContainer.append(eLegendLine);
            });

            return eLegendContainer;
        };

        legend.addTo(map.current);

        const layerBounds = pnoLayer.getBounds();
        if (mapLayer == kunta_stat && !geoJsonLayer.current) {
            map.current.fitBounds(layerBounds); // Centers the map
        }
        map.current.setMaxBounds(layerBounds.pad(0.1)); // Block user pan the map out of view.
        geoJsonLayer.current = pnoLayer;

        return () => {
            legend.remove()

            if (map.current == null) return;
            map.current?.eachLayer((layer) => {
                layer.off();
                map.current.removeLayer(layer);
            });
            /* map.current.remove();
            map.current = null;*/
            console.log("Map useEffect return");
        }
    }, [mapLayer, parameter, getColor, grouped, onUpdatePreviewBounds]);

    return (
        <div ref={mapContainer} className="absolute h-full w-1/2 right-0"></div>
    );
};

export default memo(Map);
