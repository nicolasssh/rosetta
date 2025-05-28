import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";

export default function OnboardingReady() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your language adventure is ready!</Text>
      <Image
        source={require('@/assets/images/logo.png')}
        style={{ width: 178, height: 178, marginBottom: 20 }}
      />
      <Text style={styles.text}>Congratulations! Your personalized course has been created. A world of discovery awaits you.</Text>
      <Button
        text="Start"
        onPress={() => {
          router.push("/onboarding/first_word");
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