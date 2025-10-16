import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import FormRegister from '@/screens/RegisterScreen';
import HomeScreen from '@/components/HomeScreen';
import './global.css';
import { View } from 'react-native';
import AppNavigation from '@/navigation/AppNavigation';

export default function App() {
  return (
      <AppNavigation/>
  );
}
