import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { DraxProvider } from 'react-native-drax';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNavigation from '../components/BottomNavigation';

export default function DashboardLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DraxProvider>
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
      </DraxProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
});