import { View, Text, ActivityIndicator } from "react-native";
export default function Loading({ message }: { message: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <ActivityIndicator size="large" color="#059669" />
      <Text className="mt-4 text-gray-600">{message}</Text>
    </View>
  );
}