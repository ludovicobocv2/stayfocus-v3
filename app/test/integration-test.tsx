'use client';

import { useState, useEffect } from 'react';
import { TestHelper } from '../lib/testHelper';
import { createClient } from '../lib/supabase';

export default function IntegrationTest() {
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'complete' | 'error'>('idle');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [testUserId, setTestUserId] = useState<string>('test-user-1');
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog((prev) => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  const clearLog = () => setLog([]);

  const runTest = async () => {
    clearLog();
    setTestStatus('running');
    setResults(null);
    setError(null);
    
    const testHelper = new TestHelper();
    
    try {
      addLog('Iniciando testes de integração...');
      
      // Teste 1: Verificar status de sincronização inicial
      addLog('Verificando status de sincronização inicial...');
      const initialStatus = await testHelper.getSyncStatus(testUserId);
      addLog(`Status inicial: ${JSON.stringify(initialStatus)}`);
      
      // Teste 2: Simular alterações offline em dois dispositivos
      addLog('Simulando alterações offline em diferentes dispositivos...');
      const syncTest = await testHelper.testSyncBetweenDevices(testUserId, 2);
      addLog(`Teste de sincronização completo: ${JSON.stringify(syncTest.finalReport)}`);
      
      // Teste 3: Criar um conflito e resolver
      addLog('Verificando a resolução de conflitos...');
      const conflicts = syncTest.resolution;
      addLog(`Resolução de conflitos: ${JSON.stringify(conflicts)}`);
      
      // Teste 4: Obter dados do usuário de teste
      addLog('Obtendo dados do usuário de teste...');
      const userData = await testHelper.getTestUserData(testUserId);
      
      // Montar resultados completos
      const testResults = {
        initialStatus,
        syncTest,
        userData: {
          priorities: userData.priorities?.length || 0,
          sleepRecords: userData.sleepRecords?.length || 0,
          medications: userData.medications?.length || 0
        },
        timestamp: new Date().toISOString()
      };
      
      addLog('Testes concluídos com sucesso!');
      setResults(testResults);
      setTestStatus('complete');
    } catch (err: any) {
      addLog(`ERRO: ${err.message}`);
      setError(err.message);
      setTestStatus('error');
    }
  };

  const resetTestData = async () => {
    setTestStatus('running');
    const testHelper = new TestHelper();
    
    try {
      addLog('Limpando dados de teste...');
      const result = await testHelper.clearTestData();
      addLog(`Limpeza concluída: ${JSON.stringify(result)}`);
      setTestStatus('idle');
    } catch (err: any) {
      addLog(`ERRO durante limpeza: ${err.message}`);
      setError(err.message);
      setTestStatus('error');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teste de Integração com Backend</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          ID do Usuário de Teste:
          <input 
            type="text" 
            value={testUserId} 
            onChange={(e) => setTestUserId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </label>
      </div>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={runTest}
          disabled={testStatus === 'running'}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {testStatus === 'running' ? 'Executando...' : 'Executar Testes'}
        </button>
        
        <button
          onClick={resetTestData}
          disabled={testStatus === 'running'}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          Limpar Dados de Teste
        </button>
      </div>
      
      {/* Status dos testes */}
      {testStatus !== 'idle' && (
        <div className={`p-4 mb-6 rounded ${
          testStatus === 'running' ? 'bg-yellow-100' : 
          testStatus === 'complete' ? 'bg-green-100' : 
          'bg-red-100'
        }`}>
          <h2 className="font-bold mb-2">
            {testStatus === 'running' ? 'Executando testes...' : 
             testStatus === 'complete' ? 'Testes concluídos com sucesso!' : 
             'Erro durante os testes'}
          </h2>
          
          {error && <p className="text-red-600">{error}</p>}
        </div>
      )}
      
      {/* Log de execução */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Log de Execução:</h2>
        <div className="bg-gray-100 p-4 rounded h-60 overflow-y-auto font-mono text-sm">
          {log.map((entry, index) => (
            <div key={index} className="mb-1">{entry}</div>
          ))}
          {log.length === 0 && <div className="text-gray-500">Nenhum log disponível</div>}
        </div>
      </div>
      
      {/* Resultados */}
      {results && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Resultados:</h2>
          <div className="bg-white p-4 border rounded shadow">
            <pre className="whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
} 