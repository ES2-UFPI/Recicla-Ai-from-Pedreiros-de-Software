import React from 'react';
import { View, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View className="w-full flex-1 flex-col items-center justify-around zz">
        <View>
          <View>
            <Text>Meu Perfil</Text>
          </View>

          <View>
            <Text> Container com as informações do usuaário e foto de perfil</Text>
          </View>
        </View>

        <View>
          <Text> Lista de botões para editar perfil / mudar de tipo de perfil</Text>
        </View>
      </View>
    </View>
  );
}
