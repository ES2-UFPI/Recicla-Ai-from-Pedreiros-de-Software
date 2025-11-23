import { View, Text, StyleSheet } from "react-native";
import { MapPin } from "lucide-react-native";
type cardProps = {
  title: string;
  address: string;
}
export default function Card({ title, address }: cardProps) {
  return (
    // Card component implementation
    <View style={styles.infoCard}>
      <View style={styles.infoHeader}>
        <MapPin size={20} color="#3b82f6" strokeWidth={2.5} />
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      <Text style={styles.addressText} numberOfLines={2}>
        {address}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
   infoCard: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 8,
  }
});