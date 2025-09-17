import { useState } from "react";
import MapView, { Polygon } from "react-native-maps";
import laFloridaGeoJSON from "../assets/geojson/laflorida.json";

export default function Mapa() {
  const coordinates = laFloridaGeoJSON.features[0].geometry.coordinates[0].map(
    (coord: number[]) => ({
      latitude: coord[1],
      longitude: coord[0],
    })
  );

  // Bounding box aproximado de La Florida
  const LAT_MIN = -33.58;
  const LAT_MAX = -33.47;
  const LNG_MIN = -70.63;
  const LNG_MAX = -70.50;

  const [region, setRegion] = useState({
    latitude: -33.52, // centro aproximado
    longitude: -70.55,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });

  const handleRegionChange = (newRegion: any) => {
    let lat = Math.max(Math.min(newRegion.latitude, LAT_MAX), LAT_MIN);
    let lng = Math.max(Math.min(newRegion.longitude, LNG_MAX), LNG_MIN);

    setRegion({
      ...newRegion,
      latitude: lat,
      longitude: lng,
    });
  };

  return (
    <MapView
      style={{ flex: 1 }}
      region={region}
      onRegionChangeComplete={handleRegionChange}
      minZoomLevel={12} // evita alejarse demasiado
      maxZoomLevel={18} // evita acercarse demasiado
    >
      <Polygon
        coordinates={coordinates}
        strokeColor="green"
        fillColor="transparent"
        strokeWidth={2}
      />
    </MapView>
  );
}
