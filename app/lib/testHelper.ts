import { createClient } from './supabase';
import { Database } from '../types/supabase';

/**
 * Helper para testes de integração com o Supabase
 */
export class TestHelper {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  /**
   * Obter status de sincronização para um usuário
   */
  async getSyncStatus(userId: string): Promise<any> {
    const { data, error } = await this.supabase
      .rpc('test_sync_status', { test_user_id: userId });

    if (error) throw new Error(`Erro ao obter status de sincronização: ${error.message}`);
    return data;
  }

  /**
   * Simular alterações feitas offline
   */
  async simulateOfflineChanges(userId: string, deviceId: string): Promise<any> {
    const { data, error } = await this.supabase
      .rpc('simulate_offline_changes', { 
        test_user_id: userId,
        device_id: deviceId
      });

    if (error) throw new Error(`Erro ao simular alterações offline: ${error.message}`);
    return data;
  }

  /**
   * Simular conflito de sincronização
   */
  async simulateSyncConflict(userId: string, itemId: string): Promise<any> {
    const { data, error } = await this.supabase
      .rpc('simulate_sync_conflict', { 
        test_user_id: userId,
        item_id: itemId
      });

    if (error) throw new Error(`Erro ao simular conflito: ${error.message}`);
    return data;
  }

  /**
   * Resolver conflitos de sincronização
   */
  async resolveConflicts(userId: string): Promise<any> {
    const { data, error } = await this.supabase
      .rpc('test_resolve_conflicts', { test_user_id: userId });

    if (error) throw new Error(`Erro ao resolver conflitos: ${error.message}`);
    return data;
  }

  /**
   * Gerar relatório de testes
   */
  async generateTestReport(userId: string): Promise<any> {
    const { data, error } = await this.supabase
      .rpc('generate_test_report', { test_user_id: userId });

    if (error) throw new Error(`Erro ao gerar relatório: ${error.message}`);
    return data;
  }

  /**
   * Obter dados de um usuário de teste
   */
  async getTestUserData(userId: string): Promise<any> {
    const results: any = {};

    // Buscar prioridades
    const { data: priorities, error: prioritiesError } = await this.supabase
      .from('priorities')
      .select('*')
      .eq('user_id', userId);
    
    if (prioritiesError) throw new Error(`Erro ao buscar prioridades: ${prioritiesError.message}`);
    results.priorities = priorities;

    // Buscar registros de sono
    const { data: sleepRecords, error: sleepError } = await this.supabase
      .from('sleep_records')
      .select('*')
      .eq('user_id', userId);
    
    if (sleepError) throw new Error(`Erro ao buscar registros de sono: ${sleepError.message}`);
    results.sleepRecords = sleepRecords;

    // Buscar medicações
    const { data: medications, error: medError } = await this.supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId);
    
    if (medError) throw new Error(`Erro ao buscar medicações: ${medError.message}`);
    results.medications = medications;

    return results;
  }

  /**
   * Limpar dados de teste
   */
  async clearTestData(): Promise<any> {
    const { data, error } = await this.supabase
      .rpc('clear_test_data');

    if (error) throw new Error(`Erro ao limpar dados de teste: ${error.message}`);
    return { success: true, message: 'Dados de teste removidos com sucesso' };
  }

  /**
   * Login com usuário de teste
   * Observação: Esta função é apenas para testes, não use em produção
   */
  async loginWithTestUser(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw new Error(`Erro ao fazer login com usuário de teste: ${error.message}`);
    return data;
  }

  /**
   * Testar a sincronização entre dispositivos
   */
  async testSyncBetweenDevices(userId: string, numDevices: number = 2): Promise<any> {
    const results: any = { devices: [] };
    
    // Simular alterações em cada dispositivo
    for (let i = 1; i <= numDevices; i++) {
      const deviceId = `test-device-${i}`;
      const deviceChanges = await this.simulateOfflineChanges(userId, deviceId);
      results.devices.push({
        deviceId,
        changes: deviceChanges
      });
    }
    
    // Verificar status após simulações
    results.syncStatus = await this.getSyncStatus(userId);
    
    // Simular um conflito entre os primeiros dois dispositivos
    if (numDevices >= 2) {
      const firstPriorityId = results.devices[0].changes.created_items.priority_id;
      results.conflict = await this.simulateSyncConflict(userId, firstPriorityId);
      
      // Resolver conflitos
      results.resolution = await this.resolveConflicts(userId);
    }
    
    // Gerar relatório final
    results.finalReport = await this.generateTestReport(userId);
    
    return results;
  }
} 