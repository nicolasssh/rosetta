
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { addExerciseTime, getCurrentUser } from '../../controllers/userController';

const API_URL = 'https://7d19-129-10-8-179.ngrok-free.app/exercises';

export default function WriteExercise() {
  const [text, setText] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch a new written comprehension exercise from the API
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
      setText(exerciseObj.text || '');
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


  // Ajout du temps à la fin de l'exercice (exemple : 15 minutes)
  const handleFinish = async () => {
    const user = getCurrentUser();
    if (user) {
      await addExerciseTime(user.uid, 15); // 15 minutes pour l'exemple
    }
    setShowResult(true);
  };

  const handleSelect = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const allAnswered = answers.length > 0 && answers.every((a) => a !== null);
  const correctCount = answers.filter((a, i) => a && a.endsWith(questions[i].answer)).length;

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
        <View style={styles.textCard}>
          <Text style={styles.textTitle}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Reading comprehension</Text>
        <View style={styles.textCard}>
          <Text style={styles.textTitle}>Texte</Text>
          <Text style={styles.textContent}>{text}</Text>
        </View>
        <Text style={styles.subtitle}>Select the correct answers</Text>
        <View style={{ gap: 20, width: '100%', marginBottom: 30 }}>
          {questions.map((q, i) => (
            <View
              key={q.question + '-' + (q.options ? q.options.join('-') : '') + '-' + i}
              style={{ width: '100%' }}
            >
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
                placeholder="Choisir une réponse"
                style={{ marginBottom: 0 }}
                labelStyle={{ color: '#000' }}
              />
              {showResult && (
                <View style={{ marginTop: 2, marginLeft: 4 }}>
                  <Text style={{
                    color: answers[i] && answers[i].endsWith(q.answer) ? '#47D6B6' : '#E76F51',
                    fontFamily: 'OutfitBold',
                    fontSize: 15,
                  }}>
                    {answers[i] && answers[i].endsWith(q.answer)
                      ? 'Correct!'
                      : `Incorrect. Correct answer: ${q.answer}`}
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
        <Button
          text={showResult ? `Next question` : 'Continue'}
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

// Ajout du style scrollContent au bon endroit
}

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
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    color: '#3D5A80',
    fontSize: 24,
    fontFamily: 'OutfitBold',
    marginBottom: 10,
    textAlign: 'center',
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
  },
  textTitle: {
    fontFamily: 'OutfitBold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    color: '#222',
  },
  textContent: {
    fontFamily: 'Outfit',
    fontSize: 16,
    color: '#222',
    lineHeight: 24,
  },
  link: {
    color: '#3D5A80',
    textDecorationLine: 'underline',
    fontFamily: 'Outfit',
  },
  highlight: {
    color: '#FF8552',
    fontFamily: 'OutfitBold',
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
