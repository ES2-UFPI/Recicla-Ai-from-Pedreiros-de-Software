import { Database } from '@/types/database';

export type InventoryItem = Database['public']['Tables']['user_item']['row'] & {
  item: Database['public']['Tables']['item']['row'];
  available_quantity?: number;
};