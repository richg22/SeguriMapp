import React from "react";
import { StyleSheet, View } from "react-native";
import Mapa from "../../components/Mapa";

export default function Explore() {
  return (
    <View style={styles.container}>
      <Mapa />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});