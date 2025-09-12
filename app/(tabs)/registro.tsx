import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import TopBar from "../../components/TopBar";

const TEXT = "#222";
const BORDER = "#D9D9D9";
const INPUT_BG = "#fff";
const GREEN = "#C7F1D1";

export default function Registro() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Barra superior */}
      <TopBar />

      {/* Título */}

      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>¡Bienvenido a SeguriMapp!</Text>

      {/* Campo con label */}
      <View style={styles.field}>
        <Text style={styles.label}>Nombre de usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu usuario"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="ejemplo@correo.com"
          placeholderTextColor="#888"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#888"
          secureTextEntry
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Confirmar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#888"
          secureTextEntry
        />
      </View>

      {/* Botón registrar */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      {/* Botón volver */}
      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => router.push("/")} // navega al index principal
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
