import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text
} from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function Profile() {

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Work in progress</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
    fontFamily: 'OutfitBold',
  }
});