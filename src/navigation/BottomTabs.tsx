import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Settings, History, User } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import OptionsScreen from '../screens/OptionsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#666',
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Home':
              return <Home color={color} size={size} />;
            case 'Opções':
              return <Settings color={color} size={size} />;
            case 'Histórico':
              return <History color={color} size={size} />;
            case 'Perfil':
              return <User color={color} size={size} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Opções" component={OptionsScreen} />
      <Tab.Screen name="Histórico" component={HistoryScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
