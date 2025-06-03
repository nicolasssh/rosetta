// firebaseConfig.js
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth'; // Modifié ici
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
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
    const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
    // L'utilisateur a été créé avec succès
    const user = userCredential.user;
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
        console.error("Error while creating the account :", error.code, error.message);
        errorMessage = `Erreur : ${error.message}`;
        break;
    }

    Alert.alert("Erreur while creating the account : ", errorMessage);
    return null; // Retourne null en cas d'échec
  }
};

const getUserDataByUserId = async (collectionName, userId) => {
  try {
    // Crée une référence à la collection
    const usersCollectionRef = collection(db, collectionName);

    // Crée une requête pour trouver les documents où le champ 'userID' correspond à l'userId fourni
    const q = query(usersCollectionRef, where("userID", "==", userId));

    // Exécute la requête
    const querySnapshot = await getDocs(q);

    const userData = [];
    if (querySnapshot.empty) {
      console.log("Aucun document trouvé pour l'utilisateur avec l'ID :", userId);
      // Alert.alert("Information", "Aucune donnée trouvée pour cet utilisateur."); // Optionnel: alerter l'utilisateur
      return null;
    }

    // Parcourt les documents trouvés et ajoute leurs données au tableau
    querySnapshot.forEach((doc) => {
      // doc.data() contient toutes les données du document
      // doc.id est l'ID du document Firestore lui-même
      userData.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Données récupérées pour l'utilisateur ${userId} :`, userData);
    return userData; // Retourne le tableau des documents trouvés
  } catch (error) {
    console.error("Erreur lors de la récupération des données utilisateur :", error);
    Alert.alert("Erreur", "Impossible de récupérer les données utilisateur. Veuillez vérifier la console.");
    return null; // Retourne null en cas d'erreur
  }
};

export { app, auth, createUserWithEmailAndPasswordFirebase, db, getUserDataByUserId, updateDocumentInFirestore };

