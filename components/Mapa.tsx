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

export default function Mapa({ onApiReady }: { onApiReady?: (api: MapaApi) => void }) {
  const mapRef = useRef<MapView | null>(null);

  const { outlineCoords, holesCoords, initialRegion, boundsNE, boundsSW } = useMemo(() => {
    // Asegura orientación RFC7946 (exterior CCW, interiores CW)
    const rewound = turf.rewind(laFloridaGeoJSON as any, { reverse: true }) as any;
    const geom = rewound.features[0].geometry;

    // Soporta Polygon y MultiPolygon (tomamos exteriores)
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
    // Agujeros para máscara (todos los exteriores si hubiese múltiples polígonos)
    const holesCoords: LatLng[][] = rings.map((r) => ensureClosed(r.map(toLatLng)));  

    // Bounding y región inicial
    const poly = turf.polygon([rings[0]]);
    const [minLng, minLat, maxLng, maxLat] = turf.bbox(poly) as [number, number, number, number];

    const PAD = 0.002;  // pequeño margen
    const SHRINK = 0.75; // reduce área de desplazamiento

    const swPad = { latitude: minLat - PAD, longitude: minLng - PAD };
    const nePad = { latitude: maxLat + PAD, longitude: maxLng + PAD };

    const cLat = (swPad.latitude + nePad.latitude) / 2;
    const cLng = (swPad.longitude + nePad.longitude) / 2;
    const halfLat = ((nePad.latitude - swPad.latitude) / 2) * SHRINK;
    const halfLng = ((nePad.longitude - swPad.longitude) / 2) * SHRINK;

    const boundsSW = { latitude: cLat - halfLat, longitude: cLng - halfLng };
    const boundsNE = { latitude: cLat + halfLat, longitude: cLng + halfLng };

    const center = turf.centerOfMass(poly).geometry.coordinates as [number, number];
    const initialRegion: Region = {
      latitude: center[1],
      longitude: center[0],
      latitudeDelta: (boundsNE.latitude - boundsSW.latitude) * 0.9,
      longitudeDelta: (boundsNE.longitude - boundsSW.longitude) * 0.9,
    };

    return { outlineCoords, holesCoords, initialRegion, boundsNE, boundsSW };
  }, []);

  // Método público para el HUD
  const recenter = useCallback(() => {
    mapRef.current?.animateToRegion(initialRegion, 250);
  }, [initialRegion]);

  // Entrega el API al padre (main.tsx)
  useEffect(() => {
    onApiReady?.({ recenter });
  }, [onApiReady, recenter]);

  // Limitar desplazamiento y centrar al estar listo
  const onMapReady = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.setMapBoundaries(boundsNE, boundsSW);
    mapRef.current.animateToRegion(initialRegion, 0);
  }, [boundsNE, boundsSW, initialRegion]);

  // Polígono mundial CERRADO: necesario para que los "holes" funcionen
  const WORLD: LatLng[] = useMemo(
    () => [
      { latitude: 85, longitude: -180 },
      { latitude: 85, longitude: 180 },
      { latitude: -85, longitude: 180 },
      { latitude: -85, longitude: -180 },
      { latitude: 85, longitude: -180 }, // cierre
    ],
    []
  );

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
      {/* MÁSCARA: pinta TODO lo externo a La Florida */}
      <Polygon
        coordinates={WORLD}
        holes={holesCoords}                 // La(s) geometría(s) de La Florida como “agujero(s)”
        fillColor="transparent"    // color/opacity de lo externo
        strokeWidth={0}
        tappable={false}
        zIndex={0}
      />

      {/* CONTORNO de La Florida */}
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