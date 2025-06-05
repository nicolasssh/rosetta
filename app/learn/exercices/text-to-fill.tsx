
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
// import { DraxView } from 'react-native-drax';
import Button from '../../components/Button';
import { fetchExerciseForUser } from '../../controllers/exerciseController';
import { addExerciseTime } from '../../controllers/userController';

const API_URL = 'https://ba3f-129-10-8-179.ngrok-free.app/exercises';

const TextToFill: React.FC = () => {
  const [sentenceParts, setSentenceParts] = useState<string[]>([]);
  // answers: { blanksCorrection: string[], answer: string }
  const [answers, setAnswers] = useState<{ blanksCorrection: string[], answer: string }>({ blanksCorrection: [], answer: '' });
  const [options, setOptions] = useState<string[]>([]);
  const [filled, setFilled] = useState<(string | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercise = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchExerciseForUser('fillInTheBlanks', 1);
        const exerciseObj = Array.isArray(data.exercises) ? data.exercises[0] : data;
        const textParts = exerciseObj.text.split('___');
        setSentenceParts(textParts);
        setAnswers({
          blanksCorrection: exerciseObj.blanksCorrection || [],
          answer: exerciseObj.answer || ''
        });
        // Mélanger les options aléatoirement
        const shuffle = (arr: string[]) => {
          const a = [...arr];
          for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
          }
          return a;
        };
        setOptions(shuffle(exerciseObj.blanks || []));
        setFilled(new Array((exerciseObj.blanks || []).length).fill(null));
      } catch (e: any) {
        setError(e.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, []);

  // Ajout du temps à la fin de l'exercice (exemple : 7 minutes)
  // Construit la phrase complète avec les réponses de l'utilisateur
  const getCompletedSentence = () => {
    let sentence = '';
    for (let i = 0; i < sentenceParts.length; i++) {
      sentence += sentenceParts[i];
      if (i < filled.length) {
        sentence += filled[i] ?? '______';
      }
    }
    return sentence;
  };

  // Vérifie si la phrase complétée correspond à la correction de l'API
  const isSentenceCorrect = () => {
    if (!answers || !answers.answer) return false;
    return getCompletedSentence().trim() === answers.answer.trim();
  };

  // handleFinish vérifie la phrase complète avec la correction
  const handleFinish = async () => {
    try {
      const { getCurrentUser } = await import('../../controllers/userController');
      const user = getCurrentUser();
      if (user) {
        await addExerciseTime(user.uid, 7); // 7 minutes pour l'exemple
      }
    } catch (e) {
      // ignore erreur
    }
    setShowResult(true);
  };

  // Recharge une nouvelle question depuis l'API
  const handleNextQuestion = async () => {
    setShowResult(false);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExerciseForUser('fillInTheBlanks', 1);
      const exerciseObj = Array.isArray(data.exercises) ? data.exercises[0] : data;
      const textParts = exerciseObj.text.split('___');
      setSentenceParts(textParts);
      setAnswers({
        blanksCorrection: exerciseObj.blanksCorrection || [],
        answer: exerciseObj.answer || ''
      });
      const shuffle = (arr: string[]) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      };
      setOptions(shuffle(exerciseObj.blanks || []));
      setFilled(new Array((exerciseObj.blanks || []).length).fill(null));
    } catch (e: any) {
      setError(e.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

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

  const allFilled = filled.length > 0 && filled.every((f) => f !== null);
  const correctCount = filled.filter((f, i) => f === (answers.blanksCorrection[i] || null)).length;

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
        <Text style={styles.title}>Error : {error}</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.screenMargin}>
          <Text style={styles.title}>Text-to-fill</Text>
          <Text style={styles.subtitle}>Complete the sentence</Text>
          <View style={styles.card}>
            <View style={styles.sentenceRow}>
              <Text style={styles.sentenceText}>
                {sentenceParts.map((part, idx) => {
                  if (idx < filled.length) {
                    return (
                      <React.Fragment key={idx}>
                        {part}
                        <Text
                          style={[styles.blankInline, filled[idx] && styles.blankSelectedInline]}
                          onPress={() => filled[idx] ? handleRemove(idx) : handleBlankPress(idx)}
                        >
                          {filled[idx] ? filled[idx] : '______'}
                        </Text>
                      </React.Fragment>
                    );
                  } else {
                    return <React.Fragment key={idx}>{part}</React.Fragment>;
                  }
                })}
              </Text>
            </View>
          </View>
          <View style={styles.optionsContainer}>
            {options.map((option) => {
              if (filled.includes(option)) return null;
              return (
                <View
                  key={option}
                  style={styles.option}
                >
                  <Text style={styles.optionText} onPress={() => handleOptionPress(option)}>{option}</Text>
                </View>
              );
            })}
          </View>
          {showResult && (
            <View style={{ marginBottom: 16 }}>
              {isSentenceCorrect() ? (
                <Text style={{ color: '#47D6B6', fontFamily: 'OutfitBold', fontSize: 18, textAlign: 'center' }}>
                  Good ! Correct answer.
                </Text>
              ) : (
                <>
                  <Text style={{ color: '#E76F51', fontFamily: 'OutfitBold', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
                    No! Incorrect answer.
                  </Text>
                  <Text style={{ color: '#3D5A80', fontFamily: 'OutfitBold', fontSize: 16, textAlign: 'center', marginBottom: 4 }}>
                    Correct answer :
                  </Text>
                  <Text style={{ color: '#222', fontFamily: 'Outfit', fontSize: 16, textAlign: 'center', marginBottom: 8 }}>
                    {answers.answer}
                  </Text>
                  {Array.isArray(answers.blanksCorrection) && answers.blanksCorrection.length > 0 && (
                    <View style={{ backgroundColor: '#F5F5F7', borderRadius: 10, padding: 10, marginBottom: 8 }}>
                      <Text style={{ color: '#3D5A80', fontFamily: 'OutfitBold', fontSize: 16, marginBottom: 4, textAlign: 'center' }}>
                        Why ?
                      </Text>
                      {answers.blanksCorrection.map((correction, idx) => (
                        <Text key={idx} style={{ color: '#222', fontFamily: 'Outfit', fontSize: 15, marginBottom: 2 }}>
                          {correction}
                        </Text>
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>
          )}
          <Button
            text={
              showResult
                ? 'Next question'
                : 'Finish'
            }
            onPress={async () => {
              if (!showResult) {
                await handleFinish();
              } else {
                await handleNextQuestion();
              }
            }}
            disabled={!allFilled && !showResult}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TextToFill;

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  screenMargin: {
    width: '100%',
    paddingHorizontal: 20,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    paddingTop: 30,
  },
  sentenceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 10,
    width: '100%',
  },
  sentenceText: {
    fontSize: 16,
    fontFamily: 'Outfit',
    color: '#222',
    lineHeight: 24,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  blankInline: {
    borderWidth: 2,
    borderColor: '#B0B0B0',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginHorizontal: 2,
    minWidth: 60,
    minHeight: 24,
    backgroundColor: '#F5F5F7',
    color: '#B0B0B0',
    fontFamily: 'Outfit',
    fontSize: 16,
    textAlign: 'center',
    overflow: 'hidden',
  },
  blankSelectedInline: {
    borderColor: '#47D6B6',
    backgroundColor: '#E6F9F5',
    color: '#3D5A80',
    fontFamily: 'OutfitBold',
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
