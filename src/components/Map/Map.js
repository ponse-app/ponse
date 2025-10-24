"use client";

import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import "leaflet/dist/leaflet.css";
import kunta_stat from "../../app/kunta_vaki2024.json";
//import pno_stat from "../../app/pno_tilasto.json";
import proj4 from "proj4";
import "proj4leaflet";

import L from "leaflet";

const Map = ({ onUpdatePreviewBounds, ref, parameter }) => {
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
        const maxAmountOfGaps = 30;
        const interval = Math.ceil(toBeGrouped.length / maxAmountOfGaps);
        let grouped = [];

        for (let i = 0, groupNumber = 0; i < toBeGrouped.length; i++) {
            if (grouped.length <= groupNumber) {
                grouped.push([]);
            }
            grouped[groupNumber].push(toBeGrouped[i]);

            if (toBeGrouped[i].properties[parameter] === toBeGrouped[i+1]?.properties[parameter]) continue;
            if (grouped[groupNumber].length >= interval) groupNumber++;
        }

        return grouped;
    }, [parameter]);

    const getColor = useCallback(
        (value) => {
            const grouped = group(sorted);
            const amountOfGaps = grouped.length;

            let whichGap = 0;
            for (let i = 0; i < amountOfGaps; i++) {
                const currentGap = grouped[i];
                if (currentGap[currentGap.length - 1].properties[parameter] <= value && value <= currentGap[0].properties[parameter]) {
                    whichGap = i;
                    break;
                }
            }

            return `hsl(0 100 ${(whichGap * 100) / amountOfGaps})`;
        },
        [group, sorted, parameter]
    );

    proj4.defs(
        "EPSG:3067",
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
    );

    useEffect(() => {
        if (map.current == null) {
            map.current = L.map(mapContainer.current, { minZoom: 5 });
        } // stops map from intializing more than once
    }, []);

    useEffect(() => {
        if (map.current == null) return;

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
                    map.current.fitBounds(e.target.getBounds());
                    onUpdatePreviewBounds(e.target.getBounds());
                });
            },
        }).addTo(map.current);



        const legend = L.control({ position: "bottomright" });

        legend.onAdd = () => {
            const grouped = group(sorted);
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
        }
    }, [mapLayer, parameter, getColor, sorted, group, onUpdatePreviewBounds]);

    return (
        <div ref={mapContainer} className="absolute h-full w-1/2 right-0"></div>
    );
};

export default memo(Map);
