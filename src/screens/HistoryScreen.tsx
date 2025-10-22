import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HistoryScreen() {
  // 🔹 Lista mockada de coletas/entregas
  const entregas = [
    {
      id: '001',
      coletor: 'Carlos Silva',
      receptor: 'Eco Reciclagem LTDA',
      destino: 'Rua Verde, 105 - Bairro Jardim',
      data: '20/10/2025',
      tipo: 'Plástico',
      peso: '12,5 kg',
      status: 'Entregue',
    },
    {
      id: '002',
      coletor: 'Mariana Souza',
      receptor: 'Ponto Verde Recicláveis',
      destino: 'Av. das Flores, 890 - Centro',
      data: '19/10/2025',
      tipo: 'Vidro',
      peso: '8,3 kg',
      status: 'Em andamento',
    },
    {
      id: '003',
      coletor: 'Pedro Rocha',
      receptor: 'Recicla Forte Ltda.',
      destino: 'Rua Azul, 212 - Santa Luzia',
      data: '18/10/2025',
      tipo: 'Metal',
      peso: '15,7 kg',
      status: 'Cancelada',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregue':
        return '#4CAF50';
      case 'Em andamento':
        return '#FFC107';
      case 'Cancelada':
        return '#F44336';
      default:
        return '#AAA';
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
      </View>

      {/* Lista de entregas */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {entregas.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardId}>{item.id}</Text>
              <Text style={[styles.cardStatus, { color: getStatusColor(item.status) }]}>
                {item.status}
              </Text>
            </View>

            <Text style={styles.cardLabel}>Coletor:</Text>
            <Text style={styles.cardValue}>{item.coletor}</Text>

            <Text style={styles.cardLabel}>Receptor:</Text>
            <Text style={styles.cardValue}>{item.receptor}</Text>

            <Text style={styles.cardLabel}>Destino:</Text>
            <Text style={styles.cardValue}>{item.destino}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>Data: {item.data}</Text>
              <Text style={styles.footerText}>Tipo: {item.tipo}</Text>
              <Text style={styles.footerText}>Peso: {item.peso}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderColor: '#333',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardId: {
    fontWeight: 'bold',
    color: '#bbb',
  },
  cardStatus: {
    fontWeight: 'bold',
  },
  cardLabel: {
    color: '#888',
    fontSize: 13,
    marginTop: 4,
  },
  cardValue: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 2,
  },
  cardFooter: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    color: '#aaa',
    fontSize: 13,
  },
});

