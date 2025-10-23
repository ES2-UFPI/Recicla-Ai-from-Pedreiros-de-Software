import { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";
import { 
    Keyboard, 
    StyleSheet, 
    TextInput, 
    TouchableWithoutFeedback, 
    TouchableOpacity,
    View, 
    Text, 
    Image
} from "react-native";
import InputWrapper from "../components/inputWrapper";

export default function LoginScreen({navigation}: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Image
                    source={require("../../assets/home_recicla_ai.png")}
                    style={styles.image}
                />
                <InputWrapper
                    label="Email"
                    value={email}
                    onChangeText={(newText) => setEmail(newText.trim())}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Senha</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput 
                            style={[styles.input, styles.passwordInput]} 
                            value={password}
                            onChangeText={(newText) => setPassword(newText)}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TouchableOpacity 
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            {password != '' ?(
                                showPassword ? (
                                    <Eye size={20} color="#666" />
                                ) : (
                                    <EyeOff size={20} color="#666" />
                                )) : <></>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity 
                    style={styles.buttonLogin}
                    onPress={
                        // Implementar lógica de autenticação aqui
                        () => navigation.navigate("Home") 
                    }>
                    <Text style={styles.textButton}>Entrar</Text>
                </TouchableOpacity>
                <View style={{flexDirection: "row", marginTop: 50}}>
                    <Text style={{fontWeight: "bold", color: '#797070ff'}}>Primeiro acesso?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.link}>Clique aqui</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#ffff",
    },
    inputWrapper: {
        width: "80%",
        marginBottom: 15,
    },
    input : {
        height: 50,
        width: "100%",
        borderRadius: 50,
        backgroundColor: "#f6f6f6",
        paddingLeft: 20,
        marginTop: 5,
        //borderWidth:2,
        //borderColor: '#8f8f8f2d',
    },
    passwordContainer: {
        position: 'relative',
        width: "100%",
    },
    passwordInput: {
        paddingRight: 50, // espaço para o ícone
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 20, // centraliza verticalmente (marginTop 5 + (50-20)/2)
        padding: 5,
    },
    label : {
        fontSize: 14,
        fontWeight: '600',
        color: '#797070ff',
        marginLeft: 20,
    },
    buttonLogin : {
        padding: 20,
        backgroundColor: '#47cb6dff',
        paddingHorizontal: 40,
        borderRadius: 20,
    },
    textButton: {
        color: "#ffff",
        fontWeight: "bold",
    },
    image: {
        width: 200,
        height: 200,
    },
    link: {
        color: '#007AFF', // azul padrão de link
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    }
});