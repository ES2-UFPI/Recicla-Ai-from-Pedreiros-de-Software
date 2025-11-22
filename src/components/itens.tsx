import { Minus, Package, Plus, Trash2 } from "lucide-react-native";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, {useState } from "react";
import { InventoryItem } from "@/types/inventoryItem";
import { PackageComponent } from "@/types/packageComponent";
import { InventoryItemComponent } from "@/types/inventoryItemComponent";
import { supabase } from "@/lib/supabase";

type ItensComponentProps = {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  setPackages: React.Dispatch<React.SetStateAction<PackageComponent[]>>;
};

export default function ItensComponent({inventory, setInventory, setPackages}: ItensComponentProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleSelectItem = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const calculateTotalValue = () => {
    return inventory.reduce((sum, item) => sum + (item.quantity * item.item.value), 0);
  };

  const calculateTotalWeight = () => {
    return inventory.reduce((sum, item) => sum + (item.quantity * item.item.weight), 0);
  };

  const removeItem = async (itemId: number) => {
    try {
      
      // Soft delete no Supabase
      const { error } = await supabase
        .from('user_item')
        .update({ excluded: 1 })
        .eq('id', itemId);

      if (error) {
        console.error('❌ Erro ao remover item:', error);
        Alert.alert('Erro', 'Não foi possível remover o item.');
        return;
      }

      
      // Atualizar estado local
      setInventory(prev => prev.filter(item => item.id !== itemId));
      setPackages(prev =>
        prev
          .map(pkg => {
            pkg.setChildren(pkg.getChildren().filter(child => {
              if (child instanceof InventoryItemComponent) {
                return child.item.id !== itemId;
              }
              return true;
            }));
            return pkg;
          })
          .filter(pkg => pkg.getChildren().length > 0)
      );
    } catch (error) {
      console.error('❌ Erro ao remover item:', error);
      Alert.alert('Erro', 'Não foi possível remover o item.');
    }
  };
  
  const updateQuantity = async (itemId: number, change: number) => {
    try {
      const currentItem = inventory.find(item => item.id === itemId);
      if (!currentItem) return;

      const newQuantity = Math.max(0, currentItem.quantity + change);
      

      // Atualizar no Supabase
      const { error } = await supabase
        .from('user_item')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) {
        console.error('❌ Erro ao atualizar quantidade:', error);
        Alert.alert('Erro', 'Não foi possível atualizar a quantidade.');
        return;
      }


      // Atualizar estado local
      setInventory(prev =>
        prev.map(item => {
          if (item.id === itemId) {
            const newAvailable = Math.max(0, (item.available_quantity ?? item.quantity) + change);
            return {
              ...item,
              quantity: newQuantity,
              available_quantity: newAvailable,
            };
          }
          return item;
        })
      );
    } catch (error) {
      console.error('❌ Erro ao atualizar quantidade:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a quantidade.');
    }
  };

  return (
    <>
      {/* === ABA ITENS === */}
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
          </View>
        ) : (
          inventory.map(item => (
            <View key={item.id} className="mb-3 rounded-lg bg-white p-4 shadow">
              <View className="mb-3 flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-800">{item.item.name}</Text>
                  <Text className="text-sm text-gray-500">
                    Peso unitário: {item.item.weight} kg | Valor unitário: R$ {item.item.value.toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => toggleSelectItem(item.id)}
                    className={`mr-2 rounded-lg p-2 border ${selectedItems.includes(item.id) ? 'bg-emerald-50 border-emerald-600' : 'bg-white border-gray-200'
                      }`}
                  >
                    <Text className={`${selectedItems.includes(item.id) ? 'text-emerald-600' : 'text-gray-600'} font-medium`}>
                      {selectedItems.includes(item.id) ? 'Selecionado' : 'Selecionar'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => removeItem(item.id)}
                    className="ml-2 rounded-lg bg-red-100 p-2"
                  >
                    <Trash2 size={20} color="#dc2626" />
                  </TouchableOpacity>
                </View>
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
                  <Text className="text-2xl font-bold text-gray-800">{item.available_quantity ?? item.quantity}</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => updateQuantity(item.id, 1)}
                  className="rounded-lg bg-emerald-600 p-2"
                >
                  <Plus size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </>
  );
}