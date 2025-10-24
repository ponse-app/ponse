"use client";

import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import "leaflet/dist/leaflet.css";
import pno_stat from "../../app/pno_tilasto.json";
import kunta_stat from "../../app/kunta_vaki2024.json";
import proj4 from "proj4";
import "proj4leaflet";

import L from "leaflet";

const PreviewMap = ({ preview }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);


    proj4.defs(
        "EPSG:3067",
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
    );

    useEffect(() => {
        if (map.current == null) {
            map.current = L.map(mapContainer.current, {
                zoomControl: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                zoom: false,
                dragging: false,
            });
        } // stops map from intializing more than once
    }, []);

    const featureStyle = useRef(null);
    const pnoLayer = useRef(null);
    const layerBounds = useRef(null);
    const [selectedPno, SetSelectedPno] = useState(null);
    const hoveredPno = useRef(null);
    useEffect(() => {
        if (map.current == null) return;

        featureStyle.current = (feature) => {
            // console.log(feature.properties.vaesto); // Just for demonstrating purposes. This is how you can access to the properties and calculate the right color for that feature
            return {
                /* fillColor: getColor(feature.properties[parameter]), */
                fillColor: "#000000",
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


        pnoLayer.current = L.Proj.geoJson(pno_stat, {
            style: featureStyle.current,
            onEachFeature: function (feature, layer) {
                layer.addEventListener("mouseover", (e) => {
                    console.log("New postnumber", layer);
                    if (hoveredPno.current != layer) {

                        if (hoveredPno.current != null) {
                            hoveredPno.current.setStyle(featureStyle.current());
                        }
                        hoveredPno.current = layer;
                        layer.setStyle({
                            fillColor: "#222222",
                            weight: 2,
                            opacity: 1,
                            color: "yellow",
                            dashArray: "3",
                            fillOpacity: 1,
                        });
                    }
                });
            },
        }).addTo(map.current);
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

        var overlays = {
            "kunnat": kuntaLayer
        }
        const layerControl = L.control.layers({}, overlays).addTo(map.current);


        layerBounds.current = pnoLayer.current.getBounds();

        return () => {
            if (map.current == null) return;
            layerControl.remove();
            map.current?.eachLayer((layer) => {
                layer.off();
                map.current.removeLayer(layer);
            });
        }

    }, []);

    if (preview) {
        map.current?.fitBounds(preview, { animate: false });
    }
    map.current?.setMaxBounds(layerBounds.current?.pad(0.1)); // Block user pan the map out of view.

    const styles = {
        visibility: preview ? 'visible' : 'hidden',
    }
    
    return (
        <div ref={mapContainer} className="absolute h-[25vh] w-[25vw] left-0 bottom-0"
        style={
            {...styles}
        }></div>
    );
};

export default PreviewMap;
