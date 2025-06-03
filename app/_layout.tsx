import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth'; // Importation de la fonction pour écouter l'état d'authentification
import { auth } from './../firebaseConfig'; // Assurez-vous que le chemin est correct

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack, router } from "expo-router"; // Ajout de Stack et router à l'import
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react'; // Ajout de useState
import { ActivityIndicator, View } from 'react-native'; // Importation de l'indicateur de chargement et View

// Empêche l'écran de splash de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Outfit': require('../assets/fonts/Outfit-Regular.ttf'),
    'OutfitBold': require('../assets/fonts/Outfit-Bold.ttf')
  });

  // Nouveaux états pour gérer l'état d'authentification et le chargement initial
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined: en cours de vérification, null: non connecté, objet: connecté
  const [authLoading, setAuthLoading] = useState(true); // Indique si la vérification initiale de l'auth est terminée

  useEffect(() => {
    // Masque l'écran de splash une fois les polices chargées
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    // Écoute les changements d'état d'authentification Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // Met à jour l'état de l'utilisateur
      AsyncStorage.setItem('userID', JSON.stringify(firebaseUser?.uid)); // Enregistre l'utilisateur dans AsyncStorage
      setAuthLoading(false); // Indique que la vérification initiale est terminée
    });

    // Nettoie l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, []); // S'exécute une seule fois au montage du composant

  // DEBUG: Ce useEffect s'exécutera chaque fois que l'état 'user' change,
  // affichant la valeur mise à jour.
  useEffect(() => {
    console.log("État de l'utilisateur mis à jour :", user);

    // Effectue la redirection une fois que l'état d'authentification est déterminé
    if (!authLoading) {
      if (user) {
        // Utilisateur connecté, redirige vers la page d'apprentissage
        router.replace('/learn');
      } else {
        // Utilisateur non connecté, redirige vers la page d'onboarding
        router.replace('/onboarding');
      }
    }
  }, [user, authLoading]); // Dépend de 'user' et 'authLoading'

  // Si les polices ne sont pas encore chargées ou qu'une erreur est survenue, ne rien rendre
  if (!loaded && !error) {
    return null;
  }

  // Si la vérification de l'authentification est toujours en cours, affiche un indicateur de chargement
  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Une fois le chargement terminé et la redirection effectuée par le useEffect,
  // le Stack principal est rendu avec toutes les définitions d'écran.
  // Le `router.replace` dans le useEffect gère la navigation initiale.
  return (
    <Stack screenOptions={{
      headerShown: false, // Masque l'en-tête pour toutes les routes par défaut
    }}>
      {/* Déclaration de vos écrans. Ces écrans seront accessibles une fois la redirection initiale effectuée. */}
      {/* Ils sont nécessaires pour qu'Expo Router connaisse les routes disponibles. */}
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="learn" options={{ headerShown: false }} />
      {/* Ajoutez d'autres écrans ici si nécessaire */}
      {/* Par exemple, si vous avez une page d'accueil par défaut (app/index.tsx) */}
      {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
    </Stack>
  );
}