import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";

export default function OnboardingInterests() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interests = [
    { id: 'travel', label: 'Travel 🧳' },
    { id: 'culture', label: 'Culture & Art 🎨' },
    { id: 'kitchen', label: 'Kitchen 🍳' },
    { id: 'literature', label: 'Literature & Poetry 📚' },
    { id: 'sports', label: 'Sport & Wellness 🏃' },
    { id: 'technology', label: 'Science & Technology ⚗️' },
    { id: 'general', label: 'Daily conversations 💬' },
  ];

  const handleInterestToggle = (interestId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedInterests(prev => [...prev, interestId]);
    } else {
      setSelectedInterests(prev => prev.filter(id => id !== interestId));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Customize your route</Text>
      <Text style={styles.text}>A few minutes a day is all it takes to make progress. How often would you like to practice?</Text>
      
      <View style={styles.interestsContainer}>
        {interests.map((interest) => (
          <Checkbox
            key={interest.id}
            label={interest.label}
            onToggle={(isChecked) => handleInterestToggle(interest.id, isChecked)}
            initialValue={selectedInterests.includes(interest.id)}
            style={styles.checkboxStyle}
          />
        ))}
      </View>

      <Button
        text="Next step"
        onPress={() => {
          console.log('Selected interests:', selectedInterests);
          router.push('/onboarding/identity');
        }}
        disabled={selectedInterests.length === 0}
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
  interestsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 'auto',
    flexWrap: 'wrap'
  },
  checkboxStyle: {
    width: 'auto',
  },
});