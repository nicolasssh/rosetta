import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';

export default function DashboardLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { 
            backgroundColor: '#F5F5F7',
            flex: 1,
          },
          presentation: 'card',
          animation: 'none',
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="rewards" 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="premium" 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="profile" 
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
});