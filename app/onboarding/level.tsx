import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Select from "../components/Select";

export default function OnboardingLevel() {
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>What is your actual level ?</Text>
      <Image
        source={require('@/assets/images/mountain.png')}
        style={{ width: 178, height: 178, marginBottom: 20 }}
      />
      <Text style={styles.text}>Don't worry, even the greatest polyglots started somewhere!</Text>
      <Select
        style={{ marginBottom: 'auto', marginTop: 20 }}
        options={[
          { label: 'Beginner', value: 'beginner' },
          { label: 'Intermediate', value: 'intermediate' },
          { label: 'Advanced', value: 'advanced' },
        ]}
        label="Select your level"
        onSelectionChange={(value) => {
          setSelectedLevel(value);
        }}
        placeholder="Select a level"
      />
      <Button
        text="Next step"
        onPress={async () => {
          // Stocker le niveau dans AsyncStorage
          let onboardingData = {};
          const stored = await AsyncStorage.getItem('onboardingData');
          if (stored) onboardingData = JSON.parse(stored);
          onboardingData = { ...onboardingData, level: selectedLevel };
          await AsyncStorage.setItem('onboardingData', JSON.stringify(onboardingData));
          router.push("/onboarding/frequency");
        }}
        disabled={!selectedLevel || selectedLevel === ''}
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