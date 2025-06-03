
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { addExerciseTime, getCurrentUser } from '../../controllers/userController';

const API_URL = 'https://7d19-129-10-8-179.ngrok-free.app/exercises';

const OralComprehension: React.FC = () => {
  const [story, setStory] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch a new comprehension exercise from the API
  const fetchExercise = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = getCurrentUser();
      if (!user) {
        setError('Utilisateur non connecté');
        setLoading(false);
        return;
      }
      // Adapter selon ton modèle utilisateur si besoin
      const level = 'beginner';
      const context = 'general';
      const body = {
        type: 'comprehension',
        context,
        level,
        count: 1,
      };
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Erreur API');
      const data = await response.json();
      const exerciseObj = Array.isArray(data.exercises) ? data.exercises[0] : data;
      setStory(exerciseObj.text || '');
      if (Array.isArray(exerciseObj.questions)) {
        exerciseObj.questions.forEach((q: any, idx: number) => {
          console.log(`Question ${idx}:`, q);
          if (q.options) {
            console.log(`Options for question ${idx}:`, q.options);
          }
        });
      }
      setQuestions(exerciseObj.questions || []);
      setAnswers(Array((exerciseObj.questions || []).length).fill(null));
      setShowResult(false);
    } catch (e: any) {
      setError(e.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercise();
  }, []);

  // Ajout du temps à la fin de l'exercice (exemple : 10 minutes)
  const handleFinish = async () => {
    const user = getCurrentUser();
    if (user) {
      await addExerciseTime(user.uid, 10); // 10 minutes pour l'exemple
    }
    setShowResult(true);
  };

  const handleSelect = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleListen = () => {
    Speech.stop();
    Speech.speak(story, { language: 'fr-FR' });
  };

  const allAnswered = answers.length > 0 && answers.every((a) => a !== null);
  const correctCount = answers.filter((a, i) => questions[i] && a && a.endsWith(questions[i].answer)).length;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#47D6B6" />
        </View>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Error : {error}</Text>
      </SafeAreaView>
    );
  }

  return (

    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Oral comprehension</Text>
        <TouchableOpacity style={styles.listenButton} onPress={handleListen}>
          <Text style={styles.listenText}>🔊 Listen to the text</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>Select the correct answers</Text>
        <View style={{ gap: 20, width: '100%', marginBottom: 30 }}>
          {questions.map((q, i) => (
            <View key={q.question + '-' + (q.options ? q.options.join('-') : '') + '-' + i} style={{ width: '100%' }}>
              <Select
                label={q.question}
                options={Array.isArray(q.options)
                  ? q.options.map((opt: string, idx: number) => ({
                      label: opt,
                      value: `${i}-${opt}`
                    }))
                  : []
                }
                onSelectionChange={(value) => handleSelect(i, value)}
                placeholder="Choose an answer"
                style={{ marginBottom: 0, width: '100%' }}
                labelStyle={{ color: '#000' }}
              />
              {showResult && (
                <View style={{ marginTop: 2, marginLeft: 4 }}>
                  <Text style={{
                    color: answers[i] && answers[i].endsWith(q.answer) ? '#47D6B6' : '#E76F51',
                    fontFamily: 'OutfitBold',
                    fontSize: 15,
                  }}>
                    {answers[i] && answers[i].endsWith(q.answer) ? 'Correct!' : `Incorrect. Correct answer: ${q.answer}`}
                  </Text>
                  {answers[i] && !answers[i].endsWith(q.answer) && q.explanation && (
                    <Text style={{ color: '#222', fontFamily: 'Outfit', fontSize: 14, marginTop: 2 }}>
                      {q.explanation}
                    </Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
        {showResult && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#3D5A80', fontFamily: 'OutfitBold', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
              Score: {correctCount}/{questions.length}
            </Text>
          </View>
        )}
        <Button
          text={showResult ? 'Next question' : 'Finish'}
          onPress={async () => {
            if (!showResult) {
              await handleFinish();
            } else {
              await fetchExercise();
            }
          }}
          disabled={!allAnswered && !showResult}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    color: '#3D5A80',
    fontSize: 24,
    fontFamily: 'OutfitBold',
    marginBottom: 10,
    textAlign: 'center',
  },
  listenButton: {
    backgroundColor: '#E6F9F5',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  listenText: {
    color: '#3D5A80',
    fontSize: 16,
    fontFamily: 'Outfit',
    textAlign: 'center',
  },
  subtitle: {
    color: '#1D1D1F',
    fontSize: 18,
    fontFamily: 'OutfitBold',
    marginBottom: 20,
    textAlign: 'left',
    width: '100%',
  },
});

export default OralComprehension;
