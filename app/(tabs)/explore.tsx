// app/(tabs)/explore.tsx
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';

export default function Explore() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Explorar</Text>

        <Text style={styles.paragraph}>
          Aquí irá el contenido de la pestaña de “Explorar”. Puedes colocar un mapa,
          marcadores, listas de zonas, etc. De momento es una pantalla de ejemplo
          sin dependencias que puedan causar conflictos.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 12,
    color: '#222',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
    textAlign: 'center',
  },
});
