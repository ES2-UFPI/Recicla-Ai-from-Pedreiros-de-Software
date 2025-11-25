import { supabase } from '@/lib/supabase';

// Métodos relacionados a itens podem ser adicionados aqui
export async function getUserItems(currentUserId: number) {
  return await supabase
    .from('user_item')
    .select(`
                  *,
                  item: item_id (*)
                `)
    .eq('user_id', currentUserId)
    .eq('excluded', 0);
}