import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser, getUserProfile } from '../controllers/userController';

const { width } = Dimensions.get('window');

function getGrade(totalMinutes: number): { grade: string; message: string } {
  if (totalMinutes >= 1000) return { grade: 'A+', message: 'Incredible! You are a language master!' };
  if (totalMinutes >= 500) return { grade: 'A', message: 'Amazing! You are a language pro!' };
  if (totalMinutes >= 200) return { grade: 'B', message: 'Great job! Keep up the good work!' };
  if (totalMinutes >= 100) return { grade: 'C', message: 'Nice! You are making real progress!' };
  if (totalMinutes >= 30) return { grade: 'D', message: 'Good start! Keep going!' };
  return { grade: 'E', message: 'Let’s get started! Every minute counts.' };
}

export default function Rewards() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#47D6B6" />
      </SafeAreaView>
    );
  }

  const progress = profile?.progress || {};
  const totalMinutes = Object.values(progress).reduce((sum: number, v: any) => sum + (typeof v === 'number' ? v : 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(2);
  const { grade, message } = getGrade(totalMinutes);

  const isZero = totalMinutes === 0;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.celebrateContainer}>
        <Image source={require('../../assets/images/trophy.png')} style={styles.trophy} />
        <Text style={styles.congrats}>
          {isZero ? "Let's get started!" : 'Congratulations!'}
        </Text>
        <Text style={styles.subtitle}>
          {isZero ? "You haven't started learning yet." : "You’ve spent"}
        </Text>
        <Text style={styles.time}>{totalHours} hours</Text>
        <Text style={styles.subtitle}>
          {isZero ? "Start your first lesson to see your progress here." : "learning languages 🎉"}
        </Text>
        <View style={styles.gradeBox}>
          <Text style={styles.gradeLabel}>Your grade</Text>
          <Text style={styles.grade}>{grade}</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrateContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  trophy: {
    width: 90,
    height: 90,
    marginBottom: 18,
    resizeMode: 'contain',
  },
  congrats: {
    fontSize: 28,
    fontFamily: 'OutfitBold',
    color: '#47D6B6',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Outfit',
    textAlign: 'center',
  },
  time: {
    fontSize: 36,
    fontFamily: 'OutfitBold',
    color: '#4F63AC',
    marginVertical: 8,
    textAlign: 'center',
  },
  gradeBox: {
    backgroundColor: '#E6F9F5',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginVertical: 18,
    alignItems: 'center',
  },
  gradeLabel: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Outfit',
  },
  grade: {
    fontSize: 40,
    fontFamily: 'OutfitBold',
    color: '#47D6B6',
    marginTop: 2,
  },
  message: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Outfit',
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 320,
  },
});