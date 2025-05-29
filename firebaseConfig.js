// firebaseConfig.js
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth'; // Modifié ici
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { Alert } from 'react-native';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAkhh196yCZnyzbgAB8U_xGET8WlipiC0",
  authDomain: "rosetta-61c6e.firebaseapp.com",
  projectId: "rosetta-61c6e",
  storageBucket: "rosetta-61c6e.firebasestorage.app",
  messagingSenderId: "810608092742",
  appId: "1:810608092742:web:77a0ed1533678304364c47",
  measurementId: "G-0YJF4G3TBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialise Auth avec la persistance AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialise Firestore
const db = getFirestore(app);

const updateDocumentInFirestore = async (collectionName, documentId , dataToUpdate) => {
  try {
    // Référence au document spécifique par son ID
    const docRef = doc(db, collectionName, documentId);

    // Met à jour les champs spécifiés du document
    await updateDoc(docRef, dataToUpdate);

    // Affiche une alerte de succès à l'utilisateur
    console.log(`Document ${documentId} mis à jour.`);
  } catch (e) {
    // Gère les erreurs lors de la mise à jour (par exemple, document non trouvé, permissions)
    console.error("Erreur lors de la mise à jour du document : ", e);
    // Affiche une alerte d'erreur à l'utilisateur
    Alert.alert("Erreur", "Impossible de mettre à jour le document. Vérifiez si l'ID est correct et si le document existe.");
    throw e; // Propage l'erreur
  }
};

const createUserWithEmailAndPasswordFirebase = async (email, password) => {
  try {
    // Tente de créer l'utilisateur avec email et mot de passe
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // L'utilisateur a été créé avec succès
    const user = userCredential.user;

    Alert.alert("Succès", `Compte créé avec l'ID : ${user.uid}`);
    console.log("Utilisateur créé avec succès :", user.uid);

    return user.uid; // Retourne l'UID de l'utilisateur
  } catch (error) {
    let errorMessage = "Une erreur inconnue est survenue lors de la création du compte.";

    // Gérer les erreurs spécifiques de Firebase Auth
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = "Cette adresse email est déjà utilisée par un autre compte.";
        break;
      case 'auth/invalid-email':
        errorMessage = "L'adresse email fournie n'est pas valide.";
        break;
      case 'auth/operation-not-allowed':
        errorMessage = "La connexion par email/mot de passe n'est pas activée. Veuillez contacter le support.";
        break;
      case 'auth/weak-password':
        errorMessage = "Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.";
        break;
      default:
        console.error("Erreur lors de la création du compte :", error.code, error.message);
        errorMessage = `Erreur : ${error.message}`;
        break;
    }

    Alert.alert("Erreur de création de compte", errorMessage);
    return null; // Retourne null en cas d'échec
  }
};

export { app, auth, createUserWithEmailAndPasswordFirebase, db, updateDocumentInFirestore };

