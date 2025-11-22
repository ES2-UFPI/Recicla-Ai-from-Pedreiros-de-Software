import { supabase } from '@/lib/supabase';



export async function testItemsAPI() {
  
  let passedTests = 0;
  let failedTests = 0;
  
  
  
  
  try {
    console.log(' TESTE 1: Buscar todos os itens ativos da tabela item');
    console.log('---------------------------------------------------');
    
    const { data, error } = await supabase
      .from('item')
      .select('*')
      .eq('excluded', 0);
    
    console.log('Resultado:');
    console.log('  - Erro:', error);
    console.log('  - Total de itens:', data?.length || 0);
    
    if (error) {
      console.error(' FALHOU: Erro na requisição:', error.message);
      failedTests++;
    } else if (!data) {
      console.error(' FALHOU: Data está undefined');
      failedTests++;
    } else if (!Array.isArray(data)) {
      console.error(' FALHOU: Data não é um array');
      failedTests++;
    } else {
      console.log(' PASSOU: Requisição bem-sucedida');
      console.log('  - Data é um array:', Array.isArray(data));
      console.log('  - Primeiro item:', data[0]);
      
      if (data.length > 0) {
        const item = data[0];
        const hasAllFields = 
          'id' in item &&
          'name' in item &&
          'value' in item &&
          'weight' in item &&
          'excluded' in item &&
          'created_at' in item;
        
        if (hasAllFields) {
          console.log(' PASSOU: Estrutura do item está correta');
          passedTests++;
        } else {
          console.error(' FALHOU: Estrutura do item está incorreta');
          console.log('  - Campos disponíveis:', Object.keys(item));
          failedTests++;
        }
      } else {
        console.log('  AVISO: Nenhum item encontrado na tabela');
        passedTests++;
      }
    }
  } catch (err) {
    console.error(' FALHOU: Exceção durante o teste:', err);
    failedTests++;
  }
  
  console.log('\n');
  
  
  
  
  try {
    console.log(' TESTE 2: Buscar itens que o usuário já possui');
    console.log('---------------------------------------------------');
    
    const userId = 1;
    console.log('  - User ID:', userId);
    
    const { data: userItems, error } = await supabase
      .from('user_item')
      .select('item_id')
      .eq('user_id', userId)
      .eq('excluded', 0);
    
    console.log('Resultado:');
    console.log('  - Erro:', error);
    console.log('  - Total de itens do usuário:', userItems?.length || 0);
    
    if (error) {
      console.error(' FALHOU: Erro na requisição:', error.message);
      failedTests++;
    } else if (!Array.isArray(userItems)) {
      console.error(' FALHOU: userItems não é um array');
      failedTests++;
    } else {
      console.log(' PASSOU: Requisição de user_item bem-sucedida');
      console.log('  - Itens do usuário:', userItems);
      passedTests++;
    }
  } catch (err) {
    console.error(' FALHOU: Exceção durante o teste:', err);
    failedTests++;
  }
  
  console.log('\n');
  
  
  
  
  try {
    console.log(' TESTE 3: Filtrar itens disponíveis (que o usuário NÃO possui)');
    console.log('---------------------------------------------------');
    
    const userId = 1;
    
    
    const { data: allItems, error: itemsError } = await supabase
      .from('item')
      .select('*')
      .eq('excluded', 0);
    
    
    const { data: userItems, error: userItemsError } = await supabase
      .from('user_item')
      .select('item_id')
      .eq('user_id', userId)
      .eq('excluded', 0);
    
    if (itemsError || userItemsError) {
      console.error(' FALHOU: Erro nas requisições');
      console.log('  - itemsError:', itemsError);
      console.log('  - userItemsError:', userItemsError);
      failedTests++;
    } else {
      
      const userItemIds = userItems?.map(ui => ui.item_id) || [];
      const availableItems = allItems?.filter(item => !userItemIds.includes(item.id)) || [];
      
      console.log('Resultado:');
      console.log('  - Total de itens:', allItems?.length || 0);
      console.log('  - Itens do usuário:', userItemIds.length);
      console.log('  - Itens disponíveis:', availableItems.length);
      console.log('  - IDs do usuário:', userItemIds);
      console.log('  - Itens disponíveis:', availableItems.map(i => ({ id: i.id, name: i.name })));
      
      
      const hasConflict = availableItems.some(item => userItemIds.includes(item.id));
      
      if (hasConflict) {
        console.error(' FALHOU: Há itens disponíveis que o usuário já possui');
        failedTests++;
      } else {
        console.log(' PASSOU: Filtro funcionando corretamente');
        console.log('  - Nenhum item disponível está na lista do usuário');
        passedTests++;
      }
    }
  } catch (err) {
    console.error(' FALHOU: Exceção durante o teste:', err);
    failedTests++;
  }
  
  console.log('\n');
  
  
  
  
  console.log('========== RESUMO DOS TESTES ==========');
  console.log(` Testes passados: ${passedTests}`);
  console.log(` Testes falhos: ${failedTests}`);
  console.log(` Total: ${passedTests + failedTests}`);
  console.log(` Taxa de sucesso: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  console.log('========================================\n');
  
  return {
    passed: passedTests,
    failed: failedTests,
    total: passedTests + failedTests,
    success: failedTests === 0
  };
}
