import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Database } from '@/types/database';
import { Package, Plus, Minus, Trash2, Box } from 'lucide-react-native';

type InventoryItem = Database['public']['Tables']['user_item']['row'] & {
  item: Database['public']['Tables']['item']['row'];
  available_quantity?: number;
};

type TabType = 'items' | 'packages';

// ======== PADRÃO COMPOSITE ========

class InventoryComponent {
  getWeight(): number {
    return 0;
  }
  getValue(): number {
    return 0;
  }
  getName(): string {
    return '';
  }
}

class InventoryItemComponent extends InventoryComponent {
  public item: InventoryItem;
  constructor(item: InventoryItem) {
    super();
    this.item = item;
  }

  getWeight(): number {
    return this.item.total_weight;
  }

  getValue(): number {
    return this.item.quantity * this.item.item.value;
  }

  getName(): string {
    return this.item.item.nome;
  }
}

class PackageComponent extends InventoryComponent {
  public name: string;
  public children: InventoryComponent[] = [];

  constructor(name: string) {
    super();
    this.name = name;
  }

  add(component: InventoryComponent) {
    this.children.push(component);
  }

  remove(component: InventoryComponent) {
    this.children = this.children.filter(c => c !== component);
  }

  getWeight(): number {
    return this.children.reduce((sum, c) => sum + c.getWeight(), 0);
  }

  getValue(): number {
    return this.children.reduce((sum, c) => sum + c.getValue(), 0);
  }

  getName(): string {
    return this.name;
  }
}

// DADOS MOCKADOS!!!

