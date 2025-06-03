import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Select from "../components/Select";

export default function OnboardingFrequency() {
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Define your learning rhythm</Text>
      <Image
        source={require('@/assets/images/calendar.png')}
        style={{ width: 178, height: 178, marginBottom: 20 }}
      />
      <Text style={styles.text}>A few minutes a day is all it takes to make progress. How often would you like to practice?</Text>
      <Select
        style={{ marginBottom: 'auto', marginTop: 20 }}
        options={[
          { label: '10-15min/day', value: '15' },
          { label: '1h/day', value: '60' },
          { label: '3h/day', value: '180' },
        ]}
        label="Select a frequency"
        onSelectionChange={(value) => {
          setSelectedFrequency(value);
        }}
        placeholder="Select a frequency"
      />
      <Button
        text="Next step"
        onPress={async () => {
          // Stocker la fréquence dans AsyncStorage
          let onboardingData = {};
          const stored = await AsyncStorage.getItem('onboardingData');
          if (stored) onboardingData = JSON.parse(stored);
          onboardingData = { ...onboardingData, frequency: selectedFrequency };
          await AsyncStorage.setItem('onboardingData', JSON.stringify(onboardingData));
          router.push('/onboarding/interests');
        }}
        disabled={!selectedFrequency || selectedFrequency === ''}
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