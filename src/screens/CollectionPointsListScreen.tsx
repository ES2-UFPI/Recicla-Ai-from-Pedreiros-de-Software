import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MapPin, Search, Trash2, Navigation2 } from "lucide-react-native";
import { CollectionPoint } from "@/types/collectionPoint";
import { mockPoints } from "@/data";
import { useRoute, RouteProp } from "@react-navigation/native";


type RootStackParamList = {
  CollectionPointsList: undefined;
  CollectionPointMap: {
    newCollectionPoint?: CollectionPoint;
    origin?: { latitude: number; longitude: number } | null;
    idPackage?: number;
  };
};

export default function CollectionPointsListScreen() {
  const route = useRoute<RouteProp<any, any>>();
  const idPackage = route.params?.idPackage;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState("");
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([]);
  const [filteredPoints, setFilteredPoints] = useState<CollectionPoint[]>([]);

  useEffect(() => {
    loadCollectionPoints();
  }, []);

  useEffect(() => {
    // Filtrar pontos de coleta baseado na busca
    if (searchText.trim() === "") {
      setFilteredPoints(collectionPoints);
    } else {
      const filtered = collectionPoints.filter(point =>
        point.address.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPoints(filtered);
    }
  }, [searchText, collectionPoints]);

  const loadCollectionPoints = async () => {
    try {
      // TODO: Buscar do database
      // const response = await fetch('YOUR_API_URL/collection-points');
      // const data = await response.json();
      // setCollectionPoints(data);

      // Dados mockados para exemplo
      const points = mockPoints;

      setCollectionPoints(points);
      setFilteredPoints(points);
    } catch (error) {
      console.error("Erro ao carregar pontos de coleta:", error);
    }
  };

  const deleteCollectionPoint = async (pointId: string) => {
    try {
      // TODO: Deletar do database
      // await fetch(`YOUR_API_URL/collection-points/${pointId}`, {
      //   method: 'DELETE',
      // });

      // Remover da lista local
      setCollectionPoints(prev => prev.filter(point => point.id !== pointId));
      console.log("Ponto de coleta deletado:", pointId);
    } catch (error) {
      console.error("Erro ao deletar ponto:", error);
    }
  };

  const navigateToPoint = (point: CollectionPoint, idPackage: number) => {
    navigation.navigate('CollectionPointMap', {
      newCollectionPoint: point,
      origin: null,
      idPackage: idPackage, // ou passar a localização atual se disponível
    });
  };

  const renderCollectionPoint = ({ item }: { item: CollectionPoint }) => (
    <TouchableOpacity
      style={styles.pointCard}
      onPress={() => navigateToPoint(item, idPackage)}
      activeOpacity={0.7}
    >
      <View style={styles.pointIconContainer}>
        <MapPin size={22} color="#3b82f6" strokeWidth={2.5} />
      </View>

      <View style={styles.pointInfo}>
        <Text style={styles.pointAddress} numberOfLines={2}>
          {item.address}
        </Text>
        
        <View style={styles.pointMeta}>
          {item.distance && (
            <View style={styles.distanceContainer}>
              <Navigation2 size={14} color="#6b7280" />
              <Text style={styles.distanceText}>{item.distance.toFixed(1)} km</Text>
            </View>
          )}
          <Text style={styles.dateText}>
            Criado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={(e) => {
          e.stopPropagation();
          deleteCollectionPoint(item.id);
        }}
        activeOpacity={0.7}
      >
        <Trash2 size={20} color="#ef4444" strokeWidth={2} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pontos de Coleta</Text>
        <Text style={styles.headerSubtitle}>
          {filteredPoints.length} {filteredPoints.length === 1 ? 'ponto cadastrado' : 'pontos cadastrados'}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Search size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.inputText}
            placeholder="Buscar pontos de coleta..."
            placeholderTextColor="#9ca3af"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {filteredPoints.length === 0 ? (
        <View style={styles.emptyState}>
          <MapPin size={64} color="#d1d5db" strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>
            {searchText ? 'Nenhum resultado encontrado' : 'Nenhum ponto cadastrado'}
          </Text>
          <Text style={styles.emptyText}>
            {searchText 
              ? 'Tente buscar com outros termos'
              : 'Adicione pontos de coleta para começar'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPoints}
          keyExtractor={(item) => item.id}
          renderItem={renderCollectionPoint}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchIcon: {
    marginRight: 10,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pointCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  pointIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pointInfo: {
    flex: 1,
  },
  pointAddress: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 20,
  },
  pointMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#fef2f2',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});