"use client";

import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import pno_stat from "../../app/kunta_vaki2024.json";
import proj4 from "proj4";
import "proj4leaflet";

import L from "leaflet";

const Map = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const center = { lng: 13.338414, lat: 52.507932 };
    const [zoom] = useState(12);

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once

        // Toimiva esimerrki:
        //map.current = L.map(mapContainer.current).setView([51.505, -0.09], 13);
        /* L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',

        }).addTo(map.current); */

        map.current = L.map(mapContainer.current, { minZoom: 5 }).setView(
            [65, 20],
            5
        );

        // var wmsLayer = L.tileLayer
        //     .wms("http://ows.mundialis.de/services/service?", {
        //         layers: "TOPO-OSM-WMS",
        //     })
        //     .addTo(map.current);

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

        const pnoLayer = L.Proj.geoJson(pno_stat, {
            style: featureStyle,
            onEachFeature: function (feature, layer) {
                layer.bindPopup(
                    `
                  <h2>${feature.properties.postinumeroalue}</h2>
                  <p>${feature.properties.nimi}</p>
                  `
                );
            },
        }).addTo(map.current);

        const layerBounds = pnoLayer.getBounds();
        map.current.fitBounds(layerBounds); // Centers the map
        map.current.setMaxBounds(layerBounds); // Block user pan the map out of view. // TODO: make bounds wider here, because now this is maybe too much restricting

        return () => {
            map.current = null;
        };
    }, []);

    return (
        <div
            ref={mapContainer}
            style={{ height: "100dvh", width: "50vw" }}
        ></div>
    );
};

export default Map;
