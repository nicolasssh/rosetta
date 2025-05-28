import React, { useState } from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface CheckboxProps {
  label: string;
  onToggle: (isChecked: boolean) => void;
  initialValue?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Checkbox({ 
  label, 
  onToggle, 
  initialValue = false, 
  style, 
  textStyle 
}: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(initialValue);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onToggle(newValue);
  };

  return (
    <TouchableOpacity 
      style={[
        styles.checkbox,
        isChecked && styles.checkboxSelected,
        style
      ]} 
      onPress={handleToggle}
    >
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 0,
    gap: 10,
    width: 94,
    height: 31,
    backgroundColor: 'rgba(71, 214, 182, 0.5)',
    borderRadius: 40,
  },
  checkboxSelected: {
    backgroundColor: 'rgba(71, 214, 182, 1)',
  },
  text: {
    color: 'white',
    fontSize: 16,
    lineHeight: 31,
    fontFamily: 'Outfit',
    textAlign: 'center',
  },
});