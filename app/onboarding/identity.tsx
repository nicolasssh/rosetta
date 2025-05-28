import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "../components/Input";

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