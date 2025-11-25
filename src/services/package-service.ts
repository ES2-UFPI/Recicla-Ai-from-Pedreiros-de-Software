import { supabase } from "@/lib/supabase";
export class PackageService {

  async getUserPackagesItems(user_id: number) {
    return await supabase
      .from('package')
      .select(`
      id,
      created_at,
      excluded,
      package_items (
        id,
        excluded,
        item: item_id (*)
      )
    `)
      .eq('user_id', user_id)
      .eq('excluded', 0);
  }

  async createPackage(user_id: number = 1, date: string) {
    const {data, error} = await supabase
      .from('package')
      .insert([
        {
          user_id: user_id,
          excluded: 0,
        },
      ])
      .select()
      .single()
    if (error) {
      console.error('Erro ao criar pacote:', error);
    }
    return data;
  }
  async createPackageItem(user_id: number = 1, item_id: number, 
    package_id: number, created_at: string, chosenQty: number) {
    const {data, error} = await supabase
      .from('package_items')
      .insert([
        {
          item_id: item_id,
          package_id: package_id,
          item_quantity: chosenQty,
          excluded: 0,
        },
      ])
      .select()
      .single();
    if (error) {
      console.error('Erro ao criar item do pacote:', error);
    }
    return data;
  }
}