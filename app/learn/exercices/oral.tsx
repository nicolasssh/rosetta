
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Select from '../../components/Select';

const story = `Marie passe un week-end à Paris. Le matin, elle va dans un café et commande un croissant et un café pour le petit-déjeuner. Après le petit-déjeuner, elle visite le musée du Louvre.`;

const questions = [
  {
    label: 'In which city is Marie?',
    options: [
      { label: 'London', value: 'london' },
      { label: 'Paris', value: 'paris' },
      { label: 'Berlin', value: 'berlin' },
    ],
    answer: 'paris',
  },
  {
    label: 'What does she order for breakfast?',
    options: [
      { label: 'A croissant and a coffee', value: 'croissant' },
      { label: 'A sandwich', value: 'sandwich' },
      { label: 'A salad', value: 'salad' },
    ],
    answer: 'croissant',
  },
  {
    label: 'What does she visit after breakfast?',
    options: [
      { label: 'The Eiffel Tower', value: 'eiffel' },
      { label: 'The Louvre Museum', value: 'louvre' },
      { label: 'Notre-Dame', value: 'notredame' },
    ],
    answer: 'louvre',
  },
];

export default function OralExercise() {
  const [answers, setAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleListen = () => {
    console.log(story);
    Speech.stop();
    Speech.speak(story, { language: 'fr-FR' });
  };

  const allAnswered = answers.every((a) => a !== null);
  const correctCount = answers.filter((a, i) => a === questions[i].answer).length;

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
            <Select
              key={i}
              label={q.label}
              options={q.options}
              onSelectionChange={(value) => handleSelect(i, value)}
              placeholder="Choose an answer"
              style={{ marginBottom: 0 }}
              labelStyle={{ color: '#000' }}
            />
          ))}
        </View>
        <Button
          text={showResult ? `Score: ${correctCount}/${questions.length}` : 'Continue'}
          onPress={() => setShowResult(true)}
          disabled={!allAnswered || showResult}
        />
      </ScrollView>
    </SafeAreaView>
  );

// Ajout du style scrollContent au bon endroit
}

const styles = StyleSheet.create({
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
