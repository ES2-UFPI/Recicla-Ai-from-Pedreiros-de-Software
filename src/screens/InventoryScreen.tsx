import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Database } from '@/types/database';
import { Package, Plus, Minus, Trash2, Box } from 'lucide-react-native';

type InventoryItem = Database['public']['Tables']['user_item']['row'] & {
  item: Database['public']['Tables']['item']['row'];
};

type TabType = 'items' | 'packages';

// DADOS MOCKADOS!!!

export default function InventoryScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('items');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const currentUserId = 1;

  const mockInventory: InventoryItem[] = [
    {
      id: 1,
      user_id: 1,
      item_id: 1,
      quantity: 15,
      total_weight: 7.5,
      created_at: new Date().toISOString(),
      excluded: 0,
      item: {
        id: 1,
        nome: 'Garrafa PET',
        value: 0.5,
        weight: 0.5,
        excluded: 0,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 2,
      user_id: 1,
      item_id: 2,
      quantity: 20,
      total_weight: 10,
      created_at: new Date().toISOString(),
      excluded: 0,
      item: {
        id: 2,
        nome: 'Lata de Alumínio',
        value: 1.0,
        weight: 0.5,
        excluded: 0,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 3,
      user_id: 1,
      item_id: 3,
      quantity: 8,
      total_weight: 16,
      created_at: new Date().toISOString(),
      excluded: 0,
      item: {
        id: 3,
        nome: 'Papelão',
        value: 0.3,
        weight: 2.0,
        excluded: 0,
        created_at: new Date().toISOString(),
      },
    },
  ];

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setInventory(mockInventory);
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

  const updateQuantity = async (itemId: number, change: number) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + change);
          const newTotalWeight = newQuantity * item.item.weight;
          return {
            ...item,
            quantity: newQuantity,
            total_weight: newTotalWeight,
          };
        }
        return item;
      })
    );
  };

  const removeItem = async (itemId: number) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateTotalValue = () => {
    return inventory.reduce((sum, item) => sum + (item.quantity * item.item.value), 0);
  };

  const calculateTotalWeight = () => {
    return inventory.reduce((sum, item) => sum + item.total_weight, 0);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="mt-4 text-gray-600">Carregando inventário...</Text>
      </View>
    );
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

      <View className="mx-4 mt-4 flex-row rounded-lg bg-white p-1 shadow">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('items')}
          className={`flex-1 flex-row items-center justify-center gap-2 rounded-md py-3 ${
            activeTab === 'items' ? 'bg-emerald-600' : 'bg-transparent'
          }`}
        >
          <Package size={20} color={activeTab === 'items' ? '#ffffff' : '#6b7280'} />
          <Text
            className={`font-semibold ${
              activeTab === 'items' ? 'text-white' : 'text-gray-500'
            }`}
          >
            Itens
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('packages')}
          className={`flex-1 flex-row items-center justify-center gap-2 rounded-md py-3 ${
            activeTab === 'packages' ? 'bg-emerald-600' : 'bg-transparent'
          }`}
        >
          <Box size={20} color={activeTab === 'packages' ? '#ffffff' : '#6b7280'} />
          <Text
            className={`font-semibold ${
              activeTab === 'packages' ? 'text-white' : 'text-gray-500'
            }`}
          >
            Pacotes
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'items' ? (
        <>
          <View className="mx-4 my-4 rounded-lg bg-white p-4 shadow">
        <Text className="mb-3 text-lg font-bold text-gray-800">Resumo</Text>
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="text-sm text-gray-600">Total de Itens</Text>
            <Text className="text-2xl font-bold text-emerald-600">{inventory.length}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm text-gray-600">Peso Total</Text>
            <Text className="text-2xl font-bold text-blue-600">{calculateTotalWeight().toFixed(2)} kg</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm text-gray-600">Valor Estimado</Text>
            <Text className="text-2xl font-bold text-green-600">R$ {calculateTotalValue().toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View className="mx-4 mb-4">
        <Text className="mb-3 text-xl font-bold text-gray-800">Itens</Text>
        
        {inventory.length === 0 ? (
          <View className="items-center justify-center rounded-lg bg-white p-10 shadow">
            <Package size={64} color="#9ca3af" />
            <Text className="mt-4 text-center text-lg text-gray-500">
              Seu inventário está vazio
            </Text>
            <Text className="mt-2 text-center text-sm text-gray-400">
              Adicione itens para começar a gerenciar seus recicláveis
            </Text>
          </View>
        ) : (
          inventory.map((item) => (
            <View key={item.id} className="mb-3 rounded-lg bg-white p-4 shadow">
              <View className="mb-3 flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-800">{item.item.nome}</Text>
                  <Text className="text-sm text-gray-500">
                    Peso unitário: {item.item.weight} kg | Valor unitário: R$ {item.item.value.toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => removeItem(item.id)}
                  className="ml-2 rounded-lg bg-red-100 p-2"
                >
                  <Trash2 size={20} color="#dc2626" />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-between rounded-lg bg-gray-50 p-3">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => updateQuantity(item.id, -1)}
                  className="rounded-lg bg-red-500 p-2"
                  disabled={item.quantity === 0}
                >
                  <Minus size={20} color="#ffffff" />
                </TouchableOpacity>

                <View className="items-center">
                  <Text className="text-sm text-gray-600">Quantidade</Text>
                  <Text className="text-2xl font-bold text-gray-800">{item.quantity}</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => updateQuantity(item.id, 1)}
                  className="rounded-lg bg-emerald-600 p-2"
                >
                  <Plus size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <View className="mt-3 flex-row justify-between border-t border-gray-200 pt-3">
                <View>
                  <Text className="text-xs text-gray-500">Peso Total</Text>
                  <Text className="font-semibold text-blue-600">{item.total_weight.toFixed(2)} kg</Text>
                </View>
                <View>
                  <Text className="text-xs text-gray-500">Valor Total</Text>
                  <Text className="font-semibold text-green-600">
                    R$ {(item.quantity * item.item.value).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
        </>
      ) : (
        <View className="mx-4 my-4 items-center justify-center rounded-lg bg-white p-10 shadow">
          <Box size={64} color="#9ca3af" />
          <Text className="mt-4 text-center text-lg font-bold text-gray-800">
            Pacotes
          </Text>
          <Text className="mt-2 text-center text-sm text-gray-500">
            Funcionalidade em desenvolvimento
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
