import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import PasswordScreen from '../screens/PasswordScreen';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: true}}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Password" component={PasswordScreen} />
                <Stack.Screen name="Home" component={BottomTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
