import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface InputProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'date';
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  labelStyle?: TextStyle;
  initialValue?: string;
}

export default function Input({ 
  label, 
  type, 
  onValueChange, 
  placeholder = "Enter text", 
  style, 
  textStyle, 
  labelStyle,
  initialValue = ''
}: InputProps) {
  const [value, setValue] = useState<string>(initialValue);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleValueChange = (text: string) => {
    setValue(text);
    onValueChange(text);
  };

  const handleDateSelection = (selectedDate: string) => {
    setValue(selectedDate);
    setIsDatePickerVisible(false);
    onValueChange(selectedDate);
  };

  const generateDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push({ label: i.toString().padStart(2, '0'), value: i.toString().padStart(2, '0') });
    }
    return days;
  };

  const generateMonths = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.map((month, index) => ({
      label: month,
      value: (index + 1).toString().padStart(2, '0')
    }));
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 100; i--) {
      years.push({ label: i.toString(), value: i.toString() });
    }
    return years;
  };

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const formatDate = () => {
    if (selectedDay && selectedMonth && selectedYear) {
      const monthName = generateMonths().find(m => m.value === selectedMonth)?.label;
      return `${selectedDay}/${monthName}/${selectedYear}`;
    }
    return '';
  };

  const confirmDateSelection = () => {
    const formattedDate = formatDate();
    if (formattedDate) {
      handleDateSelection(formattedDate);
    }
  };

  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'date':
        return 'numeric';
      default:
        return 'default';
    }
  };

  const getAutoCapitalize = () => {
    return type === 'email' ? 'none' : 'sentences';
  };

  return (
    <View style={style}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      {type === 'date' ? (
        <TouchableOpacity 
          style={[styles.inputStyle, styles.dateButton]} 
          onPress={() => setIsDatePickerVisible(true)}
        >
          <Text style={[styles.dateText, textStyle]}>
            {value || placeholder}
          </Text>
          <Text style={styles.arrow}>📅</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[
              styles.inputStyle, 
              textStyle,
              type === 'password' && styles.inputWithIcon
            ]}
            value={value}
            onChangeText={handleValueChange}
            placeholder={placeholder}
            placeholderTextColor="#999999"
            secureTextEntry={type === 'password' && !isPasswordVisible}
            keyboardType={getKeyboardType()}
            autoCapitalize={getAutoCapitalize()}
            autoCorrect={type !== 'email'}
          />
          {type === 'password' && (
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Text style={styles.eyeIcon}>
                {isPasswordVisible ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {type === 'date' && (
        <Modal
          visible={isDatePickerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsDatePickerVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setIsDatePickerVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Date</Text>
              
              <View style={styles.datePickerContainer}>
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>Day</Text>
                  <FlatList
                    data={generateDays()}
                    keyExtractor={(item) => item.value}
                    style={styles.pickerList}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.pickerItem,
                          selectedDay === item.value && styles.selectedPickerItem
                        ]}
                        onPress={() => setSelectedDay(item.value)}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedDay === item.value && styles.selectedPickerItemText
                        ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>

                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>Month</Text>
                  <FlatList
                    data={generateMonths()}
                    keyExtractor={(item) => item.value}
                    style={styles.pickerList}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.pickerItem,
                          selectedMonth === item.value && styles.selectedPickerItem
                        ]}
                        onPress={() => setSelectedMonth(item.value)}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedMonth === item.value && styles.selectedPickerItemText
                        ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>

                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>Year</Text>
                  <FlatList
                    data={generateYears()}
                    keyExtractor={(item) => item.value}
                    style={styles.pickerList}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.pickerItem,
                          selectedYear === item.value && styles.selectedPickerItem
                        ]}
                        onPress={() => setSelectedYear(item.value)}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedYear === item.value && styles.selectedPickerItemText
                        ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmDateSelection}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
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
  inputStyle: {
    width: '100%',
    maxWidth: 362,
    height: 51,
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#FF8552',
    borderRadius: 40,
    fontFamily: 'Outfit',
    fontWeight: '400',
    fontSize: 16,
    textAlign: 'center',
    color: '#000000',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  inputWithIcon: {
    paddingRight: 75,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  dateText: {
    flex: 1,
    fontFamily: 'Outfit',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 31,
    textAlign: 'center',
    color: '#000000',
  },
  arrow: {
    fontSize: 16,
    color: '#000000',
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 16,
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
    width: '85%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'OutfitBold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerLabel: {
    fontSize: 14,
    fontFamily: 'OutfitBold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
  },
  pickerList: {
    maxHeight: 150,
  },
  pickerItem: {
    padding: 8,
    alignItems: 'center',
    borderRadius: 5,
  },
  selectedPickerItem: {
    backgroundColor: '#FF8552',
  },
  pickerItemText: {
    fontSize: 14,
    fontFamily: 'Outfit',
    color: '#000000',
  },
  selectedPickerItemText: {
    color: 'white',
    fontFamily: 'OutfitBold',
  },
  confirmButton: {
    backgroundColor: '#47D6B6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OutfitBold',
  },
});