import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function Button({ text, onPress, disabled = false }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.buttonDisabled]} 
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: '#47D6B6',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 9999, // Totalement arrondi
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
    opacity: 0.6,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OutfitBold',
    lineHeight: 31,
  },
  textDisabled: {
    color: '#CCCCCC',
  },
});