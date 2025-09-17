// components/Mapa.tsx
import * as turf from "@turf/turf";
import { useMemo, useRef } from "react";
import MapView, { Polygon, PROVIDER_GOOGLE, Region } from "react-native-maps";
import laFloridaGeoJSON from "../assets/geojson/laflorida.json";

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

    // Tomar anillos exteriores (soporta Polygon y MultiPolygon)
    const rings: number[][][] =
      geom.type === "MultiPolygon"
        ? geom.coordinates.map((poly: number[][][]) => poly[0]) // exterior de cada polígono
        : [geom.coordinates[0]]; // exterior único

    // Para el contorno verde usamos el primer anillo exterior
    const outlineCoords = rings[0].map(([lng, lat]: number[]) => ({
      latitude: lat,
      longitude: lng,
    }));

    // Para los "holes" usamos todos los exteriores (si hubiera más de uno)
    const holesCoords = rings.map((ring: number[][]) =>
      ring.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
    );

    // Bounding box y límites reducidos
    const poly = turf.polygon([rings[0]]);
    const [minLng, minLat, maxLng, maxLat] = turf.bbox(poly) as [
      number,
      number,
      number,
      number
    ];

    const PAD = 0.002;   // margen extra (grados)
    const SHRINK = 0.75; // encoge el rectángulo hacia el centro

    // Expandimos un pelo y luego lo encogemos hacia el centro
    const swPad = { latitude: minLat - PAD, longitude: minLng - PAD };
    const nePad = { latitude: maxLat + PAD, longitude: maxLng + PAD };

    const cLat = (swPad.latitude + nePad.latitude) / 2;
    const cLng = (swPad.longitude + nePad.longitude) / 2;
    const halfLat = ((nePad.latitude - swPad.latitude) / 2) * SHRINK;
    const halfLng = ((nePad.longitude - swPad.longitude) / 2) * SHRINK;

    const boundsSW = { latitude: cLat - halfLat, longitude: cLng - halfLng };
    const boundsNE = { latitude: cLat + halfLat, longitude: cLng + halfLng };

    // Región inicial centrada y más cerrada
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
    // Limita el desplazamiento al rectángulo elegido
    mapRef.current.setMapBoundaries(boundsNE, boundsSW);
    mapRef.current.animateToRegion(initialRegion, 0);
  };

  // Polígono enorme que cubre el mundo
const WORLD = [
  { latitude: 85,  longitude: -180 },
  { latitude: 85,  longitude:  180 },
  { latitude: -85, longitude:  180 },
  { latitude: -85, longitude: -180 },
];

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion}
      onMapReady={onMapReady}
      // Control de zoom
      minZoomLevel={13}
      maxZoomLevel={17}
      // Opcionales
      rotateEnabled={false}
      pitchEnabled={false}
    >
     {/* <Polygon
      // Rellena TODO el mapa...
      coordinates={WORLD}
      // ...excepto el/los agujero(s) que corresponde(n) a La Florida
      holes={holesCoords}          // si tu "holesCoords" es LatLng[][]
      fillColor="rgba(210,210,210,0.55)"  // gris claro semitransparente
      strokeWidth={0}
      tappable={false}
      zIndex={1000}
    /> */}

      {/* CONTORNO de La Florida */}
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
