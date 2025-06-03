import { createUserWithEmailAndPasswordFirebase } from "@/firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "../components/Input";
import { createUserProfile } from "../controllers/userController";

export default function OnboardingSignup() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secondPassword, setSecondPassword] = useState<string>('');

  const handleSignup = async () => {
    if (email && password) {
      // 1. Récupérer les infos de l'onboarding stockées localement
      let onboardingData = {};
      try {
        const stored = await AsyncStorage.getItem('onboardingData');
        if (stored) {
          onboardingData = JSON.parse(stored);
        }
      } catch (e) {
      }

      // 2. Créer le compte (nouvel UID)
      const userId = await createUserWithEmailAndPasswordFirebase(email, password);
      if (userId) {
        // 3. Fusionner toutes les infos collectées + email
        const mergedProfile = { ...onboardingData, email };
        await createUserProfile(userId, mergedProfile);
        // Nettoyer le stockage local
        await AsyncStorage.removeItem('onboardingData');
        // Redirige vers la suite de l'onboarding
        router.push('/onboarding/ready');
        return;
      }
    } else {
      Alert.alert("Erreur", "Veuillez entrer un email et un mot de passe.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create your travel identity</Text>
      <Text style={styles.text}>Let's finalize it! Enter your login details to keep track of your progress!</Text>
      <View style={{ marginBottom: 'auto', width: '100%' }}>
        <Input
          label="Email"
          type="email"
          onValueChange={(value) => {
            setEmail(value);
          }}
          placeholder="john.doe@example.com"
          initialValue={email}
        />
        <Input
          label="Password"
          type="password"
          onValueChange={(value) => {
            setPassword(value);
          }}
          placeholder=""
          initialValue={password}
        />
        <Input
          label="Repeat your password"
          type="password"
          onValueChange={(value) => {
            setSecondPassword(value);
          }}
          placeholder=""
          initialValue={secondPassword}
        />
      </View>

      <Button
        text="Next step"
        onPress={handleSignup}
        disabled={!email || email === '' || !password || password === '' || !secondPassword || secondPassword === '' || password !== secondPassword}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'OutfitBold',
    lineHeight: 31,
    marginBottom: 'auto',
    marginTop: 20,
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Outfit',
    lineHeight: 24,
  },
  select: {
    width: '100%',
    marginBottom: 'auto'
  }
});