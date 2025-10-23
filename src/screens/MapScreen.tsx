
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Region } from "react-native-maps";
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import Dashboard from "@/components/dashboard";
import MapView from "react-native-maps";


export default function MapScreen() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [region, setRegion] = useState<Region | null>(null);
    const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);

    useEffect(() => {
        (async () => {
            // Request permission to access location
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            // Get current location
            let loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });
            const { latitude, longitude } = loc.coords;
            setCoords(loc.coords);
            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
            setLocation(loc);
        })();
    }, []);
    if (!region) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{ ...region }}
                showsUserLocation={true}>
                {
                    //<Marker coordinate={region} title="Você está aqui" />
                }
            </MapView>
            <Dashboard coords={coords} />
        </View>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});