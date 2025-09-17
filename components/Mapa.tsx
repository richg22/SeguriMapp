// components/Mapa.tsx
import * as turf from "@turf/turf";
import { useMemo, useRef } from "react";
import MapView, { Polygon, PROVIDER_GOOGLE, Region } from "react-native-maps";
import laFloridaGeoJSON from "../assets/geojson/laflorida.json";

// 👉 Estilo: oculta íconos y POIs, pero deja textos de calles visibles
const MAP_STYLE = [
  // Oculta TODOS los íconos (mantiene labels de texto)
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },

  // Quita POIs (negocios, parques, colegios, etc.)
  { featureType: "poi", stylers: [{ visibility: "off" }] },

  // Quita transporte (estaciones/líneas)
  { featureType: "transit", stylers: [{ visibility: "off" }] },

  // (Opcional) menos ruido en “administrative” (barrios/limites)
  // { featureType: "administrative", elementType: "labels", stylers: [{ visibility: "off" }] },
];

export default function Mapa() {
  const mapRef = useRef<MapView | null>(null);

  const {
    outlineCoords,
    holesCoords,
    initialRegion,
    boundsNE,
    boundsSW,
  } = useMemo(() => {
    const geom: any = (laFloridaGeoJSON as any).features[0].geometry;

    const rings: number[][][] =
      geom.type === "MultiPolygon"
        ? geom.coordinates.map((poly: number[][][]) => poly[0])
        : [geom.coordinates[0]];

    const outlineCoords = rings[0].map(([lng, lat]: number[]) => ({
      latitude: lat,
      longitude: lng,
    }));

    const holesCoords = rings.map((ring: number[][]) =>
      ring.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
    );

    const poly = turf.polygon([rings[0]]);
    const [minLng, minLat, maxLng, maxLat] = turf.bbox(poly) as [
      number,
      number,
      number,
      number
    ];

    const PAD = 0.002;
    const SHRINK = 0.75;

    const swPad = { latitude: minLat - PAD, longitude: minLng - PAD };
    const nePad = { latitude: maxLat + PAD, longitude: maxLng + PAD };

    const cLat = (swPad.latitude + nePad.latitude) / 2;
    const cLng = (swPad.longitude + nePad.longitude) / 2;
    const halfLat = ((nePad.latitude - swPad.latitude) / 2) * SHRINK;
    const halfLng = ((nePad.longitude - swPad.longitude) / 2) * SHRINK;

    const boundsSW = { latitude: cLat - halfLat, longitude: cLng - halfLng };
    const boundsNE = { latitude: cLat + halfLat, longitude: cLng + halfLng };

    const center = turf.centerOfMass(poly).geometry.coordinates as [number, number];
    const centerLat = Number.isFinite(center[1]) ? center[1] : -33.533;
    const centerLng = Number.isFinite(center[0]) ? center[0] : -70.566;

    const initialRegion: Region = {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: (boundsNE.latitude - boundsSW.latitude) * 0.9,
      longitudeDelta: (boundsNE.longitude - boundsSW.longitude) * 0.9,
    };

    return { outlineCoords, holesCoords, initialRegion, boundsNE, boundsSW };
  }, []);

  const onMapReady = () => {
    if (!mapRef.current) return;
    mapRef.current.setMapBoundaries(boundsNE, boundsSW);
    mapRef.current.animateToRegion(initialRegion, 0);
  };

  // (Si quieres volver a activar la máscara gris fuera de La Florida, descomenta esto)
  // const WORLD = [
  //   { latitude: 85, longitude: -180 },
  //   { latitude: 85, longitude: 180 },
  //   { latitude: -85, longitude: 180 },
  //   { latitude: -85, longitude: -180 },
  // ];

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion}
      onMapReady={onMapReady}
      minZoomLevel={13}
      maxZoomLevel={17}
      rotateEnabled={false}
      pitchEnabled={false}
      // 👇 aplica el estilo para ocultar íconos
      customMapStyle={MAP_STYLE as any}
    >
      {/* Máscara gris fuera de La Florida (opcional)
      <Polygon
        coordinates={WORLD}
        holes={holesCoords}
        fillColor="rgba(210,210,210,0.55)"
        strokeWidth={0}
        tappable={false}
        zIndex={1000}
      /> */}

      <Polygon
        coordinates={outlineCoords}
        strokeColor="green"
        fillColor="transparent"
        strokeWidth={2}
        zIndex={1}
      />
    </MapView>
  );
}
