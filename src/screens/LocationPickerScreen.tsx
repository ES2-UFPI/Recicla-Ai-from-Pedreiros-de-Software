import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import React, { useState, useEffect } from "react";
import { GOOGLE_API_KEY } from "@env";
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { MapPin, Search } from "lucide-react-native";
import { CollectionPoint } from "@/types/collectionPoint";
import { Coordinate } from "@/types/coordinate";

interface Prediction {
    place_id: string;
    description: string;
}

export default function LocationPickerScreen() {
    const route = useRoute<RouteProp<any, any>>();
    const navigation = useNavigation<any>();
    const [origin, setOrigin] = useState<Coordinate | null>(null);
    const [searchText, setSearchText] = useState("");
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const coords = route.params?.coords;

    const API_KEY = GOOGLE_API_KEY;

    useEffect(() => {
        if (coords?.latitude && coords?.longitude) {
            setOrigin({
                latitude: coords.latitude,
                longitude: coords.longitude
            });
        }
    }, [coords]);

    const searchPlaces = async (text: string) => {
        setSearchText(text);

        if (text.length < 1) {
            setPredictions([]);
            return;
        }

        try {
            const locationBias = origin
                ? `&location=${origin.latitude},${origin.longitude}&radius=5000`
                : '';

            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${API_KEY}&language=pt-BR&components=country:br${locationBias}`
            );
            const data = await response.json();

            if (data.predictions) {
                setPredictions(data.predictions);
            }
        } catch (error) {
            console.error("Erro ao buscar endereços:", error);
        }
    };

    const selectPlace = async (placeId: string, description: string) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}&language=pt-BR`
            );
            const data = await response.json();

            if (data.result?.geometry?.location) {
                const { lat, lng } = data.result.geometry.location;

                // Criar objeto do ponto de coleta

                const newCollectionPoint: CollectionPoint = {
                    id: `collection_${Date.now()}`, // ID temporário
                    latitude: lat,
                    longitude: lng,
                    address: description,
                    createdAt: new Date(),
                };

                console.log('Novo ponto de coleta criado: ', { lat, lng, description });

                // TODO: Persistir no database
                // await saveCollectionPointToDatabase(newCollectionPoint);
                // Exemplo:
                // const response = await fetch('YOUR_API_URL/collection-points', {
                //   method: 'POST',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify(newCollectionPoint)
                // });

                // Navegar para o mapa com o novo ponto de coleta
                navigation.navigate('CollectionPointMap', {
                    newCollectionPoint: newCollectionPoint,
                    origin: origin,
                });
            }
        } catch (error) {
            console.error("Erro ao obter detalhes:", error);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                {/*}
            {origin && (
                <View style={styles.originCard}>
                    <View style={styles.iconContainer}>
                        <Navigation size={20} color="#10b981" strokeWidth={2.5} />
                    </View>
                    <Text style={styles.originText}>Sua localização atual</Text>
                </View>
            )}
            */}

                <View style={styles.searchContainer}>
                    <View style={styles.searchInputWrapper}>
                        <Search size={20} color="#9ca3af" style={styles.searchIcon} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Digite o endereço"
                            placeholderTextColor="#9ca3af"
                            value={searchText}
                            onChangeText={searchPlaces}
                        //no emojis keyboard
                        />
                    </View>

                    {predictions.length > 0 && (
                        <FlatList
                            data={predictions}
                            keyExtractor={(item) => item.place_id}
                            style={styles.listView}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.predictionItem}
                                    onPress={() => selectPlace(item.place_id, item.description)}
                                    activeOpacity={0.7}
                                >
                                    <MapPin size={18} color="#6b7280" style={styles.predictionIcon} />
                                    <Text style={styles.predictionText} numberOfLines={2}>
                                        {item.description}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>



                <TouchableOpacity
                    style={styles.mapPickerButton}
                    onPress={() => {
                        // Voltar para o mapa para selecionar manualmente
                        navigation.goBack();
                    }}
                    activeOpacity={0.8}
                >
                    <MapPin size={20} color="#3b82f6" strokeWidth={2.5} />
                    <Text style={styles.mapPickerText}>Selecione no mapa</Text>
                </TouchableOpacity>
                {/*
            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>💡 Dica</Text>
                <Text style={styles.infoText}>
                    Busque um endereço ou local específico para criar um novo ponto de coleta de resíduos.
                </Text>
            </View>
            */}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    originCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 20,
        padding: 16,
        backgroundColor: "#f0fdf4",
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#10b981",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#d1fae5",
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    originText: {
        fontSize: 15,
        fontWeight: '600',
        color: "#065f46",
        flex: 1,
    },
    searchContainer: {
        marginTop: 24,
        width: "90%",
        alignSelf: "center",
        zIndex: 1,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: 28,
        backgroundColor: "#f9fafb",
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    inputText: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
    },
    listView: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginTop: 8,
        maxHeight: 300,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    predictionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    predictionIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    predictionText: {
        flex: 1,
        fontSize: 15,
        color: '#374151',
        lineHeight: 20,
    },
    mapPickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        width: "90%",
        borderRadius: 28,
        backgroundColor: "#eff6ff",
        marginTop: 16,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: "#bfdbfe",
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    mapPickerText: {
        fontSize: 16,
        fontWeight: '600',
        color: "#2563eb",
        marginLeft: 8,
    },
    infoCard: {
        marginTop: 24,
        marginHorizontal: 20,
        padding: 16,
        backgroundColor: "#fef3c7",
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#f59e0b",
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: "#92400e",
        marginBottom: 6,
    },
    infoText: {
        fontSize: 14,
        color: "#78350f",
        lineHeight: 20,
    },
});