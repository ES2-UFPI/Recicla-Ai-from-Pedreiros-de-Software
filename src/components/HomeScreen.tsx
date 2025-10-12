import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";

export default function HomeScreen({navigation}: any) {
    return(
        <View style={styles.container}>
            <Image
                source={require("../../assets/home_recicla_ai.png")}
                style={styles.image}
            />
            <TouchableOpacity 
                style={styles.buttonLogin}
                onPress={() => 
                    navigation.navigate('FormLogin') 
                    }
                >
                <Text style={styles.text}>Já possui conta?</Text>
            </TouchableOpacity>
             <TouchableOpacity 
                style={styles.buttonRegister}
                onPress={() => 
                    navigation.navigate('FormRegister')
                    }
                >
                <Text style={styles.text}>Registrar-se</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    image : {
        width: 200,
        height: 200,
        marginTop: 100
    },
    buttonRegister : {
        padding: 20,
        backgroundColor: '#47cb6dff',
        paddingHorizontal: 65,
        borderRadius: 20
    },
    buttonLogin : {
        padding: 20,
        backgroundColor: '#47cb6dff',
        borderRadius: 20,
        marginTop: 200,
        marginBottom: 30,
        paddingHorizontal: 50
    },
    text: {
        fontWeight: "bold",
        color:"#FFF"
    }
});

const stylesTailwind = {
  container: 'flex-1 justify-center items-center bg-white',
  image: 'w-[200px] h-[200px] mt-[100px]',
  buttonLogin: 'mt-[200px] mb-[30px] px-[50px] py-5 bg-[#47cb6d] rounded-2xl',
  buttonRegister: 'px-[65px] py-5 bg-[#47cb6d] rounded-2xl',
  text: 'font-bold text-white',
};