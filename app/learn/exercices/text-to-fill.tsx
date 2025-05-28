import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';

const sentenceParts = [
  'The company ',
  '____', // 0
  ' a significant loss last quarter, but the CEO remains ',
  '____', // 1
  ' about future growth.'
];

const answers = [
  'reported',
  'optimistic',
];

const options = [
  'reported', 'doubtful', 'announced', 'experienced', 'concerned', 'optimistic', 'worried'
];

export default function TextToFill() {
  const [filled, setFilled] = useState<(string | null)[]>([null, null]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Handle when a blank is pressed
  const handleBlankPress = (index: number) => {
    setSelected(index);
  };

  // Handle when an option is pressed
  const handleOptionPress = (option: string) => {
    if (selected !== null) {
      const newFilled = [...filled];
      newFilled[selected] = option;
      setFilled(newFilled);
      setSelected(null);
    }
  };

  // Remove answer from blank
  const handleRemove = (index: number) => {
    const newFilled = [...filled];
    newFilled[index] = null;
    setFilled(newFilled);
    setSelected(index);
  };

  // Disable option if already used
  const isOptionUsed = (option: string) => filled.includes(option);

  const allFilled = filled.every((f) => f !== null);
  const correctCount = filled.filter((f, i) => f === answers[i]).length;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Text-to-fill</Text>
      <Text style={styles.subtitle}>Complete the sentences</Text>
      <View style={styles.card}>
        <View style={styles.sentenceRow}>
          <Text style={styles.sentenceText}>The company </Text>
          <TouchableOpacity
            style={[styles.blank, selected === 0 && styles.blankSelected]}
            onPress={() => handleBlankPress(0)}
            activeOpacity={0.7}
          >
            {filled[0] ? (
              <Text style={styles.blankText} onPress={() => handleRemove(0)}>{filled[0]}</Text>
            ) : (
              <Text style={styles.blankPlaceholder}>______</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.sentenceText}> a significant loss last quarter, but the CEO remains </Text>
          <TouchableOpacity
            style={[styles.blank, selected === 1 && styles.blankSelected]}
            onPress={() => handleBlankPress(1)}
            activeOpacity={0.7}
          >
            {filled[1] ? (
              <Text style={styles.blankText} onPress={() => handleRemove(1)}>{filled[1]}</Text>
            ) : (
              <Text style={styles.blankPlaceholder}>______</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.sentenceText}> about future growth.</Text>
        </View>
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, isOptionUsed(option) && styles.optionUsed]}
            onPress={() => handleOptionPress(option)}
            disabled={isOptionUsed(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        text={showResult ? `Score: ${correctCount}/${answers.length}` : 'Continue'}
        onPress={() => setShowResult(true)}
        disabled={!allFilled || showResult}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  sentenceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  sentenceText: {
    fontSize: 16,
    fontFamily: 'Outfit',
    color: '#222',
    lineHeight: 24,
  },
  title: {
    color: '#3D5A80',
    fontSize: 24,
    fontFamily: 'OutfitBold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 16,
    fontFamily: 'Outfit',
    marginBottom: 10,
    textAlign: 'left',
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
  sentence: {
    fontSize: 16,
    fontFamily: 'Outfit',
    color: '#222',
    lineHeight: 24,
    flexWrap: 'wrap',
  },
  blank: {
    borderWidth: 2,
    borderColor: '#B0B0B0',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginHorizontal: 2,
    minWidth: 60,
    minHeight: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F7',
  },
  blankSelected: {
    borderColor: '#47D6B6',
    backgroundColor: '#E6F9F5',
  },
  blankText: {
    color: '#3D5A80',
    fontFamily: 'OutfitBold',
    fontSize: 16,
    textAlign: 'center',
  },
  blankPlaceholder: {
    color: '#B0B0B0',
    fontFamily: 'Outfit',
    fontSize: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  option: {
    backgroundColor: '#47D6B6',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    margin: 4,
    minWidth: 90,
    alignItems: 'center',
    marginBottom: 8,
  },
  optionUsed: {
    backgroundColor: '#B0B0B0',
    opacity: 0.6,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Outfit',
    textAlign: 'center',
  },
});
