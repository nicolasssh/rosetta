import { router } from "expo-router";
import * as Speech from 'expo-speech';
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";

export default function OnboardingReady() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your first word!</Text>
      <Image
        source={require('@/assets/images/speech.png')}
        style={{ width: 178, height: 178, marginBottom: 20 }}
      />
      <Text style={styles.text}>Let's start with something simple. Here's how to say 'hello' in your new language.</Text>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, gap: 10 }}>
        <Text style={{ color: 'white', fontSize: 24, fontFamily: 'OutfitBold' }}>Bonjour</Text>
        <Text style={{ color: 'white', fontSize: 24, fontFamily: 'Outfit' }}>•</Text>
        <Text style={{ color: 'white', fontSize: 24, fontFamily: 'Outfit' }}>bɔ̃.ʒuʁ</Text>
      </View>
      <TouchableOpacity
        style={{ marginBottom: "auto" }}
        onPress={() => {
          Speech.speak("Bonjour", { language: 'fr-FR', rate: 1.0, pitch: 1.0 });
        }}
      >
        <Text style={{ color: 'white', fontSize: 22, textAlign: 'center', fontFamily: 'Outfit', lineHeight: 31 }}>
          🔊
        </Text>
      </TouchableOpacity>
      <Button
        text="Nice ! Let's continue"
        onPress={() => {
          router.push("/learn");
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
    marginBottom: 20,
  }
});