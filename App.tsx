import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import FormRegister from '@/components/FormRegister';
import HomeScreen from '@/components/HomeScreen';
import './global.css';
import { View } from 'react-native';
import AppNavigation from '@/components/AppNavigation';

export default function App() {
  return (
      <AppNavigation/>
  );
}
