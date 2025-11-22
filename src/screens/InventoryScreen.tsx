import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Package, Box, Plus } from 'lucide-react-native';
import Loading from '@/components/loading';
import { InventoryItem } from '@/types/inventoryItem';
import { mockInventory, mockPackages } from '@/data';
import ItensComponent from '@/components/itens';
import { PackageComponent } from '@/types/packageComponent';
import PackagesComponent from '@/components/package';
import { supabase } from '@/lib/supabase';
import AddItemModal from '@/components/AddItemModal';

type TabType = 'items' | 'packages';

export default function InventoryScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('items');
  const [packages, setPackages] = useState<PackageComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const currentUserId = 1; 
  
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);

      
      const { data: userItems, error: itemsError } = await supabase
        .from('user_item')
        .select(`
          *,
          item:item_id (*)
        `)
        .eq('user_id', currentUserId)
        .eq('excluded', 0);

      if (itemsError) {
        console.error(' Erro ao carregar itens:', itemsError);
        throw itemsError;
      }



      
      const inventoryData: InventoryItem[] = (userItems || []).map(userItem => ({
        ...userItem,
        item: userItem.item as any,
        available_quantity: userItem.quantity,
      }));

      setInventory(inventoryData);
      setPackages(mockPackages); 
    } catch (error) {
      console.error(' Erro ao carregar inventário:', error);
      Alert.alert('Erro', 'Não foi possível carregar o inventário.');
      
      setInventory(mockInventory);
      setPackages(mockPackages);
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
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#059669']} />
        }
      >
        <View className="bg-white p-5 shadow">
          <Text className="text-3xl font-bold text-gray-800">Meu Inventário</Text>
          <Text className="mt-1 text-gray-600">Gerencie seus itens recicláveis</Text>
        </View>

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

        {activeTab === 'items' ? (
          
          <ItensComponent
            inventory={inventory} 
            setInventory={setInventory}
            setPackages={setPackages}
            >
          </ItensComponent>
        ) : (
          
          <PackagesComponent
            inventory={inventory}
            setInventory={setInventory}
            packages={packages}
            setPackages={setPackages}
          >
          </PackagesComponent>
        )}
      </ScrollView>

      {activeTab === 'items' && (
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          className="absolute bottom-6 right-6 h-16 w-16 items-center justify-center rounded-full bg-emerald-600 shadow-lg"
          style={{
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
          }}
        >
          <Plus size={32} color="#ffffff" />
        </TouchableOpacity>
      )}

      <AddItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onItemAdded={() => loadInventory()}
        userId={currentUserId}
      />
    </View>
  );
}
