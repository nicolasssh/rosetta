import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useSegments } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NavItem {
  name: string;
  icon: string;
  iconLibrary: 'Ionicons' | 'MaterialIcons';
  route: string;
  segment: string;
}

const navItems: NavItem[] = [
  {
    name: 'Learn',
    icon: 'book',
    iconLibrary: 'Ionicons',
    route: '/learn/index',
    segment: 'learn',
  },
  {
    name: 'Rewards',
    icon: 'gift',
    iconLibrary: 'Ionicons',
    route: '/learn/rewards',
    segment: 'rewards',
  },
  {
    name: 'Premium',
    icon: 'workspace-premium',
    iconLibrary: 'MaterialIcons',
    route: '/learn/premium',
    segment: 'premium',
  },
  {
    name: 'Account',
    icon: 'person',
    iconLibrary: 'Ionicons',
    route: '/learn/profile',
    segment: 'profile',
  },
];

export default function BottomNavigation() {
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  
  // Gérer le cas où vous avez "index" au lieu de "home"
  let currentSegment = segments[segments.length - 1];
  if (String(currentSegment) === 'index') {
    currentSegment = 'learn';
  }

  const handleNavPress = (route: string) => {
    // Adapter pour votre structure si vous utilisez "index"
    if (route === '/learn/index') {
      router.push('/learn/' as any);
    } else {
      router.push(route as any);
    }
  };

  const renderIcon = (item: NavItem, isActive: boolean) => {
    const iconColor = isActive ? '#4F63AC' : '#8E8E93';
    const IconComponent = item.iconLibrary === 'Ionicons' ? Ionicons : MaterialIcons;
    
    return (
      <IconComponent 
        name={item.icon as any} 
        size={24} 
        color={iconColor} 
      />
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {navItems.map((item) => {
        const isActive = currentSegment === item.segment;
        
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => handleNavPress(item.route)}
            activeOpacity={0.7}
          >
            {renderIcon(item, isActive)}
            <Text style={[
              styles.navText, 
              { color: isActive ? '#4F63AC' : '#8E8E93' }
            ]}>
              {item.name}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -12,
    width: 32,
    height: 2,
    backgroundColor: '#4F63AC',
    borderRadius: 1,
  },
});