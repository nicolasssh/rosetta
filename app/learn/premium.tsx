
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Premium() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Premium Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Get premium now</Text>
        <Text style={styles.bannerSubtitle}>Unlock all the content of Rosetta</Text>
      </View>

      {/* Advantages */}
      <View style={styles.advantageCard}>
        <Text style={styles.advantageIcon}>✨</Text>
        <View style={styles.advantageTextContainer}>
          <Text style={styles.advantageTitle}>Exclusive content</Text>
          <Text style={styles.advantageDesc}>Access advanced lessons and exclusive content for faster progress</Text>
        </View>
      </View>
      <View style={styles.advantageCard}>
        <Text style={styles.advantageIcon}>💬</Text>
        <View style={styles.advantageTextContainer}>
          <Text style={styles.advantageTitle}>Personal AI assistant</Text>
          <Text style={styles.advantageDesc}>Get personalized answers and detailed explanations at any time</Text>
        </View>
      </View>
      <View style={styles.advantageCard}>
        <Text style={styles.advantageIcon}>📖</Text>
        <View style={styles.advantageTextContainer}>
          <Text style={styles.advantageTitle}>Unlimited exercises</Text>
          <Text style={styles.advantageDesc}>Unlimited practice with thousands of additional exercises</Text>
        </View>
      </View>
      <View style={styles.advantageCard}>
        <Text style={styles.advantageIcon}>📶</Text>
        <View style={styles.advantageTextContainer}>
          <Text style={styles.advantageTitle}>Offline mode</Text>
          <Text style={styles.advantageDesc}>Download lessons and practice anywhere, anytime</Text>
        </View>
      </View>

      {/* Fixed trial button */}
      <View style={styles.trialButtonContainer}>
        <TouchableOpacity style={styles.trialButton} activeOpacity={0.85}>
          <Text style={styles.trialButtonText}>Start a 7 days free trial</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    padding: 20,
    paddingBottom: 90, // leave space for fixed button
  },
  banner: {
    backgroundColor: '#3D5A80',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  bannerTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'OutfitBold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Outfit',
    opacity: 0.85,
  },
  advantageCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  advantageIcon: {
    fontSize: 28,
    marginRight: 16,
    width: 36,
    textAlign: 'center',
  },
  advantageTextContainer: {
    flex: 1,
  },
  advantageTitle: {
    fontSize: 16,
    fontFamily: 'OutfitBold',
    color: '#222',
    marginBottom: 2,
  },
  advantageDesc: {
    fontSize: 14,
    fontFamily: 'Outfit',
    color: '#444',
    opacity: 0.85,
  },
  trialButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    padding: 20,
    alignItems: 'center',
  },
  trialButton: {
    backgroundColor: '#47D6B6',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#47D6B6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  trialButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OutfitBold',
  },
});