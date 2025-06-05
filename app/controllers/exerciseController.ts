import { getCurrentUser, getUserProfile } from './userController';

const API_URL = 'https://ba3f-129-10-8-179.ngrok-free.app/exercises';

/**
 * Récupère un exercice depuis l'API en fonction du profil utilisateur et du type d'exercice.
 * @param {string} type - Le type d'exercice (ex: 'comprehension', 'write', etc)
 * @param {number} count - Nombre d'exercices à générer (défaut: 1)
 * @returns {Promise<any>} L'exercice ou une erreur
 */
export async function fetchExerciseForUser(type: string, count: number = 1): Promise<any> {
  const user = getCurrentUser();
  if (!user) throw new Error('Utilisateur non connecté');
  const profile = await getUserProfile(user.uid);
  if (!profile) throw new Error('Profil utilisateur introuvable');
  const level = profile.level || 'beginner';
  let context = 'general';
  if (profile.context) {
    context = profile.context;
  } else if (Array.isArray(profile.interests) && profile.interests.length > 0) {
    const randomIdx = Math.floor(Math.random() * profile.interests.length);
    context = profile.interests[randomIdx];
  }
  const body = {
    type,
    context,
    level,
    count,
  };
  console.log('Fetching exercise with body:', body);
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Erreur API');
  const data = await response.json();
  return data;
}