export default function InventoryScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('items');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [packages, setPackages] = useState<PackageComponent[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: number]: number }>({});

  const currentUserId = 1;

  const mockInventory: InventoryItem[] = [
    {
      id: 1,
      user_id: 1,
      item_id: 1,
      quantity: 15,
      available_quantity: 15,
      total_weight: 7.5,
      created_at: new Date().toISOString(),
      excluded: 0,
      item: {
        id: 1,
        nome: 'Garrafa PET',
        value: 0.5,
        weight: 0.1,
        excluded: 0,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 2,
      user_id: 1,
      item_id: 2,
      quantity: 20,
      available_quantity: 20,
      total_weight: 10,
      created_at: new Date().toISOString(),
      excluded: 0,
      item: {
        id: 2,
        nome: 'Lata de Alumínio',
        value: 1.0,
        weight: 0.2,
        excluded: 0,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 3,
      user_id: 1,
      item_id: 3,
      quantity: 8,
      available_quantity: 8,
      total_weight: 16,
      created_at: new Date().toISOString(),
      excluded: 0,
      item: {
        id: 3,
        nome: 'Papelão',
        value: 0.3,
        weight: 0.3,
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
          const newAvailable = Math.max(0, (item.available_quantity ?? item.quantity) + change);
          const newTotalWeight = newQuantity * item.item.weight;
          return {
            ...item,
            quantity: newQuantity,
            available_quantity: newAvailable,
            total_weight: newTotalWeight,
          };
        }
        return item;
      })
    );
  };

  const removeItem = async (itemId: number) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));

    setPackages(prev =>
      prev
        .map(pkg => {
          pkg.children = pkg.children.filter(child => {
            if (child instanceof InventoryItemComponent) {
              return child.item.id !== itemId;
            }
            return true;
          });
          return pkg;
        })
        .filter(pkg => pkg.children.length > 0)
    );
  };

  const calculateTotalValue = () => {
    return inventory.reduce((sum, item) => sum + (item.quantity * item.item.value), 0);
  };

  const calculateTotalWeight = () => {
    return inventory.reduce((sum, item) => sum + item.total_weight, 0);
  };

  // ===== Funções de pacotes =====

  const toggleSelectItem = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const changeSelectedQuantity = (itemId: number, delta: number, max: number) => {
    setSelectedQuantities(prev => {
      const newQty = Math.min(max, Math.max(0, (prev[itemId] ?? 0) + delta));
      return { ...prev, [itemId]: newQty };
    });
  };

  const createPackage = () => {
    if (selectedItems.length === 0) return;

    const packageName = `Pacote #${packages.length + 1}`;
    const newPackage = new PackageComponent(packageName);
    let hasError = false;

    const updatedInventory = inventory.map(item => {
      if (selectedItems.includes(item.id)) {
        const chosenQty = selectedQuantities[item.id] ?? 0;
        const available = item.available_quantity ?? item.quantity;

        if (chosenQty <= 0 || chosenQty > available) {
          hasError = true;
          return item;
        }

        const partialItem: InventoryItem = {
          ...item,
          quantity: chosenQty,
          total_weight: chosenQty * item.item.weight,
        };
        newPackage.add(new InventoryItemComponent(partialItem));

        return {
          ...item,
          available_quantity: available - chosenQty,
        };
      }
      return item;
    });

    if (hasError) {
      Alert.alert('Erro', 'Verifique as quantidades selecionadas.');
      return;
    }

    setInventory(updatedInventory);
    setPackages(prev => [...prev, newPackage]);
    setSelectedItems([]);
    setSelectedQuantities({});
  };

  const removePackage = (packageName: string) => {
    const pkgToRemove = packages.find(p => p.getName() === packageName);
    if (pkgToRemove) {
      const restoredInventory = inventory.map(item => {
        pkgToRemove.children.forEach(child => {
          if (child instanceof InventoryItemComponent && child.item.id === item.id) {
            item.available_quantity = (item.available_quantity ?? 0) + child.item.quantity;
          }
        });
        return item;
      });
      setInventory(restoredInventory);
    }
    setPackages(prev => prev.filter(p => p.getName() !== packageName));
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

      {/* Abas */}
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

      {/* Conteúdo */}
      {activeTab === 'items' ? (
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
                      <Text className="text-lg font-bold text-gray-800">{item.item.nome}</Text>
                      <Text className="text-sm text-gray-500">
                        Peso unitário: {item.item.weight} kg | Valor unitário: R$ {item.item.value.toFixed(2)}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => toggleSelectItem(item.id)}
                        className={`mr-2 rounded-lg p-2 border ${
                          selectedItems.includes(item.id) ? 'bg-emerald-50 border-emerald-600' : 'bg-white border-gray-200'
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
      ) : (
        // === ABA PACOTES ===
        <View className="mx-4 my-4">
          <Text className="mb-3 text-xl font-bold text-gray-800">Pacotes</Text>

          {/* Criar Pacote */}
          <View className="rounded-lg bg-white p-4 shadow mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Criar novo pacote</Text>
            <Text className="text-sm text-gray-500 mb-3">Selecione itens abaixo para formar um pacote.</Text>

            {inventory.map(item => {
              const selected = selectedItems.includes(item.id);
              const available = item.available_quantity ?? item.quantity;
              const chosenQty = selectedQuantities[item.id] ?? 0;

              return (
                <View
                  key={item.id}
                  className={`rounded-lg border p-3 mb-2 ${
                    selected ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => toggleSelectItem(item.id)}
                    className="flex-row justify-between items-center mb-2"
                  >
                    <Text className="text-gray-800 font-medium">{item.item.nome}</Text>
                    <Text className="text-gray-500 text-sm">{available} un disponíveis</Text>
                  </TouchableOpacity>

                  {selected && (
                    <View className="flex-row items-center justify-between bg-white rounded-lg p-2 border border-gray-200">
                      <TouchableOpacity
                        onPress={() => changeSelectedQuantity(item.id, -1, available)}
                        className="rounded-lg bg-red-500 p-2"
                        disabled={chosenQty <= 0}
                      >
                        <Minus size={18} color="#fff" />
                      </TouchableOpacity>
                      <Text className="text-gray-700 font-semibold">{chosenQty}</Text>
                      <TouchableOpacity
                        onPress={() => changeSelectedQuantity(item.id, 1, available)}
                        className="rounded-lg bg-emerald-600 p-2"
                        disabled={chosenQty >= available}
                      >
                        <Plus size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={createPackage}
              className="mt-3 rounded-lg bg-emerald-600 p-3"
            >
              <Text className="text-center text-white font-semibold">Criar Pacote</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Pacotes */}
          {packages.length === 0 ? (
            <View className="items-center justify-center rounded-lg bg-white p-10 shadow">
              <Box size={64} color="#9ca3af" />
              <Text className="mt-4 text-center text-lg text-gray-500">Nenhum pacote criado ainda</Text>
            </View>
          ) : (
            packages.map(pkg => (
              <View key={pkg.getName()} className="mb-3 rounded-lg bg-white p-4 shadow">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-lg font-bold text-gray-800">{pkg.getName()}</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => removePackage(pkg.getName())}
                    className="p-2 rounded-lg bg-red-100"
                  >
                    <Trash2 size={20} color="#dc2626" />
                  </TouchableOpacity>
                </View>
                <Text className="text-gray-600 mb-2">
                  Peso Total: <Text className="font-semibold">{pkg.getWeight().toFixed(2)} kg</Text> | Valor Estimado:{' '}
                  <Text className="font-semibold">R$ {pkg.getValue().toFixed(2)}</Text>
                </Text>

                {pkg.children.map((child, idx) => {
                  if (child instanceof InventoryItemComponent) {
                    return (
                      <Text key={idx} className="text-gray-700">
                        • {child.getName()} — {child.item.quantity} un
                      </Text>
                    );
                  }
                  return null;
                })}
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}
