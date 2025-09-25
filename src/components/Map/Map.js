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
        /* map.current = L.map(mapContainer.current).setView([51.505, -0.09], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }).addTo(map.current); */

        map.current = L.map(mapContainer.current).setView([65, 20], 5);

        // var wmsLayer = L.tileLayer
        //     .wms("http://ows.mundialis.de/services/service?", {
        //         layers: "TOPO-OSM-WMS",
        //     })
        //     .addTo(map.current);

        const myStyle = {
            color: "#ff7800",
            weight: 2,
            opacity: 0.65,
        };

        proj4.defs(
            "EPSG:3067",
            "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
        );

        const pnoLayer = L.Proj.geoJson(pno_stat, {
            style: myStyle,
            onEachFeature: function (feature, layer) {
                layer.bindPopup(
                    `
                  <h2>${feature.properties.postinumeroalue}</h2>
                  <p>${feature.properties.nimi}</p>
                  `
                );
            },
        }).addTo(map.current);

        map.current.fitBounds(pnoLayer.getBounds()); // Centers the map

        return () => {
            map.current = null;
        };
    }, []);

    return (
        <div
            ref={mapContainer}
            style={{ height: "100vh", width: "50vw" }}
        ></div>
    );
};

export default Map;
