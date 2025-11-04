"use client";

import React, { useRef, useEffect, useState, useImperativeHandle, memo } from "react";
import "leaflet/dist/leaflet.css";
import pno_stat from "../../app/pno_tilasto.json";
import kunta_stat from "../../app/kunta_vaki2024.json";
import proj4 from "proj4";
import "proj4leaflet";
import { getColor, group, sortBy, createLegend } from "@/utlis/coloringTool";

import L from "leaflet";

const PreviewMap = ({ preview, previewFeature, kuntaName, position, handlePreviewSelection, isSelectedPreview, parameter }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    proj4.defs(
        "EPSG:3067",
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
    );

    useEffect(() => {
        if (map.current == null) {
            map.current = L.map(mapContainer.current, {
                /* zoomControl: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                zoom: false,
                dragging: false, */
            });
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

        // Tässä etsitään kunnan postinumeroalueita
        let postnumbers = [];
        for (const pno of pno_stat.features) {
            if (pno.properties.kunta == previewFeature.properties.kunta) {
                postnumbers.push(pno);
                //console.log(pno);
            }
        }
        var collection = {
            features: postnumbers,
            type: 'FeatureCollection',
            "crs": {
                "type": "name",
                "properties": {
                    "name": "urn:ogc:def:crs:EPSG::3067"
                }
            },
        };
        
        const equivalencyTable = {
            "miehet": "he_miehet",
            "naiset": "he_naiset",
        }

        const equivalentParameter = equivalencyTable[parameter];

        const sorted = sortBy(postnumbers, equivalentParameter);

        const grouped = group(sorted, equivalentParameter, Math.min(sorted.length, 10));
        
        const featureStyle = (feature) => {
            return {
                fillColor: getColor(feature.properties[equivalentParameter], grouped, equivalentParameter),
                weight: 1.5,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity: 1,
            };
        };

        const pnoLayer = L.Proj.geoJson(
            collection, {
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
                })
            },
        }).addTo(map.current);
        console.log("collection: ", collection);
        console.log("bounds: ", pnoLayer.getBounds());
        map.current.fitBounds(pnoLayer.getBounds(), {
            animate: false,
        });
        map.current.setMaxBounds(pnoLayer.getBounds().pad(0.3));
        /* setTimeout(() => {
            map.current.setMaxBounds(pnoLayer.getBounds().pad(0.1));
        }, 100); */

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
        const legend = createLegend(equivalencyTable[parameter], grouped);
        legend.addTo(map.current);

        var overlays = {
            "kunnat": kuntaLayer
        }
        //const layerControl = L.control.layers({}, overlays).addTo(map.current);


        return () => {
            legend.remove();
            
            if (map.current == null) return;
            //layerControl.remove();
            map.current?.eachLayer((layer) => {
                layer.off();
                map.current.removeLayer(layer);
            });/* 
        map.current.remove();
        map.current = null; */
            console.log("PreviewMap useEffect return");
        }

    }, [previewFeature, preview, parameter]); // Block user pan the map out of view.

    const styles = {
        visibility: preview ? 'visible' : 'hidden',
        left: 0,
        right: "",
    }

    if (position == 1) {
        styles.left = "";
        styles.right = 0;
    }

    const selectedStyle = {
        color: isSelectedPreview ? "yellow" : "red",
    }


    return (
        <div className="absolute bottom-0"
            style={styles}>
            <p className="text-center"
                style={selectedStyle}
                onClick={(e) => {
                    handlePreviewSelection(position)
                }}
            >{kuntaName}</p>
            <div ref={mapContainer} className="h-[25vh] w-[25vw]"
            ></div>
        </div>
    );
};

export default memo(PreviewMap);
