import { updateDocumentInFirestore } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Select from "../components/Select";

const retrieveUserDocID = async () => {
  try {
    const value = await AsyncStorage.getItem('userDocID');
    if (value !== null) {
      // La valeur a été récupérée avec succès
      console.log('Donnée récupérée :', value);
      // Si vous avez stocké un objet JSON, vous devrez le parser :
      return value;
    } else {
      console.log('Aucune donnée trouvée pour cette clé.');
    }
  } catch (error) {
    // Gérer les erreurs de lecture
    console.error('Erreur lors de la récupération des données :', error);
  }
};

const updateUserLanguage = async (language: string) => {
  const userDocID = await retrieveUserDocID();
  if (!userDocID) {
    console.error("User Document ID not found in AsyncStorage");
    return;
  }
  try {
    await updateDocumentInFirestore('users', userDocID, { language });
    console.log("User language updated successfully");
  } catch (error) {
    console.error("Error updating user language:", error);
  }
}

export default function OnboardingLanguage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Which language do you want to learn?</Text>
      <Image
        source={require('@/assets/images/world.png')}
        style={{ width: 178, height: 178, marginBottom: 20 }}
      />
      <Select
        style={{ marginBottom: 'auto', marginTop: 20 }}
        options={[
          { label: 'English', value: 'en' },
          { label: 'French', value: 'fr' },
          { label: 'Spanish', value: 'es' },
        ]}
        label="Select your language"
        onSelectionChange={(value) => {
          setSelectedLanguage(value);
          console.log("Selected language:", value);
        }}
        placeholder="Select a language"
      />
      <Button
        text="Next step"
        onPress={async () => {
          let userDocID = retrieveUserDocID();
          console.log("User Document ID:", userDocID);
          if (!userDocID) {
            console.error("User Document ID not found in AsyncStorage");
            return;
          }
          await updateUserLanguage(selectedLanguage);
          router.push("/onboarding/level");
        }}
        disabled={!selectedLanguage || selectedLanguage === ''}
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