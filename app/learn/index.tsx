import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCurrentUser, getUserProfile } from '../controllers/userController';

const { width } = Dimensions.get('window');

export default function HomePage() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // Calcul de la progression quotidienne réelle
  const today = new Date().toISOString().slice(0, 10);
  const dailyProgress = profile && profile.progress && profile.progress[today] ? profile.progress[today] : 0;
  const dailyGoal = profile && profile.frequency ? Number(profile.frequency) : 60;
  const lessonProgress = 50;

  useEffect(() => {
    const fetchProfile = async () => {
      const user = getCurrentUser();
      if (user) {
        const data = await getUserProfile(user.uid);
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const exercises = [
    {
      id: 1,
      title: 'Oral',
      duration: '10 minutes',
      icon: 'mic',
      color: '#47D6B6',
      backgroundColor: '#E6F9F5',
    },
    {
      id: 2,
      title: 'Fill-the-text',
      duration: '7 minutes',
      icon: 'create',
      color: '#47D6B6',
      backgroundColor: '#E6F9F5',
    },
    {
      id: 3,
      title: 'Definition matcher',
      duration: '5 minutes',
      icon: 'unlink',
      color: '#6B73FF',
      backgroundColor: '#F0F1FF',
    },
    {
      id: 4,
      title: 'Written comprehension',
      duration: '15 minutes',
      icon: 'reader',
      color: '#FF6B6B',
      backgroundColor: '#FFE8E8',
    },
  ];

  const renderProgressBar = (progress: number, total: number, color: string) => {
    const percentage = (progress / total) * 100;
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarBg, { backgroundColor: color + '20' }]}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>
    );
  };

  const renderExerciseCard = (exercise: any) => {
    const handlePress = () => {
      if (exercise.title === 'Oral') {
        router.push('/learn/exercices/oral');
      } else if (exercise.title === 'Written comprehension') {
        router.push('/learn/exercices/write');
      } else if (exercise.title === 'Fill-the-text') {
        router.push('/learn/exercices/text-to-fill');
      } else if (exercise.title === 'Definition matcher') {
        router.push('/learn/exercices/matcher');
      } else {
        console.warn(`No route defined for exercise: ${exercise.title}`);
      }
      // Ajoute ici d'autres routes pour d'autres exercices si besoin
    };
    return (
      <TouchableOpacity
        key={exercise.id}
        style={[styles.exerciseCard, { backgroundColor: exercise.backgroundColor }]}
        activeOpacity={0.7}
        onPress={handlePress}
      >
        <View style={[styles.exerciseIcon, { backgroundColor: exercise.color }]}>
          <Ionicons name={exercise.icon} size={24} color="white" />
        </View>
        <Text style={styles.exerciseTitle}>{exercise.title}</Text>
        <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
      </TouchableOpacity>
    );
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#47D6B6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F5F5F7" barStyle="dark-content" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {profile && profile.firstname ? `Good morning ${profile.firstname} !` : 'Good morning!'}
          </Text>
        </View>

        {/* Daily Challenge */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Daily challenge</Text>
            <Text style={styles.progressText}>
              {dailyProgress >= 60 ? (dailyProgress / 60).toFixed(2) + " h" : dailyProgress + " min"} / {dailyGoal / 60}h
            </Text>
          </View>
          {renderProgressBar(dailyProgress, dailyGoal, '#47D6B6')}
        </View>

        {/* Premium Travel */}
        <TouchableOpacity style={styles.premiumCard} activeOpacity={0.8}>
          <LinearGradient
            colors={['#4F63AC', '#5A6FB8']}
            style={styles.premiumGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.premiumContent}>
              <View style={styles.premiumIcon}>
                <MaterialIcons name="workspace-premium" size={32} color="white" />
              </View>
              <View style={styles.premiumText}>
                <Text style={styles.premiumTitle}>Start a Premium travel</Text>
                <Text style={styles.premiumSubtitle}>
                  Unlock all the content of Rosetta
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push("/learn/premium")} style={styles.tryButton}>
              <Text style={styles.tryButtonText}>Try now</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>

        {/* Continue Progression */}
        <TouchableOpacity style={styles.progressCard} activeOpacity={0.8}>
          <LinearGradient
            colors={['#47D6B6', '#5CE1C3']}
            style={styles.progressGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.progressContent}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Continue progression</Text>
                <View style={styles.languageTag}>
                  <Text style={styles.languageText}>
                    {profile && profile.language ? profile.language : 'Language'}
                  </Text>
                </View>
              </View>
              <Text style={styles.lessonText}>Lesson 3 : Verbs</Text>
              <View style={styles.lessonProgressContainer}>
                <View style={styles.lessonProgressBar}>
                  <View
                    style={[
                      styles.lessonProgressFill,
                      { width: `${lessonProgress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.lessonProgressText}>{lessonProgress}%</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.continueButton}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>

        {/* Recommended Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended exercises</Text>
          <View style={styles.exercisesGrid}>
            {exercises.map((exercise) => renderExerciseCard(exercise))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4F63AC',
  },
  greetingContainer: { // Nouveau style pour le conteneur du salut/chargement
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  progressText: {
    fontSize: 14,
    color: '#47D6B6',
    fontWeight: '500',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  premiumCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  premiumGradient: {
    padding: 20,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumIcon: {
    marginRight: 12,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tryButton: {
    backgroundColor: '#47D6B6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  tryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  progressGradient: {
    padding: 20,
  },
  progressContent: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  languageTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  languageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  lessonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  lessonProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginRight: 12,
  },
  lessonProgressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  lessonProgressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#FF8552',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
  },
  exercisesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exerciseCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
    textAlign: 'center',
  },
  exerciseDuration: {
    fontSize: 12,
    color: '#8E8E93',
  },
});