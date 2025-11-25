import { supabase } from "@/lib/supabase";
export class OfferService {
  async createOffer(idPackage: number, collectionPoint: string) {
    const {data, error} = await supabase
      .from('offers')
      .insert([
        {
          user_id: 1,
          package_id: idPackage,
          status: 'pending',
          address_collection_point: collectionPoint,
          excluded: 0,
        },
      ])
      .select()
      .single();
    if (error) {
      console.error('Erro ao criar oferta:', error);
    }
    return data;
  }
  async updateOfferAddress(offerId: number, collectionPoint: string) {
    const {data, error} = await supabase
      .from('offers')
      .update({
        address_collection_point: collectionPoint
      })
      .eq('id', offerId)
      .select()
      .single();
    if (error) {
      console.error('Erro ao atualizar endereço da oferta:', error);
    }
    return data;
  }
  async getUserOffers(userId: number) {
    const {data, error} = await supabase
      .from('offers')
      .select(`*, package: package_id (*)`)
      .eq('user_id', userId)
      .eq('excluded', 0);
    if (error) {
      console.error('Erro ao buscar ofertas do usuário:', error);
    }
    return data;
  }
}