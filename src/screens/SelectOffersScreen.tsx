import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Loading from '@/components/loading';
import { Offer } from '@/types/offer';
import { OfferService } from '@/services/offer-service';
import mapBackendOffers from '@/utils/offerMapper';
export default function SelectOffersScreen({ navigation }: any) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Carrega dados mockados a partir de src/data.json
        // eslint-disable-next-line import/no-unresolved, @typescript-eslint/no-var-requires
        //const mockOffers: Offer[] = data?.mockOffers ?? [];
        //setOffers(mockOffers);
        const offerService = new OfferService();
        const dat = await offerService.getUserOffers(1);
        console.log(dat);
        setOffers(mapBackendOffers(dat || []));
      } catch (error) {
        console.warn('Erro ao carregar ofertas mock:', error);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderStatus = (status?: Offer['status']) => {
    const statusText = status ?? 'pending';
    const statusStyle: any[] = [styles.status];
    if (statusText === 'accepted') statusStyle.push(styles.statusOk);
    else if (statusText === 'rejected') statusStyle.push(styles.statusCanceled);
    else statusStyle.push(styles.statusPending);
    return <Text style={statusStyle}>{statusText === 'accepted' ? 'Aceita' : statusText === 'rejected' ? 'Rejeitada' : 'Pendente'}</Text>;
  };

  const handleSelect = (offer: Offer) => {
    // Navega para Home com a oferta selecionada (ajuste conforme fluxo desejado)
    navigation.navigate('Home', { offer });
  };

  if (loading) return <Loading message="Carregando ofertas..." />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ofertas Disponíveis</Text>
      {offers.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhuma oferta encontrada.</Text>
        </View>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(_, idx) => String(idx)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.collection_point}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.cardSubtitle}>{"Pacote de Rodolfo"}</Text>
              {renderStatus(item.status)}
              </View>
              <Text style={styles.cardDate}>{item.date.toLocaleString('pt-BR')}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.selectButton} onPress={() => handleSelect(item)}>
                  <Text style={styles.selectButtonText}>Selecionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    color: '#374151',
    fontSize: 14,
    marginBottom: 6,
  },
  cardDate: {
    color: '#6b7280',
    fontSize: 12,
  },
  actions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  selectButton: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 15,
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
