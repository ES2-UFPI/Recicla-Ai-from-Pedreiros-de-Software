import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus, Search } from "lucide-react-native";


//receber a prop que eu passei na tela do mapa
export default function Dashboard({ coords, idPackage }: any) {
    const navigation = useNavigation<any>();
    //por enquanto so esses emojis como botoes
    return (
        <View style={styles.dashboard}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LocationPicker', { coords})}>
                <Text style={styles.text}><Plus /></Text>
            </TouchableOpacity>
            {/* Passar localização atual */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CollectionPointsList', {idPackage})}> 
                <Text style={styles.text}><Search /></Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    dashboard: {
        position: "absolute",
        right: 20,
        top: 160,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 5,
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#a9a9a93a",
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
    },
    text: {
        color: "#000000ff",
        fontSize: 22,
        fontWeight: "bold",
    },
})
