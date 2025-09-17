import React from "react";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import { StyleSheet, View } from "react-native";

export default function Mapa() {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT} // usa OpenStreetMap
        style={styles.map}
        initialRegion={{
          latitude: -33.52,       // centro de La Florida
          longitude: -70.56,
          latitudeDelta: 0.05,    // nivel de zoom vertical
          longitudeDelta: 0.05,   // nivel de zoom horizontal
        }}
        minZoomLevel={12} // evita alejarse demasiado
        maxZoomLevel={18} // evita acercarse demasiado
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});