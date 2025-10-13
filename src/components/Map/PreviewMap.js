"use client";

import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import kunta_stat from "../../app/kunta_vaki2024.json";
import pno_stat from "../../app/pno_tilasto.json";
import proj4 from "proj4";
import "proj4leaflet";

import L from "leaflet";

const PreviewMap = ({ preview1 }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [center, setCenter] = useState({ lng: 13.338414, lat: 52.507932 });
    const [zoom] = useState(12);
    const [mapLayer, setMapLayer] = useState(kunta_stat);
    const [bounds, setBounds] = useState(null);
    console.log(preview1);

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
                /* fillColor: getColor(feature.properties[parameter]), */
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
            },
        }).addTo(map.current);

        const layerBounds = pnoLayer.getBounds();
        if (preview1 != null) {
            map.current.fitBounds(preview1);
        }
        map.current.setMaxBounds(layerBounds.pad(0.1)); // Block user pan the map out of view.
    }, [mapLayer, preview1]);
    if (preview1 == null) {
       return (
        <div ref={mapContainer} className="invisible"></div>
        );
    };
    return (
        <div ref={mapContainer} className="absolute h-1/4 w-1/2 left-0 bottom-0"></div>
    );
};

export default PreviewMap;
