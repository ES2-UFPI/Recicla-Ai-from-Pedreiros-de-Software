import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Database } from '@/types/database';
import { Pencil, Settings, ArrowLeftRight, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const userMock: Database['public']['Tables']['users']['row'] = {
    id: 1,
    name: 'Bernardo',
    email: 'sample@sample.com',
    cpf: '000.000.000-00',
    sex: 'M',
    account_type: 'producer',
    excluded: 0,
    created_at: new Date().toISOString(),
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="">
        <View className="ml-2 mt-5 flex h-[80px] w-full flex-col justify-center p-3">
          <Text className="text-3xl font-bold">Meu Perfil</Text>
          <Text className="text-lg text-gray-700">Gerencie suas informações e configurações</Text>
        </View>
      </View>
      <View className="mt-3 w-full flex-col items-center gap-10 pb-10">
        <View className="flex h-[150px] w-[90%] flex-col items-center justify-center rounded-md bg-white p-4 shadow">
          <View className="flex w-[90%] flex-row items-center gap-10">
            <View className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-300">
              <Text className="text-3xl font-bold">{userMock.name[0]}</Text>
            </View>
            <View className="flex flex-col justify-center gap-2">
              <Text className="text-2xl font-bold">{userMock.name}</Text>
              <Text className="text-lg font-normal">{userMock.email}</Text>
              <Text className="w-[50%] rounded-md bg-emerald-200 p-1 text-center capitalize text-emerald-600">
                {userMock.account_type}
              </Text>
            </View>
          </View>
        </View>

        <View className="w-[90%] rounded-md p-2">
          <Text className="text-xl font-bold"> Configurações</Text>
          <View className="mt-5 flex w-full flex-col gap-3">
            <View className="w-full">
              <TouchableOpacity className="flex w-full flex-row items-center gap-3 rounded-md bg-white p-5 shadow">
                <Pencil size={20} />
                <Text className="text-base">Editar Perfil</Text>
              </TouchableOpacity>
            </View>
            <View className="w-full">
              <TouchableOpacity className="flex w-full flex-row  items-center  gap-3 rounded-md bg-white p-5 shadow">
                <Settings />
                <Text className="text-base">Configurações do Sistema</Text>
              </TouchableOpacity>
            </View>
            <View className="w-full">
              <TouchableOpacity className="flex w-full flex-row gap-3 items-center rounded-md bg-white p-5 shadow">
                <ArrowLeftRight />
                <Text>Trocar tipo de conta</Text>
              </TouchableOpacity>
            </View>
            <View className="w-full">
              <TouchableOpacity className="flex w-full items-center flex-row gap-3 rounded-md bg-white p-5 shadow shadow-red-800">
                <LogOut color="#dc2626" />
                <Text className="text-red-600 ">Sair da conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
