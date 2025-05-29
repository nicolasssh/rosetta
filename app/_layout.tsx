import { useFonts } from 'expo-font';
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import '../firebaseConfig';

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
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="learn" options={{ headerShown: false }} />
      </Stack>
      {/* La redirection vers /onboarding doit être gérée après l'authentification si nécessaire,
          ou si c'est le comportement initial désiré de l'application. */}
      <Redirect href="/onboarding" />
    </>
  );
}
