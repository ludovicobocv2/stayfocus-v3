'use client';

import { ArrowLeft, HelpCircle, FileDown, FileUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AjudaImportacaoExportacao() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link 
        href="/perfil" 
        className="flex items-center text-blue-600 dark:text-blue-400 mb-6 hover:underline"
      >
        <ArrowLeft size={16} className="mr-1" />
        Voltar para Perfil
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <HelpCircle className="text-blue-600 dark:text-blue-400 mr-2" size={24} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ajuda: Importação e Exportação de Dados
          </h1>
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>
            O StayFocus permite que você faça backup dos seus dados e os restaure quando necessário.
            Isso é útil para transferir seus dados entre dispositivos ou para garantir que você não perca
            suas informações importantes.
          </p>
          
          <h2 className="flex items-center mt-6 mb-3">
            <FileDown className="mr-2 text-green-600 dark:text-green-400" size={20} />
            Exportação de Dados
          </h2>
          
          <p>
            A exportação de dados cria um arquivo JSON contendo todas as suas informações do StayFocus.
            Este arquivo pode ser armazenado com segurança em seu computador ou serviço de armazenamento na nuvem.
          </p>
          
          <h3>Como exportar seus dados:</h3>
          
          <ol className="list-decimal list-inside space-y-2 pl-4">
            <li>Acesse a página de Perfil</li>
            <li>Localize a seção "Importar/Exportar Dados"</li>
            <li>Clique no botão "Exportar Dados"</li>
            <li>Um arquivo chamado <code>stayfocus_backup_DATA.json</code> será baixado automaticamente</li>
            <li>Guarde este arquivo em um local seguro</li>
          </ol>
          
          <p className="text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800 my-4">
            <strong>Dica:</strong> Recomendamos fazer backup dos seus dados regularmente, especialmente antes de fazer
            alterações significativas no seu perfil ou configurações.
          </p>
          
          <h2 className="flex items-center mt-6 mb-3">
            <FileUp className="mr-2 text-amber-600 dark:text-amber-400" size={20} />
            Importação de Dados
          </h2>
          
          <p>
            A importação de dados permite restaurar informações previamente exportadas.
            Ao importar dados, todas as informações atuais serão substituídas pelo conteúdo do arquivo de backup.
          </p>
          
          <h3>Como importar seus dados:</h3>
          
          <ol className="list-decimal list-inside space-y-2 pl-4">
            <li>Acesse a página de Perfil</li>
            <li>Localize a seção "Importar/Exportar Dados"</li>
            <li>Clique no botão "Importar Dados"</li>
            <li>Selecione o arquivo de backup previamente exportado</li>
            <li>Confirme a importação quando solicitado</li>
            <li>Aguarde a mensagem de confirmação</li>
          </ol>
          
          <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-100 dark:border-yellow-800 my-4">
            <AlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">Importante:</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                A importação de dados <strong>substituirá</strong> todas as suas informações atuais.
                Este processo não pode ser desfeito, então certifique-se de exportar seus dados atuais
                antes de importar um backup, caso queira preservar as informações atuais.
              </p>
            </div>
          </div>
          
          <h2 className="mt-6 mb-3">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">O que acontece com meus dados atuais quando faço uma importação?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Seus dados atuais serão completamente substituídos pelos dados do arquivo importado.
                Recomendamos fazer um backup dos seus dados atuais antes de importar novos dados.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Posso transferir meus dados entre dispositivos diferentes?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sim! Exporte seus dados no dispositivo de origem, transfira o arquivo para o dispositivo
                de destino e então importe os dados nesse novo dispositivo.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">É seguro armazenar o arquivo de backup?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                O arquivo de backup contém todas as suas informações do StayFocus. Recomendamos
                armazená-lo em um local seguro e não compartilhá-lo com terceiros, a menos que
                você esteja ciente de que todas as suas informações pessoais estão contidas nele.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Meu backup é compatível com versões futuras do StayFocus?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fazemos o possível para manter a compatibilidade com versões anteriores, mas
                ocasionalmente alterações estruturais podem ocorrer. Se encontrar problemas ao
                importar um backup antigo, entre em contato com o suporte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 