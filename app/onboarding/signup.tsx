import { createUserWithEmailAndPasswordFirebase, updateDocumentInFirestore } from "@/firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "../components/Input";

const retrieveUserDocID = async () => {
  try {
    const value = await AsyncStorage.getItem('userDocID');
    if (value !== null) {
      console.log('Donnée récupérée :', value);
      return value;
    } else {
      console.log('Aucune donnée trouvée pour cette clé.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
};

const updateUserID = async (userID: string) => {
  const userDocID = await retrieveUserDocID();
  if (!userDocID) {
    console.error("User Document ID not found in AsyncStorage");
    return;
  }
  try {
    await updateDocumentInFirestore('users', userDocID, { userID });
    console.log("User level updated successfully");
  } catch (error) {
    console.error("Error updating user level:", error);
  }
}

export default function OnboardingSignup() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secondPassword, setSecondPassword] = useState<string>('');

  const handleSignup = async () => {
    if (email && password) {
      const userId = await createUserWithEmailAndPasswordFirebase(email, password);
      if (userId) {
        // Le compte a été créé, vous pouvez maintenant naviguer ou faire autre chose
        console.log("Nouvel utilisateur enregistré avec UID :", userId);
        // Exemple de navigation (si vous utilisez Expo Router)
        // router.replace('/home');
        return updateUserID(userId);
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
            console.log("Entered email:", value);
          }}
          placeholder="john.doe@example.com"
          initialValue={email}
        />
        <Input
          label="Password"
          type="password"
          onValueChange={(value) => {
            setPassword(value);
            console.log("Entered password:", value);
          }}
          placeholder=""
          initialValue={password}
        />
        <Input
          label="Repeat your password"
          type="password"
          onValueChange={(value) => {
            setSecondPassword(value);
            console.log("Entered re-password:", value);
          }}
          placeholder=""
          initialValue={secondPassword}
        />
      </View>

      <Button
        text="Next step"
        onPress={() => {
          handleSignup();
          router.push('/onboarding/ready');
        }}
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