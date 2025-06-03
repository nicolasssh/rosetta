/**
 * Ajoute du temps passé à la progression quotidienne de l'utilisateur (champ progress[YYYY-MM-DD]).
 * @param {string} uid - L'UID Firebase de l'utilisateur
 * @param {number} minutes - Minutes à ajouter
 */
export async function addExerciseTime(uid: string, minutes: number): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    let progress: Record<string, number> = {};
    if (userDoc.exists()) {
      const data = userDoc.data();
      progress = (data.progress as Record<string, number>) || {};
    }
    const today = new Date().toISOString().slice(0, 10);
    progress[today] = (progress[today] || 0) + minutes;
    await updateDoc(userDocRef, { progress });
  } catch (error) {
  }
}
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

/**
 * Récupère l'utilisateur actuellement connecté via Firebase Auth.
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Récupère les informations du compte utilisateur depuis Firestore (collection 'users').
 * @param {string} uid - L'UID Firebase de l'utilisateur
 * @returns {Promise<any|null>} Les données du compte utilisateur ou null si non trouvé
 */
export async function getUserProfile(uid: string): Promise<any | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

/**
 * Met à jour les informations du compte utilisateur dans Firestore (collection 'users').
 * @param {string} uid - L'UID Firebase de l'utilisateur
 * @param {object} data - Les champs à mettre à jour
 * @returns {Promise<boolean>} true si succès, false sinon
 */
export async function updateUserProfile(uid: string, data: Record<string, any>): Promise<boolean> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, data);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Crée un nouveau profil utilisateur dans Firestore (collection 'users').
 * @param {string} uid - L'UID Firebase de l'utilisateur
 * @param {object} data - Les données du profil à créer
 * @returns {Promise<boolean>} true si succès, false sinon
 */
export async function createUserProfile(uid: string, data: Record<string, any>): Promise<boolean> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, data, { merge: true });
    return true;
  } catch (error) {
    return false;
  }
}
