import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GREEN = '#C7F1D1';

export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background3.png')}
        style={styles.bg}
        resizeMode="cover"
        imageStyle={{ opacity: 0.35 }}
      >
        {/* BARRA SUPERIOR */}
        <View
          style={[
            styles.bar,
            { top: 0, height: 10 + insets.top }
          ]}
        />

        {/* CONTENIDO (logo/título) */}
        <View style={styles.overlay}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>SeguriMapp</Text>
        </View>

  
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  bg: { flex: 1, width: '100%', height: '100%' },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: GREEN,
    opacity: 1,          
    zIndex: 2,
  },

  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 120,
  },
  logo: { width: 120, height: 120, marginBottom: 0 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222' },
});
