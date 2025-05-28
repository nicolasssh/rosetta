import { useFonts } from 'expo-font';
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Empêche l'écran de splash de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Outfit': require('../assets/fonts/Outfit-Regular.ttf'),
    'OutfitBold': require('../assets/fonts/Outfit-Bold.ttf')
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
      <Redirect href="/onboarding" />
    </>
  );
}