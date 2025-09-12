import { useRouter } from "expo-router";
import { Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopBar from '../../components/TopBar';

const GREEN = '#C7F1D1';
const TEXT = '#222';



export default function Index() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background3.png')}
        style={styles.bg}
        resizeMode="cover"
        imageStyle={{ opacity: 0.35 }}
      >
        {/* Barra verde
        <View
          style={[
            styles.bar,
            { top: 0, height: 10 + insets.top }
          ]}
        /> */}

        <TopBar />

        {/* CONTENIDO */}
        <View style={styles.overlay}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>SeguriMapp</Text>

          {/* Inputs */}
          <TextInput
            placeholder="Nombre de usuario"
            placeholderTextColor="#666"
            style={styles.input}
          />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#666"
            secureTextEntry
            style={styles.input}
          />

          {/* boton inicar sesión */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>

            {/* botones para ir a registro y recuperacion de contraseña */}
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
  container: { flex: 1, position: 'relative' },
  bg: { flex: 1, width: '100%', height: '100%' },
  // bar: {
  //   position: 'absolute',
  //   left: 0,
  //   right: 0,
  //   backgroundColor: GREEN,
  //   opacity: 1,
  //   zIndex: 2,
  // },

  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 120,
    paddingHorizontal: 20,
  },
  logo: { width: 120, height: 120, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: TEXT, marginBottom: 20 },

  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: TEXT,
  },
  button: {
    backgroundColor: GREEN,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },

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
