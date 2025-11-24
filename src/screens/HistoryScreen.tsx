import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { addHistory, getUserRole, mockHistory } from '@/data';
import { Offer } from '@/types/offer';
import { CollectionPoint } from '@/types/collectionPoint';
import { History } from '@/types/history';

export default function HistoryScreen({route}: any) {
  const offer : Offer = route.params?.offer as Offer;
  const collectionPoint: CollectionPoint = route.params?.collectionPoint as CollectionPoint;
  const PROFILE = getUserRole();
  if (offer && collectionPoint){
    addHistory(
      {
        id: 101,
        date: offer.date.toISOString(),
        receiver: null,
        collector: null,
        producer: offer.creator,
        collectionPoint: collectionPoint.address
      } as History);
    }

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>{PROFILE === 'PRODUCER' ? 'Acompanhe suas coletas' : 'Acompanhe suas entregas'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {mockHistory.map((item) => (
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

            <Text style={styles.cardText}>Data: {formatarData(item.date)}</Text>
            <Text style={styles.cardText}>
              Ponto de coleta: {item.collectionPoint}
            </Text>
            <Text style={styles.cardText}>
              Produtor: {item.producer}
            </Text>
            <Text style={styles.cardText}>
              Coletor: {item.collector || 'Aguardando designação'}
            </Text>
            <Text style={styles.cardText}>
              Recebedor: {item.receiver || 'Aguardando designação'}
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


