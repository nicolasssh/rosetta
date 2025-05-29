import { updateDocumentInFirestore } from "@/firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "../components/Input";

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

const updateFirstname = async (firstname: string) => {
  const userDocID = await retrieveUserDocID();
  if (!userDocID) {
    console.error("User Document ID not found in AsyncStorage");
    return;
  }
  try {
    await updateDocumentInFirestore('users', userDocID, { firstname });
    console.log("User level updated successfully");
  } catch (error) {
    console.error("Error updating user level:", error);
  }
}

const updateLastname = async (lastname: string) => {
  const userDocID = await retrieveUserDocID();
  if (!userDocID) {
    console.error("User Document ID not found in AsyncStorage");
    return;
  }
  try {
    await updateDocumentInFirestore('users', userDocID, { lastname });
    console.log("User level updated successfully");
  } catch (error) {
    console.error("Error updating user level:", error);
  }
}

const updateDob = async (dob: string) => {
  const userDocID = await retrieveUserDocID();
  if (!userDocID) {
    console.error("User Document ID not found in AsyncStorage");
    return;
  }
  try {
    await updateDocumentInFirestore('users', userDocID, { dob });
    console.log("User level updated successfully");
  } catch (error) {
    console.error("Error updating user level:", error);
  }
}

export default function OnboardingIdentity() {
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [dob, setDob] = useState<string>('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create your travel identity</Text>
      <Text style={styles.text}>How would you like to be known in the Rosetta community?</Text>
      <View style={{ marginBottom: 'auto', width: '100%' }}>
        <Input
          label="Firstname"
          type="text"
          onValueChange={(value) => {
            setFirstname(value);
            console.log("Entered name:", value);
          }}
          placeholder="John"
          initialValue={firstname}
        />
        <Input
          label="Lastname"
          type="text"
          onValueChange={(value) => {
            setLastname(value);
            console.log("Entered lastname:", value);
          }}
          placeholder="Doe"
          initialValue={lastname}
        />
        <Input
          label="Date of Birth"
          type="date"
          onValueChange={(value) => {
            setDob(value);
            console.log("Entered dob:", value);
          }}
          placeholder="YYYY-MM-DD"
          initialValue={dob}
        />
      </View>

      <Button
        text="Next step"
        onPress={() => {
          updateFirstname(firstname);
          updateLastname(lastname);
          updateDob(dob);
          router.push('/onboarding/signup');
        }}
        disabled={!firstname || firstname === '' || !lastname || lastname === '' || !dob || dob === ''}
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