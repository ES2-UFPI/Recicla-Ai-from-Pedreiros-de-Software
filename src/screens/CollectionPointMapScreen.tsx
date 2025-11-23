import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MapPin, Navigation, ArrowLeft } from "lucide-react-native";
import { Coordinate } from "@/types/coordinate";

import { CollectionPoint } from "@/types/collectionPoint";
import Card from "@/components/card";
import { mockOffers, mockPoints } from "@/data";

type RootStackParamList = {
  Map: {
    newCollectionPoint?: CollectionPoint;
    origin?: Coordinate | null;
  };
  LocationPicker: {
    coords: {
      latitude: number;
      longitude: number;
    };
  };
  Home: {
    offer?: any;
    collectionPoint?: CollectionPoint;
  };
};

export default function CollectionPointMapScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Map'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mapRef = useRef<MapView>(null);
  const state = navigation.getState();
  const rotas = state.routes;
  const index = state.index;
  const rotaAnterior = rotas[index - 1]?.name;

  const { newCollectionPoint, origin } = route.params || {};

  useEffect(() => {
    // Ajustar a câmera para mostrar origem e destino
    if (mapRef.current && origin && newCollectionPoint) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(
          [
            { latitude: origin.latitude, longitude: origin.longitude },
            { latitude: newCollectionPoint.latitude, longitude: newCollectionPoint.longitude },
          ],
          {
            edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
            animated: true,
          }
        );
      }, 500);
    } else if (mapRef.current && newCollectionPoint) {
      // Se não houver origem, centralizar apenas no ponto de coleta
      mapRef.current.animateToRegion({
        latitude: newCollectionPoint.latitude,
        longitude: newCollectionPoint.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [origin, newCollectionPoint]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: newCollectionPoint?.latitude || origin?.latitude || -5.0892,
          longitude: newCollectionPoint?.longitude || origin?.longitude || -42.8019,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marcador de Origem (Localização atual) */}
        {origin && (
          <Marker
            coordinate={{
              latitude: origin.latitude,
              longitude: origin.longitude,
            }}
            title="Sua localização"
            description="Você está aqui"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.currentLocationMarker}>
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle} />
              </View>
            </View>
          </Marker>
        )}

        {/* Marcador do Ponto de Coleta */}
        {newCollectionPoint && (
          <Marker
            coordinate={{
              latitude: newCollectionPoint.latitude,
              longitude: newCollectionPoint.longitude,
            }}
            title="Ponto de Coleta"
            description={newCollectionPoint.address}
            pinColor="#3b82f6"
          />
        )}
      </MapView>

      {/* Header com botão de voltar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color="#111827" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Card de informações do ponto de coleta */}
      {newCollectionPoint && (
        <Card title="Ponto de Coleta" address={newCollectionPoint.address} />
      )}

      {/* Botão de confirmar (para salvar no database) */}
      {newCollectionPoint && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              // TODO: Salvar no database aqui
              if (rotaAnterior === 'LocationPicker'){
                console.log('Salvando ponto de coleta:', newCollectionPoint);
                mockPoints.push(newCollectionPoint);
                navigation.goBack();
              }
              else {
                //cria oferta de coleta
                // vai navegar  para outra aba, nao é a de historico e nao pode voltar para a tela de selecao de ponto de coleta
                navigation.navigate('Home',
                  { 
                    screen: 'Histórico',
                    params: { 
                      offer: mockOffers.at(-1),
                      collectionPoint: newCollectionPoint
                    }
                  } as never);
              }
              
              
            }}
            activeOpacity={0.9}
          >
            <Text style={styles.confirmButtonText}>Confirmar Ponto de Coleta</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  coordsContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  coordsText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  confirmButton: {
    height: 56,
    backgroundColor: '#3b82f6',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  currentLocationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  innerCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4285F4',
  },
});