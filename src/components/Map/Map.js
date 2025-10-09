"use client";

import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import kunta_stat from "../../app/kunta_vaki2024.json";
import pno_stat from "../../app/pno_tilasto.json";
import proj4 from "proj4";
import "proj4leaflet";

import L from "leaflet";

const Map = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [center, setCenter] = useState({ lng: 13.338414, lat: 52.507932 });
    const [zoom] = useState(12);
    const [mapLayer, setMapLayer] = useState(kunta_stat);
    const [bounds, setBounds] = useState(null);

    useEffect(() => {

        if (map.current == null) {
            map.current = L.map(mapContainer.current, { minZoom: 5 });
        }  // stops map from intializing more than once

    }, [])



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
                fillColor: getRandomColor(),
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

        const pnoLayer = L.Proj.geoJson(mapLayer, {
            style: featureStyle,
            onEachFeature: function (feature, layer) {
                /* layer.bindPopup(
                    `
                  <h2>${feature.properties.postinumeroalue}</h2>
                  <p>${feature.properties.nimi}</p>
                  `
                ); */
                layer.addEventListener("click", (e) => {
                    setMapLayer(pno_stat);
                    map.current.fitBounds(e.target.getBounds());
                })
            },
        }).addTo(map.current);

        const layerBounds = pnoLayer.getBounds();
        if (mapLayer == kunta_stat) {
            map.current.fitBounds(layerBounds); // Centers the map 
        }
        map.current.setMaxBounds(layerBounds.pad(0.1)); // Block user pan the map out of view.

    }, [mapLayer]);

    return (
        <div ref={mapContainer} className="absolute h-full w-1/2 right-0"></div>
    );
};

export default Map;
