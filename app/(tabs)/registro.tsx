// app/(tabs)/registro.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import TopBar from "../../components/TopBar";
import { BASE_URL } from "../lib/ipconfig";

const TEXT = "#222";
const BORDER = "#D9D9D9";
const INPUT_BG = "#fff";
const GREEN = "#C7F1D1";

export default function Registro() {
  const router = useRouter();

  // Estados de formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setLoading(true);
    setError(null);
    try {
      // Validaciones rápidas en cliente (el servidor también valida)
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("Faltan campos requeridos");
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        throw new Error("Email inválido");
      }
      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }
      if (password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
      }

      // Llamada al backend con Fetch POST + JSON (patrón correcto) [3][2]
      const res = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        // Muestra el mensaje que viene del backend (409, 400, etc.)
        throw new Error(data?.error || "Error en registro");
      }

      Alert.alert("Registro exitoso", "Ahora inicia sesión con tus credenciales");
      // Opcional: limpiar el formulario
      setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
      // Ir a la pantalla de login (tu index es la de inicio de sesión)
      router.push("/");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TopBar />

      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>¡Bienvenido a SeguriMapp!</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Nombre de usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu usuario"
          placeholderTextColor="#888"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="ejemplo@correo.com"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Confirmar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#888"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Registrar</Text>}
      </TouchableOpacity>

      {error ? <Text style={{ color: "red", marginTop: 10 }}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => router.push("/")}
      >
        <Text style={styles.buttonText}>Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: TEXT,
    marginBottom: 80,
    marginTop: 10,
  },
  field: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: TEXT,
  },
  button: {
    backgroundColor: GREEN,
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "#ddd",
  },
  buttonText: { fontSize: 18, fontWeight: "bold", color: "#000" },
  logo: { width: 100, height: 100, marginBottom: 0, marginTop: 60 },
});
