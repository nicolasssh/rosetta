import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { addDoc, collection } from 'firebase/firestore';
import React from "react";
import { Alert, Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from '../../firebaseConfig';
import Button from "../components/Button";

const handleAddDocument = async () => {
  try {
    const collectionRef = collection(db, 'users');
    const docRef = await addDoc(collectionRef, {
    });

    AsyncStorage.setItem('userDocID', docRef.id)
    console.log("Document written with ID: ", docRef.id);

  } catch (e) {
    // Gérer les erreurs (par exemple, problèmes de permissions, réseau, etc.)
    console.error("Error adding document: ", e);
    Alert.alert("Erreur", "Impossible d'ajouter le document. Veuillez vérifier la console pour plus de détails.");
  }
};

export default function OnboardingIndex() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your language journey begins!</Text>
      <Image
        source={require('@/assets/images/logo.png')}
        style={{ width: 178, height: 178, marginBottom: 20 }}
      />
      <Text style={styles.text}>Welcome to the world of Rosetta! Ready to discover new languages in a smart, personalized way?</Text>
      <Button
        text="Continue"
        onPress={() => {
          handleAddDocument();
          router.push("/onboarding/language");
        }}
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
    marginBottom: 'auto',
  }
});