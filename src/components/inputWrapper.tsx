import { TextInput, View, Text, StyleSheet } from "react-native";
import { InputWrapperProps} from "../types/inputWrapper";

export default function InputWrapper({label, ...props}: InputWrapperProps) {
    return (
        <View style={styles.inputWrapper}>
            <Text style={styles.label}>{label}</Text>
            <TextInput {...props} style={styles.input} />
        </View>
    );
}

const styles = StyleSheet.create({
    inputWrapper: {
        width: '80%',
        marginBottom: 15,
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
});