import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FormLogin from './FormLogin';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: true}}>
                <Stack.Screen name="Home" component={FormLogin} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
