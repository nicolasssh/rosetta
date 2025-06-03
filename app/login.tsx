import { router } from 'expo-router'; // Pour la navigation avec Expo Router
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native'; // Ajout de ActivityIndicator
import { auth } from '../firebaseConfig'; // Assurez-vous que le chemin est correct pour votre firebaseConfig.js
import Button from './components/Button'; // Assurez-vous que le chemin est correct pour votre composant Button
import Input from './components/Input'; // Assurez-vous que le chemin est correct pour votre composant Input


/**
 * Fonction asynchrone pour connecter un utilisateur avec email et mot de passe.
 * @param {string} email L'adresse email de l'utilisateur.
 * @param {string} password Le mot de passe de l'utilisateur.
 * @returns {Promise<string|null>} L'UID (ID utilisateur) de l'utilisateur connecté si réussi, sinon null.
 */
const signInUserWithEmailAndPasswordFirebase = async (email: string, password: string) => {
  try {
    // Tente de connecter l'utilisateur avec email et mot de passe
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // L'utilisateur a été connecté avec succès
    const user = userCredential.user;

    Alert.alert("Succès", `Connecté en tant que : ${user.email}`);
    console.log("Utilisateur connecté avec succès :", user.uid);

    return user.uid; // Retourne l'UID de l'utilisateur
  } catch (error: any) {
    let errorMessage = "Une erreur inconnue est survenue lors de la connexion.";

    // Gérer les erreurs spécifiques de Firebase Auth
    if (error && error.code) {
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "L'adresse email n'est pas valide.";
          break;
        case 'auth/user-disabled':
          errorMessage = "Ce compte utilisateur a été désactivé.";
          break;
        case 'auth/user-not-found':
          errorMessage = "Aucun utilisateur trouvé avec cette adresse email.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Le mot de passe est incorrect.";
          break;
        case 'auth/invalid-credential': // Erreur générique pour identifiants invalides
          errorMessage = "Identifiants invalides. Veuillez vérifier votre email et mot de passe.";
          break;
        default:
          console.error("Erreur lors de la connexion :", error.code, error.message);
          errorMessage = `Erreur : ${error.message}`;
          break;
      }
    } else {
      errorMessage = `Erreur inattendue : ${error.message || error}`;
      console.error("Full error object in catch block:", error);
    }

    Alert.alert("Erreur de connexion", errorMessage);
    return null; // Retourne null en cas d'échec
  }
};


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Nouvel état pour le chargement

  const handleLogin = async () => {
    if (!email || !password) { // Vérification des champs avant de commencer
      Alert.alert("Champs manquants", "Veuillez entrer votre email et votre mot de passe.");
      return;
    }

    setIsLoading(true); // Active l'état de chargement

    try {
      // Appel direct de la fonction car elle est définie dans le même fichier
      const userId = await signInUserWithEmailAndPasswordFirebase(email, password);
      if (userId) {
        // L'utilisateur est connecté, vous pouvez maintenant naviguer vers votre page d'accueil
        console.log("Utilisateur connecté avec UID :", userId);
        router.replace('/learn'); // Remplacez '/home' par la route de votre page d'accueil
      }
      // Si userId est null, la fonction signInUserWithEmailAndPasswordFirebase aura déjà affiché une alerte.
    } catch (error) {
      // Ce bloc catch est ici pour une gestion d'erreur supplémentaire au niveau du composant,
      // bien que signInUserWithEmailAndPasswordFirebase gère déjà les alertes.
      console.error("Erreur inattendue dans handleLogin:", error);
      Alert.alert("Erreur", "Une erreur inattendue est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false); // Désactive l'état de chargement, que la connexion ait réussi ou échoué
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome back !</Text>
      <View style={styles.form}>
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
      </View>
      <Button
        text={isLoading ? "Loading..." : "Login"}
        onPress={handleLogin}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator size="small" color="#0000ff" style={{ marginTop: 10 }} />} {/* Indicateur de chargement */}

      <Button
            text="I don't have an account !"
            onPress={() => {
                router.push('/onboarding');
            }}
            style={styles.button}
            disabled={isLoading}
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
    backgroundColor: '#3D5A80',
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
  form: {
    width: '100%',
    marginBottom: "auto",
  },
  input: {
    width: '100%',
    maxWidth: 300,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    backgroundColor: 'transparent', // Couleur de fond du bouton
    borderColor: 'white', // Couleur de bordure du bouton
    borderWidth: 1, // Épaisseur de la bordure
  },
});