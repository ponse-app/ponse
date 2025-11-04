"use client";

import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import "leaflet/dist/leaflet.css";
import kunta_stat from "../../app/kunta_vaki2024.json";
//import pno_stat from "../../app/pno_tilasto.json";
import proj4 from "proj4";
import "proj4leaflet";
import { getColor, group, sortBy, createLegend } from "../../utlis/coloringTool";

import L from "leaflet";

const Map = ({ onUpdatePreviewBounds, parameter }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [mapLayer, setMapLayer] = useState(kunta_stat);
    const geoJsonLayer = useRef(null);

    const sorted = sortBy(kunta_stat.features, parameter);

    const grouped = group(sorted, parameter, 30);

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
                fillColor: getColor(
                    feature.properties[parameter],
                    grouped,
                    parameter
                ),
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
                    map.current?.fitBounds(e.target.getBounds(), {
                        animate: true,
                    });
                    onUpdatePreviewBounds(
                        e.target.getBounds(),
                        feature.properties.nimi,
                        feature
                    );
                });
            },
        }).addTo(map.current);

        // Add legend
        const legend = createLegend(parameter, grouped);
        legend.addTo(map.current);

        const layerBounds = pnoLayer.getBounds();
        if (mapLayer == kunta_stat && !geoJsonLayer.current) {
            map.current.fitBounds(layerBounds); // Centers the map
        }
        map.current.setMaxBounds(layerBounds.pad(0.1)); // Block user pan the map out of view.
        geoJsonLayer.current = pnoLayer;

        return () => {
            legend.remove();

            if (map.current == null) return;
            map.current?.eachLayer((layer) => {
                layer.off();
                map.current.removeLayer(layer);
            });
            /* map.current.remove();
            map.current = null;*/
            console.log("Map useEffect return");
        };
    }, [mapLayer, parameter, grouped, onUpdatePreviewBounds]);

    return (
        <div ref={mapContainer} className="absolute h-full w-1/2 right-0"></div>
    );
};

export default memo(Map);
