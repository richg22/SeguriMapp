import * as turf from "@turf/turf";
import { useEffect, useRef, useState } from "react";
import MapView, { Polygon, Region } from "react-native-maps";
import laFloridaGeoJSON from "../assets/geojson/laflorida.json";

export default function Mapa() {
  const mapRef = useRef<MapView | null>(null);

  // Coordenadas del polígono de La Florida
  const coordinates = laFloridaGeoJSON.features[0].geometry.coordinates[0].map(
    (coord: number[]) => ({
      latitude: coord[1],
      longitude: coord[0],
    })
  );

  // Polígono exterior para la máscara
  const outerPolygon = [
    { latitude: 90, longitude: -180 },
    { latitude: 90, longitude: 180 },
    { latitude: -90, longitude: 180 },
    { latitude: -90, longitude: -180 },
  ];

  // Bounding box y región inicial
  const bbox = turf.bbox(laFloridaGeoJSON);
  const LAT_MIN = bbox[1];
  const LAT_MAX = bbox[3];
  const LNG_MIN = bbox[0];
  const LNG_MAX = bbox[2];

  const initialRegion: Region = {
    latitude: (LAT_MIN + LAT_MAX) / 2,
    longitude: (LNG_MIN + LNG_MAX) / 2,
    latitudeDelta: (LAT_MAX - LAT_MIN) * 1.2,
    longitudeDelta: (LNG_MAX - LNG_MIN) * 1.2,
  };

  const [region, setRegion] = useState<Region>(initialRegion);

  // Ajustar región si se sale del polígono
  const clampRegionToPolygon = (newRegion: Region): Region => {
    const point = turf.point([newRegion.longitude, newRegion.latitude]);
    const polygon = turf.polygon(
      laFloridaGeoJSON.features[0].geometry.coordinates
    );

    if (turf.booleanPointInPolygon(point, polygon)) {
      // Dentro del polígono → aceptamos
      return newRegion;
    }

    // Buscar punto más cercano en el borde
    const line = turf.lineString(laFloridaGeoJSON.features[0].geometry.coordinates[0]);
    const nearest = turf.nearestPointOnLine(line, point);

    return {
      ...newRegion,
      latitude: nearest.geometry.coordinates[1],
      longitude: nearest.geometry.coordinates[0],
      latitudeDelta: Math.min(
        newRegion.latitudeDelta,
        (LAT_MAX - LAT_MIN) * 1.2
      ),
      longitudeDelta: Math.min(
        newRegion.longitudeDelta,
        (LNG_MAX - LNG_MIN) * 1.2
      ),
    };
  };

  const handleRegionChange = (newRegion: Region) => {
    const clampedRegion = clampRegionToPolygon(newRegion);
    setRegion(clampedRegion);

    if (
      clampedRegion.latitude !== newRegion.latitude ||
      clampedRegion.longitude !== newRegion.longitude
    ) {
      mapRef.current?.animateToRegion(clampedRegion, 200);
    }
  };

  useEffect(() => {
    mapRef.current?.animateToRegion(initialRegion, 0);
  }, []);

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={initialRegion}
      onRegionChangeComplete={handleRegionChange}
      minZoomLevel={12}
      maxZoomLevel={18}
    >
      {/* Máscara oscura para todo menos La Florida */}
      <Polygon
        coordinates={outerPolygon}
        holes={[coordinates]}
        fillColor="rgba(0,0,0,0.5)"
      />

      {/* Polígono de La Florida */}
      <Polygon
        coordinates={coordinates}
        strokeColor="green"
        fillColor="transparent"
        strokeWidth={2}
      />
    </MapView>
  );
}
