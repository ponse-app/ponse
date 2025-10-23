"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import kunta_stat from "../../app/kunta_vaki2024.json";
import pno_stat from "../../app/pno_tilasto.json";
import proj4 from "proj4";
import "proj4leaflet";

import L from "leaflet";

const Map = ({ parameter }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [center, setCenter] = useState({ lng: 13.338414, lat: 52.507932 });
    const [zoom] = useState(12);
    const [mapLayer, setMapLayer] = useState(kunta_stat);
    const geoJsonLayer = useRef(null);
    const [bounds, setBounds] = useState(null);
    const legend = useRef(L.control({ position: "bottomright" }));

    const getPropertyValue = (municipalityName, property) => {
        const municipality = kunta_stat.features.find(
            (municipality) => municipality.properties.nimi === municipalityName
        );

        if (municipality) return municipality.properties[property];

        return null;
    };

    const sortBy = () => {
        const sorted = mapLayer.features.sort(
            (a, b) => b.properties[parameter] - a.properties[parameter]
        );

        return sorted;
    };

    const sorted = sortBy();

    const group = (toBeGrouped) => {
        const amountOfGaps = 44;
        const interval = Math.ceil(toBeGrouped.length / amountOfGaps);
        let grouped = [];

        for (let i = 0, groupNumber = 0; i < toBeGrouped.length; i++) {
            if (grouped.length <= groupNumber) {
                grouped.push([]);
            }
            grouped[groupNumber].push(toBeGrouped[i]);
            if (grouped[groupNumber].length === interval) groupNumber++;
        }

        return grouped;
    };

    const getColor = useCallback(
        (value) => {
            const amountOfGaps = 44;
            const interval = Math.ceil(sorted.length / amountOfGaps);

            let whichGap = 0;
            for (let i = 0; i < sorted.length; i += interval) {
                if (sorted[i].properties[parameter] < value) break;
                whichGap++;
            }

            return `hsl(0 100 ${(whichGap * 100) / amountOfGaps})`;
        },
        [sorted, parameter]
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

        const getRandomColor = () => {
            const colors = ["#123456", "#987654", "#262626", "#aa0000"];

            const randomInt = Math.floor(Math.random() * colors.length);

            return colors[randomInt];
        };

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

        // map.current.removeLayer(geoJsonLayer);
        geoJsonLayer.current?.remove();

        const pnoLayer = L.Proj.geoJson(mapLayer, {
            style: featureStyle,
            onEachFeature: function (feature, layer) {
                layer.bindPopup(
                    `
                  <h2>${feature.properties.postinumeroalue}</h2>
                  <p>${feature.properties.nimi}</p>
                  <p>${feature.properties[parameter]}</p>
                  `
                );

                /*                 layer.addEventListener("click", (e) => {
                    setMapLayer(pno_stat);
                    map.current.fitBounds(e.target.getBounds());
                }); */

                /*                 layer
                    .bindTooltip(
                        String(
                            getPropertyValue(feature.properties.nimi, parameter)
                        ),
                        {
                            permanent: true,
                            direction: "center",
                        }
                    )
                    .openTooltip(); */
            },
        }).addTo(map.current);



        legend.current.remove()

        legend.current.onAdd = () => {
            const div = L.DomUtil.create("div", "info legend flex flex-col bg-white/80 p-2 shadow-md rounded-md text-black");
            div.style.fontSize = 2;

            const grouped = group(sorted);

            div.innerHTML = grouped.map((a) =>
                `<p class="flex gap-2"><i style="width: 20px; height: 20px; float: left; background-color: ${getColor(a[0].properties[parameter])};"></i>${a[a.length - 1].properties[parameter]}&ndash;${a[0].properties[parameter]}</p>`
            ).join('');

            return div;
        };

        legend.current.addTo(map.current);

        const layerBounds = pnoLayer.getBounds();
        if (mapLayer == kunta_stat && !geoJsonLayer.current) {
            map.current.fitBounds(layerBounds); // Centers the map
        }
        map.current.setMaxBounds(layerBounds.pad(0.1)); // Block user pan the map out of view.

        geoJsonLayer.current = pnoLayer;
    }, [mapLayer, parameter, getColor, sorted]);

    return (
        <div ref={mapContainer} className="absolute h-full w-1/2 right-0"></div>
    );
};

export default Map;
