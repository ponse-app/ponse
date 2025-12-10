"use client";

import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import "leaflet/dist/leaflet.css";
import kunta_stat from "../../app/kunta_vaki2024.json";
import proj4 from "proj4";
import "proj4leaflet";
import { getColor, group, sortBy, createLegend } from "../../utlis/coloringTool";
import { preProcessData } from "@/utlis/dataPreProcessor";

import L from "leaflet";
import { useTranslation } from "react-i18next";

const Map = ({ onUpdatePreviewBounds, parameter, lng }) => {

    const [t, i18n] = useTranslation();

    const mapContainer = useRef(null);
    const map = useRef(null);
    const geoJsonLayer = useRef(null);

    const [hoverValue, setHoverValue] = useState(null);
    const [[hoverLegendValueStart, hoverLegendValueEnd], setHoverLegendValue] = useState([]);
    const groupedRef = useRef(null);

    proj4.defs(
        "EPSG:3067",
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
    );

    useEffect(() => {
        const preProcessedData = {
            ...kunta_stat,
            features: preProcessData(kunta_stat.features, parameter),
        };

        const sorted = sortBy(preProcessedData.features, parameter);

        groupedRef.current = group(sorted, parameter, 30);

        if (map.current == null) {
            //console.log("Uusi pääkartta alustettu");
            map.current = L.map(mapContainer.current, { minZoom: 5, maxZoom: 10 });
        } // stops map from intializing more than once

        const featureStyle = (feature) => {
            return {
                fillColor: getColor(feature.properties[parameter], groupedRef.current, parameter),
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

        const pnoLayer = L.Proj.geoJson(preProcessedData, {
            style: featureStyle,
            onEachFeature: function (feature, layer) {
                layer.addEventListener("click", (e) => {
                    map.current?.fitBounds(e.target.getBounds(), {
                        animate: true,
                    });
                    onUpdatePreviewBounds(e.target.getBounds(), feature.properties.nimi, feature);
                });
                layer.addEventListener("mouseover", (e) => {
                    info.update(feature);
                });
                layer.addEventListener("mouseout", (e) => {
                    info.update();
                });
            },
        }).addTo(map.current);

        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create(
                "div",
                "box bg-white/80 shadow-black text-black rounded-md p-2 border-radius 5px"
            );
            this.update();
            return this._div;
        };

        info.update = function (feature) {
            this._div.innerHTML =
                '<h4 style="color:blue;text-align:center;">' +
                t("map.municipalityText") +
                " </h4>" +
                (feature
                    ? '<b style="align-items:center">' +
                      feature.properties.nimi +
                      "</b>" +
                      "<p></p>" +
                      feature.properties[parameter]
                    : t("map.hoverInfo"));

            setHoverValue(feature?.properties[parameter]);
        };

        info.addTo(map.current);

        const collator = new Intl.Collator("fi", { sensitivity: "base" });

        let search = L.control({ position: "topleft" });

        search.onAdd = function () {
            this._div_search = L.DomUtil.create(
                "input",
                "box bg-white/80 shadow-black text-black rounded-md p-2 border-radius 5px"
            );
            this._div_search.placeholder = t("map.search");
            this._div_search.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    console.log(map.current);
                    e.preventDefault();
                    map.current.eachLayer((layer) => {
                        if (
                            collator.compare(
                                layer.feature?.properties.nimi.trim(),
                                e.target.value.trim()
                            ) == 0
                        ) {
                            map.current.fitBounds(layer.getBounds(), {
                                animate: true,
                            });
                            onUpdatePreviewBounds(
                                layer.getBounds(),
                                layer.feature?.properties.nimi,
                                layer.feature
                            );
                        } else {
                            e.target.style.backgroundColor = "#EE4B2B";
                        }
                    });
                }
            });
            this._div_search.addEventListener("input", (e) => {
                e.target.style.backgroundColor = "";
            });
            return this._div_search;
        };

        search.addTo(map.current);

        const layerBounds = pnoLayer.getBounds();
        if (!geoJsonLayer.current) {
            map.current.fitBounds(layerBounds); // Centers the map
        }
        map.current.setMaxBounds(layerBounds.pad(0.1)); // Block user pan the map out of view.
        geoJsonLayer.current = pnoLayer;

        return () => {
            info.remove();
            search.remove();

            if (map.current == null) return;
            map.current?.eachLayer((layer) => {
                layer.off();
                map.current.removeLayer(layer);
            });
        };
    }, [parameter, onUpdatePreviewBounds, t]);

    useEffect(() => {
        // Add legend
        const legend = createLegend(
            parameter,
            groupedRef.current,
            hoverValue,
            "large",
            t("coloringTool.noData"),
            setHoverLegendValue
        );
        legend.addTo(map.current);

        return () => {
            legend.remove();
        };
    }, [hoverValue, parameter, t]);

    useEffect(() => {
        map.current.eachLayer((layer) => {
            if (
                layer.feature?.properties[parameter] >= hoverLegendValueStart &&
                layer.feature?.properties[parameter] <= hoverLegendValueEnd
            ) {
                layer.setStyle({
                    fillColor: "#0000FF",
                    weight: 1.5,
                    opacity: 1,
                    color: "white",
                    dashArray: "3",
                    fillOpacity: 1,
                });
            } else {
                if (layer.setStyle && typeof layer.feature !== 'undefined') {
                    
                    layer.setStyle({
                        fillColor: getColor(
                            layer.feature?.properties[parameter],
                            groupedRef.current,
                            parameter
                        ),
                        weight: 1.5,
                        opacity: 1,
                        color: "white",
                        dashArray: "3",
                        fillOpacity: 1,
                    });
                }
            }
        });
    });

    return (
        <div
            ref={mapContainer}
            className="lg:absolute relative block min-h-[50vh] mb-10 lg:mb-0 lg:h-full lg:w-1/2 w-full right-0"
        ></div>
    );
};

export default memo(Map);
