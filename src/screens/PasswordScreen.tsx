import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import InputWrapper from "../components/inputWrapper";

export default function PasswordScreen({navigation}: any) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    //criar verificação de senha, criar verificação em tempo real para ver se tem o limiar de caracteres necessarios
    const handlePress = () => {
        Alert.alert(
            'Sucesso',
            'Conta criada com sucesso!',
            [
                { text: 'OK', onPress: () => navigation.navigate('Home') }
            ]
        )
    }
    return(
        <View style={styles.container}>
            <Image source={require('../../assets/home_recicla_ai.png')} style={styles.image} />
            <Text style={styles.title}>Cadastro</Text>
            <InputWrapper
                label="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
            />
            <InputWrapper
                label="Confirme a Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TouchableOpacity 
                style={styles.button}
                onPress={() => {
                    //verificar se as senhas são iguais, dentre outras validações!
                    handlePress()
                }}>
                <Text style={styles.text}>Criar Conta</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        //justifyContent: "center",
        backgroundColor: '#ffffff',
    }, 
    image: {
        width: 200,
        height: 200,
    },
    title: { 
        color: '#797070ff',
        fontWeight: "bold",
        fontSize: 30,
        marginBottom: 20
    },
    button: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#47cb6dff',
        borderRadius: 20,
        paddingHorizontal: 40,
    },
    text: {
        fontWeight: "bold",
        color:"#FFF"
    }
});