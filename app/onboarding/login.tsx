import { router } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { app } from "../../firebaseConfig";
import Button from "../components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/learn");
    } catch (e: any) {
      Alert.alert("Login failed", e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign in to your account</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button text={loading ? "Loading..." : "Sign in"} onPress={handleLogin} disabled={loading || !email || !password} />
      </View>
      <Button text="Back" onPress={() => router.back()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#3D5A80",
  },
  title: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
    fontFamily: "OutfitBold",
    marginBottom: 32,
  },
  form: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    fontFamily: "Outfit",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 18,
    paddingVertical: 8,
    color: "#222",
  },
});
