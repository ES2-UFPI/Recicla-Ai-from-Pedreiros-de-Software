import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { testItemsAPI } from './testItemsAPI';


export default function TestItemsButton() {
  const [testResults, setTestResults] = useState<{
    passed: number;
    failed: number;
    total: number;
    success: boolean;
  } | null>(null);
  const [running, setRunning] = useState(false);

  const runTests = async () => {
    setRunning(true);
    
    const results = await testItemsAPI();
    setTestResults(results);
    setRunning(false);
    
    if (results.success) {
      Alert.alert(
        ' Sucesso!',
        `Todos os ${results.total} testes passaram!\n\nVerifique o console para detalhes.`
      );
    } else {
      Alert.alert(
        ' Atenção',
        `${results.passed}/${results.total} testes passaram\n${results.failed} falharam\n\nVerifique o console para detalhes.`
      );
    }
  };

  return (
    <View className="m-4 rounded-lg bg-white p-4 shadow">
      <Text className="mb-3 text-xl font-bold text-gray-800">
         Testes TDD - API de Itens
      </Text>
      
      <TouchableOpacity
        onPress={runTests}
        disabled={running}
        className={`rounded-lg py-3 ${running ? 'bg-gray-400' : 'bg-blue-600'}`}
      >
        <Text className="text-center font-bold text-white">
          {running ? 'Executando testes...' : ' Executar Testes'}
        </Text>
      </TouchableOpacity>

      {testResults && (
        <View className="mt-4 rounded-lg bg-gray-50 p-4">
          <Text className="mb-2 text-lg font-bold text-gray-800">Resultados:</Text>
          
          <View className="flex-row justify-between">
            <Text className="text-green-600"> Passaram: {testResults.passed}</Text>
            <Text className="text-red-600"> Falharam: {testResults.failed}</Text>
          </View>
          
          <View className="mt-2 flex-row justify-between">
            <Text className="text-gray-700"> Total: {testResults.total}</Text>
            <Text className="font-bold text-gray-700">
              {((testResults.passed / testResults.total) * 100).toFixed(1)}%
            </Text>
          </View>

          {testResults.success ? (
            <View className="mt-3 rounded bg-green-100 p-2">
              <Text className="text-center font-bold text-green-800">
                 Todos os testes passaram!
              </Text>
            </View>
          ) : (
            <View className="mt-3 rounded bg-red-100 p-2">
              <Text className="text-center font-bold text-red-800">
                 Alguns testes falharam
              </Text>
            </View>
          )}
        </View>
      )}

      <View className="mt-4 rounded-lg bg-blue-50 p-3">
        <Text className="text-sm text-blue-800">
           Os logs detalhados dos testes aparecem no console do React Native.
        </Text>
      </View>
    </View>
  );
}
