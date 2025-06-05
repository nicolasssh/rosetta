  const [deleting, setDeleting] = useState(false);

  // Suppression du compte utilisateur (dark pattern: bouton discret, confirmation, suppression Firestore)
  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete your account?',
      'This action is irreversible. All your data will be lost. Are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, delete', style: 'destructive', onPress: async () => {
            setDeleting(true);
            try {
              const user = getCurrentUser();
              if (user) {
                // Supprime le document Firestore (mais pas l'utilisateur Firebase Auth)
                const { doc, deleteDoc } = await import('firebase/firestore');
                const { db } = await import('../../firebaseConfig');
                await deleteDoc(doc(db, 'users', user.uid));
                await logoutUser();
                router.replace('/onboarding');
              }
            } catch (e) {
              Alert.alert('Error', 'Could not delete account');
            } finally {
              setDeleting(false);
            }
          }
        }
      ]
    );
  };
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from '../components/Checkbox';
import Select from '../components/Select';
import { getCurrentUser, getUserProfile, logoutUser, updateUserProfile } from '../controllers/userController';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
      router.replace('/onboarding');
    } catch (e) {
      Alert.alert('Error', 'Could not log out');
    } finally {
      setLoggingOut(false);
    }
  };
const FREQUENCY_OPTIONS = [
  { label: '10-15min/day', value: '15' },
  { label: '1h/day', value: '60' },
  { label: '3h/day', value: '180' },
];

const LEVEL_OPTIONS = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

const INTERESTS_OPTIONS = [
  { id: 'travel', label: 'Travel 🧳' },
  { id: 'culture', label: 'Culture & Art 🎨' },
  { id: 'kitchen', label: 'Kitchen 🍳' },
  { id: 'literature', label: 'Literature & Poetry 📚' },
  { id: 'sports', label: 'Sport & Wellness 🏃' },
  { id: 'technology', label: 'Science & Technology ⚗️' },
  { id: 'general', label: 'Daily conversations 💬' },
];

function getAvatarUrl(name: string) {
  // Utilise DiceBear PNG pour générer un avatar compatible React Native
  return `https://api.dicebear.com/7.x/thumbs/png?seed=${encodeURIComponent(name)}`;
}



  useEffect(() => {
    const fetchProfile = async () => {
      const user = getCurrentUser();
      if (user) {
        const data = await getUserProfile(user.uid);
        setProfile(data);
        setForm(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };
  const handleChange = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleInterestToggle = (interestId: string, isChecked: boolean) => {
    let current = Array.isArray(form.interests) ? form.interests : [];
    if (isChecked) {
      if (!current.includes(interestId)) current = [...current, interestId];
    } else {
      current = current.filter((id: string) => id !== interestId);
    }
    setForm({ ...form, interests: current });
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const user = getCurrentUser();
      if (user) {
        await updateUserProfile(user.uid, form);
        setProfile(form);
        setEditing(false);
        Alert.alert('Profile updated!');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#47D6B6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: getAvatarUrl(form.firstname || form.email || 'User') }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={styles.name}>{form.firstname} {form.lastname}</Text>
          <Text style={styles.email}>{form.email}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Profile info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>First name</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={form.firstname}
                onChangeText={v => handleChange('firstname', v)}
                placeholder="First name"
              />
            ) : (
              <Text style={styles.infoValue}>{form.firstname}</Text>
            )}
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last name</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={form.lastname}
                onChangeText={v => handleChange('lastname', v)}
                placeholder="Last name"
              />
            ) : (
              <Text style={styles.infoValue}>{form.lastname}</Text>
            )}
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{form.email}</Text>
          </View>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {/* Frequency */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Frequency</Text>
            {editing ? (
              <View style={{ flex: 1 }}>
                <Select
                  label=""
                  options={FREQUENCY_OPTIONS}
                  onSelectionChange={v => handleChange('frequency', v)}
                  placeholder={FREQUENCY_OPTIONS.find(opt => opt.value === form.frequency)?.label || 'Select frequency'}
                  style={{ minWidth: 120 }}
                  textStyle={{ color: '#222' }}
                />
              </View>
            ) : (
              <Text style={styles.infoValue}>
                {FREQUENCY_OPTIONS.find(opt => opt.value === form.frequency)?.label || form.frequency}
              </Text>
            )}
          </View>
          {/* Level */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Level</Text>
            {editing ? (
              <View style={{ flex: 1 }}>
                <Select
                  label=""
                  options={LEVEL_OPTIONS}
                  onSelectionChange={v => handleChange('level', v)}
                  placeholder={LEVEL_OPTIONS.find(opt => opt.value === form.level)?.label || 'Select level'}
                  style={{ minWidth: 120 }}
                  textStyle={{ color: '#222' }}
                />
              </View>
            ) : (
              <Text style={styles.infoValue}>
                {LEVEL_OPTIONS.find(opt => opt.value === form.level)?.label || form.level}
              </Text>
            )}
          </View>
          {/* Interests */}
          <View style={[styles.infoRow, { alignItems: 'flex-start' }]}> 
            <Text style={[styles.infoLabel, { marginTop: 6 }]}>Interests</Text>
            <View style={{ flex: 1 }}>
              {editing ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {INTERESTS_OPTIONS.map(opt => (
                    <Checkbox
                      key={opt.id}
                      label={opt.label}
                      initialValue={Array.isArray(form.interests) ? form.interests.includes(opt.id) : false}
                      onToggle={checked => handleInterestToggle(opt.id, checked)}
                      style={{ marginRight: 8, marginBottom: 4 }}
                    />
                  ))}
                </View>
              ) : (
                <Text style={styles.infoValue}>
                  {Array.isArray(form.interests) && form.interests.length > 0
                    ? INTERESTS_OPTIONS.filter(opt => form.interests.includes(opt.id)).map(opt => opt.label).join(', ')
                    : '—'}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.buttonRow}>
          {editing ? (
            <>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={saving}>
                <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel} disabled={saving}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
                <Text style={styles.buttonText}>Edit profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#888' }]} onPress={handleLogout} disabled={loggingOut}>
                <Text style={styles.buttonText}>{loggingOut ? 'Logging out...' : 'Log out'}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={{ width: '100%', marginTop: 16 }}>
          <TouchableOpacity onPress={handleDeleteAccount} disabled={deleting} style={{ alignSelf: 'center', opacity: deleting ? 0.5 : 0.4 }}>
            <Text style={{ color: '#E76F51', fontSize: 13, textDecorationLine: 'underline', fontFamily: 'Outfit', textAlign: 'center' }}>
              Delete my account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E6F9F5',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontFamily: 'OutfitBold',
    color: '#222',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Outfit',
    marginBottom: 8,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'OutfitBold',
    color: '#3D5A80',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    width: 90,
    fontSize: 14,
    color: '#444',
    fontFamily: 'Outfit',
  },
  infoValue: {
    fontSize: 14,
    color: '#222',
    fontFamily: 'Outfit',
    flex: 1,
  },
  input: {
    fontSize: 14,
    color: '#222',
    fontFamily: 'Outfit',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginHorizontal: 4,
    marginTop: 8,
  },
  editButton: {
    backgroundColor: '#47D6B6',
  },
  saveButton: {
    backgroundColor: '#47D6B6',
  },
  cancelButton: {
    backgroundColor: '#E76F51',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'OutfitBold',
    fontSize: 15,
  },
});