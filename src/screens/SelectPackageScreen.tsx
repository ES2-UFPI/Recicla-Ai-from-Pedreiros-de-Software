import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import Loading from '@/components/loading';
import { InventoryItem } from '@/types/inventoryItem';
import { mockInventory, mockPackages } from '@/data';
import { PackageComponent } from '@/types/packageComponent';
import PackagesComponent from '@/components/package';


// DADOS MOCKADOS!!!

export default function SelectPackageScreen() {
  const [packages, setPackages] = useState<PackageComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  //const currentUserId = 1;
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setInventory(mockInventory);
      setPackages(mockPackages);
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInventory();
    setRefreshing(false);
  };

  if (loading) {
    return <Loading message="Carregando inventário..." />;
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#059669']} />
      }
    >
      <View className="bg-white p-5 shadow">
        <Text className="text-3xl font-bold text-gray-800">Seleção de Pacotes</Text>
        <Text className="mt-1 text-gray-600">Crie ou selecione um pacote para entrega</Text>
      </View>

      {/* Conteúdo */}
      <PackagesComponent
        inventory={inventory}
        setInventory={setInventory}
        packages={packages}
        setPackages={setPackages}
      >
      </PackagesComponent>
    </ScrollView>
  );
}
