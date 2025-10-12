import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
export default function FormPassword({navigation}: any) {
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
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Confirme a Senha</Text>
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => {
                    //verificar se as senhas são iguais, dentre outras validações
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
    inputWrapper: {
        width: '80%',
        marginBottom: 15
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#797070ff',
        marginLeft: 20,
    },
    input: {
        height: 50,
        width: "100%",
        borderRadius: 50,
        backgroundColor: "#f6f6f6",
        paddingLeft: 20,
        marginTop: 5,
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