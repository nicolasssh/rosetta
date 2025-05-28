
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Select from '../../components/Select';

const text = `Marie se promène dans les rues de Paris. C'est une matinée ensoleillée et il y a beaucoup de monde.\n\nElle se rend dans un café pour prendre son petit-déjeuner. Elle commande un café au lait et un croissant.\n\nEnsuite, elle visite un musée et achète des souvenirs pour ses amis.`;

const questions = [
  {
    label: 'In which city is Marie walking?',
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
      { label: 'A sandwich', value: 'sandwich' },
      { label: 'A coffee with milk and a croissant', value: 'croissant' },
      { label: 'A salad', value: 'salad' },
    ],
    answer: 'croissant',
  },
  {
    label: 'What does she visit after breakfast?',
    options: [
      { label: 'The Eiffel Tower', value: 'eiffel' },
      { label: 'A museum', value: 'musee' },
      { label: 'A park', value: 'parc' },
    ],
    answer: 'musee',
  },
];

export default function WriteExercise() {
  const [answers, setAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const allAnswered = answers.every((a) => a !== null);
  const correctCount = answers.filter((a, i) => a === questions[i].answer).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Reading comprehension</Text>
        <View style={styles.textCard}>
          <Text style={styles.textTitle}>Une journée en ville</Text>
          <Text style={styles.textContent}>
            <Text style={styles.link}>Marie</Text> se promène dans les rues de <Text style={styles.link}>Paris</Text>. C'est une matinée <Text style={styles.highlight}>ensoleillée</Text> et il y a beaucoup de monde.{"\n\n"}
            Elle se rend dans un <Text style={styles.link}>café</Text> pour prendre son petit-déjeuner. Elle commande un <Text style={styles.link}>café au lait</Text> et un <Text style={styles.link}>croissant</Text>.{"\n\n"}
            Ensuite, elle visite un <Text style={styles.link}>musée</Text> et achète des <Text style={styles.link}>souvenirs</Text> pour ses amis.
          </Text>
        </View>
        <Text style={styles.subtitle}>Select the correct answers</Text>
        <View style={{ gap: 20, width: '100%', marginBottom: 30 }}>
          {questions.map((q, i) => (
            <Select
              key={i}
              label={q.label}
              options={q.options}
              onSelectionChange={(value) => handleSelect(i, value)}
              placeholder="Choisir une réponse"
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
