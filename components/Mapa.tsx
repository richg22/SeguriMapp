// components/Mapa.tsx
import * as turf from "@turf/turf";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import MapView, { LatLng, Polygon, PROVIDER_GOOGLE, Region } from "react-native-maps";
import laFloridaGeoJSON from "../assets/geojson/laflorida.json";

export type MapaApi = { recenter: () => void };

// Oculta íconos/POIs pero deja nombres de calles
const MAP_STYLE = [
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

// márgenes extra (
const EXTRA_WEST_DEG = 0.03;   // espacio extra hacia la IZQUIERDA (oeste)
const EXTRA_SOUTH_DEG = 0.03;  // espacio extra hacia ABAJO (sur)
const PAD = 0.002;
const SHRINK = 0.75;

export default function Mapa({ onApiReady }: { onApiReady?: (api: MapaApi) => void }) {
  const mapRef = useRef<MapView | null>(null);

  const { outlineCoords, holesCoords, initialRegion, boundsNE, boundsSW } = useMemo(() => {
    // Asegura orientación RFC7946 (exterior CCW, interiores CW)
    const rewound = turf.rewind(laFloridaGeoJSON as any, { reverse: true }) as any;
    const geom = rewound.features[0].geometry;

    // Soporta Polygon y MultiPolygon → tomamos exteriores
    const rings: number[][][] =
      geom.type === "MultiPolygon"
        ? geom.coordinates.map((poly: number[][][]) => poly[0])
        : [geom.coordinates[0]];

    const toLatLng = ([lng, lat]: number[]): LatLng => ({ latitude: lat, longitude: lng });
    const ensureClosed = (ring: LatLng[]) => {
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (!first || !last) return ring;
      if (first.latitude !== last.latitude || first.longitude !== last.longitude) {
        return [...ring, first];
      }
      return ring;
    };

    // Contorno visible (primer anillo)
    const outlineCoords: LatLng[] = ensureClosed(rings[0].map(toLatLng));
    // Agujeros para máscara (si usaras máscara)
    const holesCoords: LatLng[][] = rings.map((r) => ensureClosed(r.map(toLatLng)));

    // Bounding y región inicial
    const poly = turf.polygon([rings[0]]);
    const [minLng, minLat, maxLng, maxLat] = turf.bbox(poly) as [number, number, number, number];

    // padding simétrico base
    const swPad = { latitude: minLat - PAD, longitude: minLng - PAD };
    const nePad = { latitude: maxLat + PAD, longitude: maxLng + PAD };

    // centro y “encogido” (para que el paneo no llegue justo al borde)
    const cLat = (swPad.latitude + nePad.latitude) / 2;
    const cLng = (swPad.longitude + nePad.longitude) / 2;
    const halfLat = ((nePad.latitude - swPad.latitude) / 2) * SHRINK;
    const halfLng = ((nePad.longitude - swPad.longitude) / 2) * SHRINK;

    // límites base
    let boundsSW = { latitude: cLat - halfLat, longitude: cLng - halfLng };
    let boundsNE = { latitude: cLat + halfLat, longitude: cLng + halfLng };

    // 👉 Extiende SOLO al OESTE (izquierda)
    boundsSW = { ...boundsSW, longitude: boundsSW.longitude - EXTRA_WEST_DEG };
    // 👉 Extiende SOLO al SUR (abajo) ⇒ latitudes más negativas
    boundsSW = { ...boundsSW, latitude: boundsSW.latitude - EXTRA_SOUTH_DEG };

    // región inicial (compensa un poco la vista hacia izquierda/abajo)
    const center = turf.centerOfMass(poly).geometry.coordinates as [number, number];
    const initialRegion: Region = {
      latitude: center[1] - EXTRA_SOUTH_DEG * 0.35,
      longitude: center[0] - EXTRA_WEST_DEG * 0.35,
      latitudeDelta: (boundsNE.latitude - boundsSW.latitude) * 0.9,
      longitudeDelta: (boundsNE.longitude - boundsSW.longitude) * 0.9,
    };

    return { outlineCoords, holesCoords, initialRegion, boundsNE, boundsSW };
  }, []);

  // API pública para el HUD
  const recenter = useCallback(() => {
    mapRef.current?.animateToRegion(initialRegion, 250);
  }, [initialRegion]);

  useEffect(() => {
    onApiReady?.({ recenter });
  }, [onApiReady, recenter]);

  // Limitar desplazamiento y centrar al estar listo
  const onMapReady = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.setMapBoundaries(boundsNE, boundsSW);
    mapRef.current.animateToRegion(initialRegion, 0);
  }, [boundsNE, boundsSW, initialRegion]);

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
      customMapStyle={MAP_STYLE as any}
    >
      {/* Solo contorno de La Florida */}
      <Polygon
        coordinates={outlineCoords}
        strokeColor="rgba(53,53,53,1)"
        fillColor="transparent"
        strokeWidth={2}
        zIndex={1}
      />
    </MapView>
  );
}
