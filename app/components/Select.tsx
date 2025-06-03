import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  options: Option[];
  onSelectionChange: (selectedValue: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export default function Select({ label, options, onSelectionChange, placeholder = "Select an option", style, textStyle, labelStyle }: SelectProps) {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelection = (value: string) => {
    setSelectedValue(value);
    setIsModalVisible(false);
    onSelectionChange(value);
  };

  const getDisplayText = () => {
    const selectedOption = options.find(option => option.value === selectedValue);
    return selectedOption ? selectedOption.label : placeholder;
  };

  return (
    <View style={style}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TouchableOpacity style={[styles.select]} onPress={() => setIsModalVisible(true)}>
        <Text style={[styles.placeholder, textStyle]}>{getDisplayText()}</Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                    style={[
                      styles.option,
                      index === options.length - 1 && { borderBottomWidth: 0 }
                    ]}
                    onPress={() => handleSelection(item.value)}
                >
                    <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
            )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Outfit',
    marginBottom: 8,
  },
  select: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 40,
    gap: 10,
    width: '100%',
    maxWidth: 362,
    height: 51,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#FF8552',
    borderRadius: 40,
  },
  placeholder: {
    flex: 1,
    height: 31,
    fontFamily: 'Outfit',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 31,
    textAlign: 'center',
    color: '#000000',
  },
  arrow: {
    fontSize: 12,
    color: '#000000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Outfit',
    color: '#000000',
    textAlign: 'center',
  },
});