// app/_layout.tsx
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Barra inferior transparente + botones negros
      NavigationBar.setBackgroundColorAsync('transparent');
      NavigationBar.setButtonStyleAsync('dark'); // negro
      NavigationBar.setBehaviorAsync('inset-swipe');
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider value={DefaultTheme}>
        <StatusBar translucent backgroundColor="transparent" style="dark" />
        <Slot />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
