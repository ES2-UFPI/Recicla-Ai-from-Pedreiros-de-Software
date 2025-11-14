import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl} from 'react-native';
import { Package,Box } from 'lucide-react-native';
import Loading from '@/components/loading';
import { InventoryItem } from '@/types/inventoryItem';
import { mockInventory, mockPackages } from '@/data';
import ItensComponent from '@/components/itens';
import { PackageComponent } from '@/types/packageComponent';
import PackagesComponent from '@/components/package';

type TabType = 'items' | 'packages';

// DADOS MOCKADOS!!!

export default function InventoryScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('items');
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
        <Text className="text-3xl font-bold text-gray-800">Meu Inventário</Text>
        <Text className="mt-1 text-gray-600">Gerencie seus itens recicláveis</Text>
      </View>

      {/* Abas */}
      <View className="mx-4 mt-4 flex-row rounded-lg bg-white p-1 shadow">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('items')}
          className={`flex-1 flex-row items-center justify-center gap-2 rounded-md py-3 ${activeTab === 'items' ? 'bg-emerald-600' : 'bg-transparent'
            }`}
        >
          <Package size={20} color={activeTab === 'items' ? '#ffffff' : '#6b7280'} />
          <Text
            className={`font-semibold ${activeTab === 'items' ? 'text-white' : 'text-gray-500'
              }`}
          >
            Itens
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('packages')}
          className={`flex-1 flex-row items-center justify-center gap-2 rounded-md py-3 ${activeTab === 'packages' ? 'bg-emerald-600' : 'bg-transparent'
            }`}
        >
          <Box size={20} color={activeTab === 'packages' ? '#ffffff' : '#6b7280'} />
          <Text
            className={`font-semibold ${activeTab === 'packages' ? 'text-white' : 'text-gray-500'
              }`}
          >
            Pacotes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      {activeTab === 'items' ? (
        // === ABA ITENS ===
        <ItensComponent
          inventory={inventory} 
          setInventory={setInventory}
          setPackages={setPackages}
          >
        </ItensComponent>
      ) : (
        // === ABA PACOTES ===
        <PackagesComponent
          inventory={inventory}
          setInventory={setInventory}
          packages={packages}
          setPackages={setPackages}
        >
        </PackagesComponent>
      )}
    </ScrollView>
  );
}
