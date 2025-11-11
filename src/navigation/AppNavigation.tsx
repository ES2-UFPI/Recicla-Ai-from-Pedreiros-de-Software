import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import PasswordScreen from '../screens/PasswordScreen';
import BottomTabs from './BottomTabs';
import LocationPickerScreen from '../screens/LocationPickerScreen';
import MapScreen from '@/screens/MapScreen';
import CollectionPointMapScreen from '@/screens/CollectionPointMapScreen';
import CollectionPointsListScreen from '@/screens/CollectionPointsListScreen';
import SelectPackageScreen from '@/screens/SelectPackageScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Password" component={PasswordScreen} />
        <Stack.Screen name="Home" component={BottomTabs} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="LocationPicker" component={LocationPickerScreen} />
        <Stack.Screen name="CollectionPointMap" component={CollectionPointMapScreen} />
        <Stack.Screen name="CollectionPointsList" component={CollectionPointsListScreen} />
        <Stack.Screen name="SelectPackage" component={SelectPackageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
