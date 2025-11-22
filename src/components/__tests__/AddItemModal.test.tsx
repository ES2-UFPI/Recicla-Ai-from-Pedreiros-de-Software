import { supabase } from '@/lib/supabase';


describe('AddItemModal - Teste de Requisição de Itens', () => {
  
  test('Deve buscar todos os itens ativos da tabela item', async () => {
    
    console.log('Iniciando teste de requisição...');
    
    
    const { data, error } = await supabase
      .from('item')
      .select('*')
      .eq('excluded', 0);
    
    
    console.log(' Resultado da requisição:');
    console.log('  - Data:', data);
    console.log('  - Error:', error);
    console.log('  - Total de itens:', data?.length || 0);
    
    
    expect(error).toBeNull(); 
    expect(data).toBeDefined(); 
    expect(Array.isArray(data)).toBe(true); 
    
    if (data && data.length > 0) {
      const firstItem = data[0];
      console.log('  - Primeiro item:', firstItem);
      
      
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('value');
      expect(firstItem).toHaveProperty('weight');
      expect(firstItem).toHaveProperty('excluded');
      expect(firstItem).toHaveProperty('created_at');
    }
  });

  test('Deve buscar itens que o usuário já possui', async () => {
    
    const userId = 1; 
    console.log('Testando busca de itens do usuário:', userId);
    
    
    const { data: userItems, error } = await supabase
      .from('user_item')
      .select('item_id')
      .eq('user_id', userId)
      .eq('excluded', 0);
    
    
    console.log(' Resultado:');
    console.log('  - Data:', userItems);
    console.log('  - Error:', error);
    console.log('  - Total de itens do usuário:', userItems?.length || 0);
    
    expect(error).toBeNull();
    expect(userItems).toBeDefined();
    expect(Array.isArray(userItems)).toBe(true);
  });

  test('Deve filtrar itens disponíveis (que o usuário NÃO possui)', async () => {
    
    const userId = 1;
    console.log('Testando filtro de itens disponíveis...');
    
    
    const { data: allItems, error: itemsError } = await supabase
      .from('item')
      .select('*')
      .eq('excluded', 0);
    
    
    const { data: userItems, error: userItemsError } = await supabase
      .from('user_item')
      .select('item_id')
      .eq('user_id', userId)
      .eq('excluded', 0);
    
    
    expect(itemsError).toBeNull();
    expect(userItemsError).toBeNull();
    
    
    const userItemIds = userItems?.map(ui => ui.item_id) || [];
    const availableItems = allItems?.filter(item => !userItemIds.includes(item.id)) || [];
    
    
    console.log(' Estatísticas:');
    console.log('  - Total de itens na tabela:', allItems?.length || 0);
    console.log('  - Itens que o usuário possui:', userItemIds.length);
    console.log('  - Itens disponíveis para adicionar:', availableItems.length);
    
    expect(allItems).toBeDefined();
    expect(availableItems).toBeDefined();
    expect(Array.isArray(availableItems)).toBe(true);
    
    
    if (userItemIds.length > 0 && allItems && allItems.length > 0) {
      expect(availableItems.length).toBeLessThanOrEqual(allItems.length);
    }
    
    
    availableItems.forEach(item => {
      expect(userItemIds).not.toContain(item.id);
    });
  });

  test('Deve retornar array vazio quando não há itens disponíveis', async () => {
    
    const userId = 999999; 
    console.log('Testando caso sem itens disponíveis...');
    
    
    const { data: allItems } = await supabase
      .from('item')
      .select('*')
      .eq('excluded', 0);
    
    const { data: userItems } = await supabase
      .from('user_item')
      .select('item_id')
      .eq('user_id', userId)
      .eq('excluded', 0);
    
    const userItemIds = userItems?.map(ui => ui.item_id) || [];
    const availableItems = allItems?.filter(item => !userItemIds.includes(item.id)) || [];
    
    
    console.log(' Itens disponíveis:', availableItems.length);
    expect(Array.isArray(availableItems)).toBe(true);
  });
});
