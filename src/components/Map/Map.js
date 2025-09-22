'use client';

import React, { useRef, useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";

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

    map.current = L.map(mapContainer.current).setView([51.505, -0.09], 5);
    var wmsLayer = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
      layers: 'TOPO-OSM-WMS'
    }).addTo(map.current);

    return () => {
      map.current = null;
    };
  }, []);

    

  return (
    <div ref={mapContainer}
    style={{height: '180px', width: '50vw'}}>
    </div>
  )
}

export default Map;