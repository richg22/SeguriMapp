// app/(tabs)/index.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopBar from "../../components/TopBar";
import { postJSON } from "../lib/api"; // desde (tabs) sube a app y entra a lib [../lib/api]

const GREEN = "#C7F1D1";
const TEXT = "#222";

export default function Index() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Estado formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onLogin() {
    setLoading(true);
    setError(null);
    try {
      if (!email || !password) throw new Error("Faltan email y/o contraseña");
      // Llamada centralizada: POST JSON con headers correctos según MDN [web:122]
      const user = await postJSON<{ id: number; name: string; email: string }>(
        "/api/login",
        { email, password }
      );
      Alert.alert("Bienvenido", user.name || "Sesión iniciada");
      router.push("/explore");
    } catch (e: any) {
      setError(e.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/background3.png")}
        style={styles.bg}
        resizeMode="cover"
        imageStyle={{ opacity: 0.35 }}
      >
        <TopBar />

        {/* CONTENIDO */}
        <View style={styles.overlay}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>SeguriMapp</Text>

          {/* Inputs */}
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#666"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#666"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {/* botón iniciar sesión */}
          <TouchableOpacity
            style={styles.button}
            onPress={onLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          {error ? (
            <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
          ) : null}

          {/* enlaces */}
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => router.push("/registro")}>
              <Text style={styles.link}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/rcontrasena")}>
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative" },
  bg: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 120,
    paddingHorizontal: 20,
  },
  logo: { width: 120, height: 120, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: TEXT, marginBottom: 20 },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: TEXT,
  },
  button: {
    backgroundColor: GREEN,
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { fontSize: 18, fontWeight: "bold", color: "#000" },
  linksContainer: {
    marginTop: 20,
    alignItems: "center",
    gap: 10,
  },
  link: {
    color: "#000000ff",
    textDecorationLine: "underline",
    fontSize: 17,
  },
});
