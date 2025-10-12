import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, View, Platform, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from "lucide-react-native";


export default function FormRegister({navigation}: any) {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    //const [phone, setPhone] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [dateText, setDateText] = useState('');
    const [email, setEmail] = useState('');
    
    // Add more state variables as needed
     const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios'); // mantém aberto no iOS
        setDate(currentDate);
        
        // Formata a data
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        setDateText(`${day}/${month}/${year}`); 
    };  
    
    const fieldVerification = () => {   
        if(name === '' || cpf === '' || dateText === '' || email === ''){
            alert('Por favor, preencha todos os campos.');
            return false;
        }
        return true;
    }
    return(
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
            <View style={styles.container}>
                <Image 
                    source={require('../../assets/home_recicla_ai.png')}
                    style={styles.image} 
                />
                <Text style={styles.title}>Cadastro</Text>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        autoCorrect={false}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={(newText) => setEmail(newText.trim())}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>CPF</Text>
                    <TextInput
                        style={styles.input}
                        value={cpf}
                        onChangeText={setCpf}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Data de Nascimento</Text>
                    <TouchableOpacity 
                        onPress={() => setShowPicker(true)}
                        activeOpacity={0.7}
                        >
                        <View style={[styles.input, styles.dateInput]}>
                            <Text style={dateText ? styles.dateText : styles.placeholder}>{dateText || 'DD/MM/AAAA'}</Text>
                            <Calendar size={20} color="#666" />
                        </View>
                    </TouchableOpacity>
                    
                    {showPicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChange}
                            maximumDate={new Date()} // não permite datas futuras
                            minimumDate={new Date(1900, 0, 1)}
                        />
                    )}
                </View>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => { // Verificar se todos os campos estão preenchidos
                        navigation.navigate('FormPassword');
                    }}>
                    <Text style={styles.textButton}>Avançar</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        //justifyContent: "center",
        backgroundColor: "#fff"
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
        //borderWidth:2,
        //borderColor: '#8f8f8f3d',
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 20,
    },
    dateText: {
        fontSize: 16,
        color: '#000',
    },
    placeholder: {
        fontSize: 16,
        color: '#999',
    },
    button: {
        marginTop: 20,
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#47cb6dff',
        paddingHorizontal: 40,
    },
    textButton:{
        color: "#fff",
        fontWeight: "bold",
    }
})