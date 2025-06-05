import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { fetchExerciseForUser } from '../../controllers/exerciseController';
import { addExerciseTime } from '../../controllers/userController';

const API_URL = 'https://ba3f-129-10-8-179.ngrok-free.app/exercises';

export default function DefinitionMatcher() {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState<any[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch exercises from API
  const fetchExercises = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExerciseForUser('definitionMatcher', 3);
      setExercises(data.exercises || []);
      setExerciseIndex(0);
      setAnswers(Array((data.exercises?.[0]?.words?.length || 0)).fill(null));
      setShowResult(false);
    } catch (e: any) {
      setError(e.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleSelect = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleFinish = async () => {
    try {
      const { getCurrentUser } = await import('../../controllers/userController');
      const user = getCurrentUser();
      if (user) {
        await addExerciseTime(user.uid, 10);
      }
    } catch (e) {
      // ignore erreur
    }
    setShowResult(true);
  };

  const current = exercises[exerciseIndex] || {};
  const allAnswered = answers.length > 0 && answers.every((a) => a !== null);
  const correctCount = answers.filter((a, i) => {
    const ans = current.answers?.[i];
    return ans && a && a.endsWith(ans.definition);
  }).length;

  if (loading) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.loadingWrapper}>
                <ActivityIndicator size="large" color="#47D6B6" />
                <Text style={{ color: '#222', fontFamily: 'Outfit', fontSize: 16, marginTop: 10 }}>
                  Preparing the exercice...
                </Text>
            </View>
        </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.textCard}>
          <Text style={styles.textTitle}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          <Text style={styles.title}>Match each word to its definition</Text>
          <View style={styles.textCard}>
            <Text style={styles.textTitle}>Mots</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 10, width: '100%' }}>
              {current.words?.map((w: string, i: number) => (
                <View key={w} style={styles.wordBadge}>
                  <Text style={styles.wordText}>{w}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.subtitle}>Sélectionne la bonne définition pour chaque mot</Text>
          <View style={{ gap: 20, width: '100%', marginBottom: 30 }}>
            {current.words?.map((word: string, i: number) => (
              <View key={word + '-' + i} style={{ width: '100%' }}>
                <Select
                  label={word}
                  options={Array.isArray(current.definitions)
                    ? current.definitions.map((def: string, idx: number) => ({
                        label: def,
                        value: `${i}-${def}`
                      }))
                    : []
                  }
                  onSelectionChange={(value) => handleSelect(i, value)}
                  placeholder="Choisir une définition"
                  style={{ marginBottom: 0, width: '100%' }}
                  labelStyle={{ color: '#000' }}
                />
                {showResult && (
                  <View style={{ marginTop: 2, marginLeft: 4 }}>
                    <Text style={{
                      color: answers[i] && current.answers && answers[i].endsWith(current.answers[i].definition) ? '#47D6B6' : '#E76F51',
                      fontFamily: 'OutfitBold',
                      fontSize: 15,
                    }}>
                      {answers[i] && current.answers && answers[i].endsWith(current.answers[i].definition)
                        ? 'Correct!'
                        : `Incorrect. Correct answer: ${current.answers?.[i]?.definition}`}
                    </Text>
                    {answers[i] && current.answers && !answers[i].endsWith(current.answers[i].definition) && current.answers[i].translation && (
                      <Text style={{ color: '#222', fontFamily: 'Outfit', fontSize: 14, marginTop: 2 }}>
                        {current.answers[i].translation}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
          {showResult && (
            <View style={{ marginBottom: 16, width: '100%' }}>
              <Text style={{ color: '#3D5A80', fontFamily: 'OutfitBold', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
                Score: {correctCount}/{current.words?.length || 0}
              </Text>
            </View>
          )}
          <View style={{ width: '100%' }}>
            <Button
              text={showResult ? (exerciseIndex < exercises.length - 1 ? 'Next set' : 'Restart') : 'Finish'}
              onPress={async () => {
                if (!showResult) {
                  await handleFinish();
                } else if (exerciseIndex < exercises.length - 1) {
                  setExerciseIndex(exerciseIndex + 1);
                  setAnswers(Array((exercises[exerciseIndex + 1]?.words?.length || 0)).fill(null));
                  setShowResult(false);
                } else {
                  await fetchExercises();
                }
              }}
              disabled={!allAnswered && !showResult}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    alignItems: 'stretch',
    paddingBottom: 40,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    alignItems: 'stretch',
    paddingHorizontal: 0,
    paddingTop: 0,
    marginHorizontal: 20,
  },
  textCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignSelf: 'stretch',
  },
  textTitle: {
    fontFamily: 'OutfitBold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    color: '#222',
  },
  wordBadge: {
    backgroundColor: '#E6F9F5',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    margin: 2,
  },
  wordText: {
    color: '#3D5A80',
    fontFamily: 'OutfitBold',
    fontSize: 16,
  },
  subtitle: {
    color: '#1D1D1F',
    fontSize: 18,
    fontFamily: 'OutfitBold',
    marginBottom: 20,
    textAlign: 'left',
    width: '100%',
  },
  title: {
    color: '#3D5A80',
    fontSize: 24,
    fontFamily: 'OutfitBold',
    marginBottom: 10,
    textAlign: 'center',
  },
});
