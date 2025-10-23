import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin } from 'lucide-react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-5">
      <View className="items-center gap-4">
        <MapPin size={64} color="#059669" />
        <Text className="text-3xl font-bold text-gray-800">Bem-vindo!</Text>
        <Text className="text-center text-lg text-gray-600">
          Recicla AI - Sistema de reciclagem inteligente
        </Text>
        
        <TouchableOpacity
          activeOpacity={0.7}
          className="mt-8 flex-row items-center gap-3 rounded-lg bg-emerald-600 px-8 py-4 shadow-lg"
          onPress={() => {
            navigation.navigate("Map")
          }}
        >
          <MapPin size={24} color="#ffffff" />
          <Text className="text-lg font-bold text-white">Iniciar uma entrega</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

