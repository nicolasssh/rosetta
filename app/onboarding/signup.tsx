import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "../components/Input";

export default function OnboardingIdentity() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secondPassword, setSecondPassword] = useState<string>('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create your travel identity</Text>
      <Text style={styles.text}>Let's finalize it! Enter your login details to keep track of your progress!</Text>
      <View style={{ marginBottom: 'auto', width: '100%' }}>
        <Input
          label="Email"
          type="email"
          onValueChange={(value) => {
            setEmail(value);
            console.log("Entered email:", value);
          }}
          placeholder="john.doe@example.com"
          initialValue={email}
        />
        <Input
          label="Password"
          type="password"
          onValueChange={(value) => {
            setPassword(value);
            console.log("Entered password:", value);
          }}
          placeholder=""
          initialValue={password}
        />
        <Input
          label="Repeat your password"
          type="password"
          onValueChange={(value) => {
            setSecondPassword(value);
            console.log("Entered re-password:", value);
          }}
          placeholder=""
          initialValue={secondPassword}
        />
      </View>

      <Button
        text="Next step"
        onPress={() => {
          // router.push('/onboarding/interests');
        }}
        disabled={!email || email === '' || !password || password === '' || !secondPassword || secondPassword === '' || password !== secondPassword}
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