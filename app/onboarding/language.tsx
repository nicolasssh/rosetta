import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Select from "../components/Select";

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
        }}
        placeholder="Select a language"
      />
      <Button
        text="Next step"
        onPress={async () => {
          // Stocker la langue dans AsyncStorage
          let onboardingData = {};
          const stored = await AsyncStorage.getItem('onboardingData');
          if (stored) onboardingData = JSON.parse(stored);
          onboardingData = { ...onboardingData, language: selectedLanguage };
          await AsyncStorage.setItem('onboardingData', JSON.stringify(onboardingData));
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