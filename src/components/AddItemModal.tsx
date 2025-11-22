import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { X, Search, Plus, Minus } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Item = Database['public']['Tables']['item']['row'];

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onItemAdded: () => void;
  userId: number;
}

export default function AddItemModal({ visible, onClose, onItemAdded, userId }: AddItemModalProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (visible) {
      loadItems();
    }
  }, [visible]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  const loadItems = async () => {
    try {
      setLoading(true);

      // Buscar todos os itens ativos
      const { data: allItems, error: itemsError } = await supabase
        .from('item')
        .select('*')
        .eq('excluded', 0);

      if (itemsError) {
        console.error('❌ Erro ao carregar itens:', itemsError);
        throw itemsError;
      }

      // Buscar itens que o usuário já tem
      const { data: userItems, error: userItemsError } = await supabase
        .from('user_item')
        .select('item_id')
        .eq('user_id', userId)
        .eq('excluded', 0);

      if (userItemsError) {
        console.error('❌ Erro ao carregar itens do usuário:', userItemsError);
        throw userItemsError;
      }

      // Filtrar apenas itens que o usuário NÃO possui
      const userItemIds = userItems?.map(ui => ui.item_id) || [];
      const availableItems = allItems?.filter(item => !userItemIds.includes(item.id)) || [];


      setItems(availableItems);
      setFilteredItems(availableItems);
    } catch (error) {
      console.error('❌ Erro ao carregar itens:', error);
      Alert.alert('Erro', 'Não foi possível carregar os itens disponíveis');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!selectedItem) {
      Alert.alert('Atenção', 'Selecione um item primeiro');
      return;
    }

    if (quantity <= 0) {
      Alert.alert('Atenção', 'A quantidade deve ser maior que zero');
      return;
    }

    try {
      setLoading(true);

      // Criar novo registro (não precisa verificar pois já filtramos antes)
      const { error: insertError } = await supabase
        .from('user_item')
        .insert({
          user_id: userId,
          item_id: selectedItem.id,
          quantity: quantity,
          excluded: 0,
        });

      if (insertError) {
        console.error('❌ Erro ao inserir:', insertError);
        throw insertError;
      }

      Alert.alert('Sucesso!', `${selectedItem.name} adicionado ao inventário!`);
      onItemAdded();
      handleClose();
    } catch (error) {
      console.error('❌ Erro ao adicionar item:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o item ao inventário');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
    setQuantity(1);
    setSearchQuery('');
    onClose();
  };

  const updateQuantity = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="mt-20 flex-1 rounded-t-3xl bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-gray-200 p-5">
            <View>
              <Text className="text-2xl font-bold text-gray-800">Adicionar Item</Text>
              <Text className="text-sm text-gray-600">
                {filteredItems.length} {filteredItems.length === 1 ? 'item disponível' : 'itens disponíveis'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              className="rounded-full bg-gray-100 p-2"
              activeOpacity={0.7}
            >
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="border-b border-gray-100 px-5 py-3">
            <View className="flex-row items-center rounded-lg bg-gray-100 px-4 py-3">
              <Search size={20} color="#6b7280" />
              <TextInput
                placeholder="Buscar item..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="ml-2 flex-1 text-base text-gray-800"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Loading State */}
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#059669" />
              <Text className="mt-3 text-gray-600">Carregando itens...</Text>
            </View>
          ) : (
            <>
              {/* Items List */}
              <FlatList
                data={filteredItems}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 20, paddingBottom: selectedItem ? 0 : 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedItem(item)}
                    className={`mb-3 rounded-xl border-2 p-4 ${
                      selectedItem?.id === item.id
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text
                          className={`text-lg font-bold ${
                            selectedItem?.id === item.id ? 'text-emerald-800' : 'text-gray-800'
                          }`}
                        >
                          {item.name}
                        </Text>
                        <View className="mt-2 flex-row gap-4">
                          <Text className="text-sm text-gray-600">
                            💰 R$ {item.value.toFixed(2)}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            ⚖️ {item.weight} kg
                          </Text>
                        </View>
                      </View>
                      {selectedItem?.id === item.id && (
                        <View className="rounded-full bg-emerald-600 px-3 py-1">
                          <Text className="text-xs font-bold text-white">✓ Selecionado</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View className="items-center justify-center py-20">
                    <Text className="text-lg text-gray-400">
                      {searchQuery ? 'Nenhum item encontrado' : 'Nenhum item disponível'}
                    </Text>
                    {searchQuery && (
                      <Text className="mt-2 text-sm text-gray-400">
                        Tente buscar por outro nome
                      </Text>
                    )}
                  </View>
                }
              />

              {/* Bottom Action - Quantity and Add Button */}
              {selectedItem && (
                <View className="border-t border-gray-200 bg-white p-5">
                  <View className="mb-3 flex-row items-center justify-between">
                    <Text className="text-base font-semibold text-gray-700">Quantidade:</Text>
                    <View className="flex-row items-center gap-3">
                      <TouchableOpacity
                        onPress={() => updateQuantity(-1)}
                        className="h-10 w-10 items-center justify-center rounded-lg bg-red-500"
                        activeOpacity={0.7}
                        disabled={quantity === 1}
                      >
                        <Minus size={20} color="#ffffff" />
                      </TouchableOpacity>

                      <Text className="w-12 text-center text-2xl font-bold text-gray-800">
                        {quantity}
                      </Text>

                      <TouchableOpacity
                        onPress={() => updateQuantity(1)}
                        className="h-10 w-10 items-center justify-center rounded-lg bg-emerald-600"
                        activeOpacity={0.7}
                      >
                        <Plus size={20} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleAddItem}
                    className="rounded-xl bg-emerald-600 py-4"
                    activeOpacity={0.7}
                    disabled={loading}
                  >
                    <Text className="text-center text-lg font-bold text-white">
                      {loading ? 'Adicionando...' : '+ Adicionar ao Inventário'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
