import { Minus, Plus, Trash2, Box } from "lucide-react-native";
import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { InventoryItem } from "@/types/inventoryItem";
import { PackageComponent } from "@/types/packageComponent";
import { InventoryItemComponent } from "@/types/inventoryItemComponent";

type PackagesComponentProps = {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  packages: PackageComponent[];
  setPackages: React.Dispatch<React.SetStateAction<PackageComponent[]>>;
};

export default function PackagesComponent({ inventory, setInventory, packages, setPackages }: PackagesComponentProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: number]: number }>({});
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
        pkgToRemove.getChildren().forEach(child => {
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

  return (
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
              className={`rounded-lg border p-3 mb-2 ${selected ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 bg-white'
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

            {pkg.getChildren().map((child, idx) => {
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
  );
}