import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HistoryScreen() {
  const entregas = [
    {
      id: 101,
      data: '2025-10-20T14:23:00Z',
      status: 'Entregue',
      receptor: { nome: 'Maria Oliveira', codigo: 5 },
      coletor: { nome: 'João Silva', codigo: 3 },
      pontoColeta: { endereco: 'Rua das Flores, 120', codigo: 12 },
    },
    {
      id: 102,
      data: '2025-10-21T10:40:00Z',
      status: 'Pendente',
      receptor: { nome: 'Eco Recicla Ltda.', codigo: 8 },
      coletor: { nome: 'Ana Souza', codigo: 4 },
      pontoColeta: { endereco: 'Av. Brasil, 450', codigo: 9 },
    },
    {
      id: 103,
      data: '2025-10-19T08:10:00Z',
      status: 'Cancelada',
      receptor: { nome: 'Carlos Pereira', codigo: 10 },
      coletor: { nome: 'Bruno Mendes', codigo: 6 },
      pontoColeta: { endereco: 'Rua das Palmeiras, 30', codigo: 7 },
    },
    {
      id: 104,
      data: '2025-10-22T16:00:00Z',
      status: 'Entregue',
      receptor: { nome: 'Recicla Forte', codigo: 11 },
      coletor: { nome: 'Fernanda Lima', codigo: 9 },
      pontoColeta: { endereco: 'Rua Central, 88', codigo: 14 },
    },
  ];

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>Acompanhe suas coletas e entregas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {entregas.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Entrega #{item.id}</Text>
              <Text
                style={[
                  styles.status,
                  item.status === 'Entregue'
                    ? styles.statusOk
                    : item.status === 'Pendente'
                    ? styles.statusPending
                    : item.status === 'Cancelada'
                    ? styles.statusCanceled
                    : styles.statusOk,
                ]}
              >
                {item.status}
              </Text>
            </View>

            <Text style={styles.cardText}>Data: {formatarData(item.data)}</Text>
            <Text style={styles.cardText}>
              Ponto de coleta: {item.pontoColeta.endereco} (#{item.pontoColeta.codigo})
            </Text>
            <Text style={styles.cardText}>
              Coletor: {item.coletor.nome} (#{item.coletor.codigo})
            </Text>
            <Text style={styles.cardText}>
              Receptor: {item.receptor.nome} (#{item.receptor.codigo})
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    color: '#555',
    fontSize: 15,
    marginTop: 4,
  },
  scroll: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cardText: {
    color: '#333',
    fontSize: 14,
    marginTop: 2,
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  statusOk: {
    backgroundColor: '#4CAF50',
  },
  statusPending: {
    backgroundColor: '#FFB300',
  },
  statusCanceled: {
    backgroundColor: '#E53935',
  },
});


