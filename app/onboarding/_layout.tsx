import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: styles.container, // Applique le style au contenu de chaque écran
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D5A80'
  },
});