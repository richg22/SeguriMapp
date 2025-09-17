// app/(tabs)/main.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Mapa, { MapaApi } from "../../components/Mapa";

export default function Main() {
  const router = useRouter();
  const mapaApiRef = useRef<MapaApi | null>(null);

  return (
    <View style={styles.container}>
      {/* Mapa */}
      <Mapa onApiReady={(api) => (mapaApiRef.current = api)} />

      {/* HUD superpuesto */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Top bar */}
        <SafeAreaView pointerEvents="box-none">
          <View style={styles.topBar}>
            <Text style={styles.brand}>SeguriMapp</Text>
            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => mapaApiRef.current?.recenter()}
              >
                <Ionicons name="home" size={20} color="#111" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {/* FABs (abajo derecha) */}
        <View style={styles.fabs} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.fabPrimary}
            onPress={() => router.push("/")}
          >
            <Ionicons name="alert-circle" size={22} color="#111" />
            <Text style={styles.fabText}>Reportar</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.fab}
            onPress={() => mapaApiRef.current?.recenter()}
          >
            <Ionicons name="locate" size={20} color="#111" />
          </TouchableOpacity> */}
        </View>

         {/* HUD: leyenda abajo-izquierda */}
          <View pointerEvents="none" style={styles.legendBox}>
            <View style={styles.legendRow}>
              <View style={styles.legendLine} />
              <Text style={styles.legendText}>Límite de la comuna</Text>
            </View>
          </View>
        </View>


      </View>
    


  );
}

const CARD_BG = "rgba(255,255,255,0.92)";
const SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
};
const STROKE = "rgba(53,53,53,1)";
const styles = StyleSheet.create({
  container: { flex: 1 },

  topBar: {
    marginTop: 8,
    marginHorizontal: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: CARD_BG,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...SHADOW,
  },
  brand: { fontSize: 16, fontWeight: "700", color: "#111" },
  topActions: { flexDirection: "row", gap: 8 },
  iconBtn: { backgroundColor: "#eee", padding: 8, borderRadius: 10 },

  fabs: {
    position: "absolute",
    right: 12,
    bottom: 24,
    alignItems: "flex-end",
    gap: 10,
  },
  fabPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#C7F1D1",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    ...SHADOW,
  },
  fabText: { fontSize: 15, fontWeight: "700", color: "#111" },
  fab: { backgroundColor: CARD_BG, padding: 12, borderRadius: 999, ...SHADOW },

  legend: {
    position: "absolute",
    left: 12,
    bottom: 24,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    marginBottom: 30,
    padding: 10,
    gap: 8,
    ...SHADOW,
  },
   legendBox: {
    position: "absolute",
    left: 12,
    bottom: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 10,

    // sombra (iOS/Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendLine: {
    width: 28,
    height: 3,
    backgroundColor: STROKE,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: "#000000ff",
  },
});
