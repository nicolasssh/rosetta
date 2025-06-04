
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";

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
          router.push("/onboarding/language");
        }}
      />
      <View style={{ width: '100%', marginTop: 16 }}>
        <Button
          text="Sign in to your account"
          onPress={() => {
            router.push("/onboarding/login");
          }}
        />
      </View>
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