import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FormRegister from './FormRegister';
import FormLogin from './FormLogin';
import FormPassword from './FormPassword';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: true}}>
                <Stack.Screen name="Home" component={FormLogin} />
                <Stack.Screen name="FormRegister" component={FormRegister} />
                <Stack.Screen name="FormPassword" component={FormPassword} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
