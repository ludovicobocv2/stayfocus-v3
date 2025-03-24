import Link from 'next/link';
import IntegrationTest from './integration-test';

export const metadata = {
  title: 'Testes de Integração',
  description: 'Ambiente de teste para integração com backend Supabase',
};

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Modo de Teste</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="hover:text-blue-200">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-200">
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Ambiente de Testes</h2>
            <p className="text-gray-600 mb-4">
              Esta página contém ferramentas para testar a integração entre o frontend e o backend no Supabase.
              Use os testes abaixo para validar a sincronização de dados, tratamento de conflitos e outras funcionalidades.
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Atenção:</strong> Estes testes manipulam dados reais no banco de dados. 
                    Use apenas em ambientes de desenvolvimento ou teste.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            <IntegrationTest />
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Documentação dos Testes</h2>
            
            <h3 className="font-medium text-lg mt-6 mb-2">Schema de Teste</h3>
            <p className="text-gray-600 mb-2">
              O arquivo <code className="bg-gray-100 px-1 py-0.5 rounded">sql/test_data.sql</code> contém:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Inserções de dados para perfis de teste</li>
              <li>Dados de prioridades, registros de sono, lembretes</li>
              <li>Registros de humor e medicações de teste</li>
              <li>Função para criar usuários de teste automaticamente</li>
              <li>Função para limpar todos os dados de teste</li>
            </ul>
            
            <h3 className="font-medium text-lg mt-6 mb-2">Funções de Teste</h3>
            <p className="text-gray-600 mb-2">
              O arquivo <code className="bg-gray-100 px-1 py-0.5 rounded">sql/test_functions.sql</code> contém:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Função para verificar o status de sincronização</li>
              <li>Função para simular operações offline</li>
              <li>Função para simular conflitos de sincronização</li>
              <li>Função para resolver conflitos</li>
              <li>Função para gerar relatórios de teste</li>
            </ul>
            
            <h3 className="font-medium text-lg mt-6 mb-2">Helper de Testes</h3>
            <p className="text-gray-600 mb-2">
              O arquivo <code className="bg-gray-100 px-1 py-0.5 rounded">app/lib/testHelper.ts</code> contém:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Métodos para interagir com as funções SQL de teste</li>
              <li>Utilitários para simulação de sincronização</li>
              <li>Função para testar sincronização entre dispositivos</li>
              <li>Método para limpar dados de teste</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
} 