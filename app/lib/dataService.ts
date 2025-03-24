/**
 * Serviço para exportação e importação de dados do StayFocus
 * Permite que usuários façam backup de seus dados e os restaurem quando necessário
 */

// Importações das stores
import { useFinancasStore } from '../stores/financasStore';
import { useAlimentacaoStore } from '../stores/alimentacaoStore';
import { useAutoconhecimentoStore } from '../stores/autoconhecimentoStore';
import { useHiperfocosStore } from '../stores/hiperfocosStore';
import { usePainelDiaStore } from '../stores/painelDiaStore';
import { usePerfilStore } from '../stores/perfilStore';
import { usePomodoroStore } from '../stores/pomodoroStore';
import { usePrioridadesStore } from '../stores/prioridadesStore';
import { useRegistroEstudosStore } from '../stores/registroEstudosStore';
import { useSonoStore } from '../stores/sonoStore';
import { useAtividadesStore } from '../stores/atividadesStore';
import { useAppStore } from '../store'; // Store global que contém dados de saúde e lazer

/**
 * Exporta todos os dados do aplicativo para um arquivo JSON
 * @returns Objeto com informação de sucesso e mensagem
 */
export const exportarDados = (): { sucesso: boolean; mensagem?: string; erro?: string } => {
  try {
    // Coletar todos os dados dos stores
    const financas = useFinancasStore.getState();
    const alimentacao = useAlimentacaoStore.getState();
    const autoconhecimento = useAutoconhecimentoStore.getState();
    const hiperfocos = useHiperfocosStore.getState();
    const painelDia = usePainelDiaStore.getState();
    const perfil = usePerfilStore.getState();
    const pomodoro = usePomodoroStore.getState();
    const prioridades = usePrioridadesStore.getState();
    const registroEstudos = useRegistroEstudosStore.getState();
    const sono = useSonoStore.getState();
    const atividades = useAtividadesStore.getState();
    const appGlobal = useAppStore.getState(); // Obter dados da store global
    
    // Formato unificado com metadados
    const dadosExportados = {
      versao: '1.0',
      timestamp: new Date().toISOString(),
      dados: {
        financas: limparFuncoesDoObjeto(financas),
        alimentacao: limparFuncoesDoObjeto(alimentacao),
        autoconhecimento: limparFuncoesDoObjeto(autoconhecimento),
        hiperfocos: limparFuncoesDoObjeto(hiperfocos),
        painelDia: limparFuncoesDoObjeto(painelDia),
        perfil: limparFuncoesDoObjeto(perfil),
        pomodoro: limparFuncoesDoObjeto(pomodoro),
        prioridades: limparFuncoesDoObjeto(prioridades),
        registroEstudos: limparFuncoesDoObjeto(registroEstudos),
        sono: limparFuncoesDoObjeto(sono),
        atividades: limparFuncoesDoObjeto(atividades),
        appGlobal: limparFuncoesDoObjeto(appGlobal), // Adicionar dados globais que incluem saúde e lazer
      }
    };
    
    // Converter para JSON e criar arquivo para download
    const jsonString = JSON.stringify(dadosExportados, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Criar link de download com nome de arquivo padronizado
    const dataFormatada = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `stayfocus_backup_${dataFormatada}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    return {
      sucesso: true,
      mensagem: 'Dados exportados com sucesso'
    };
  } catch (error: unknown) {
    console.error('Erro ao exportar dados:', error);
    
    let mensagemErro = 'Erro desconhecido';
    if (error instanceof Error) {
      mensagemErro = error.message;
    }
    
    return {
      sucesso: false,
      erro: `Erro ao exportar dados: ${mensagemErro}`
    };
  }
};

/**
 * Limpa as funções de um objeto para exportação JSON
 * @param obj Objeto a ser limpo
 * @returns Objeto sem funções
 */
const limparFuncoesDoObjeto = (obj: Record<string, any>): Record<string, any> => {
  // Criar cópia do objeto
  const resultado = {...obj};
  
  // Remover todas as funções pois não podem ser serializadas em JSON
  Object.keys(resultado).forEach(key => {
    if (typeof resultado[key] === 'function') {
      delete resultado[key];
    }
  });
  
  return resultado;
};

/**
 * Valida a estrutura de dados importados
 * @param dados Dados a serem validados
 * @returns Objeto com informação de validade e possível erro
 */
export const validarDadosImportados = (dados: any): { valido: boolean; erro?: string } => {
  // Verificar estrutura básica
  if (!dados?.versao || !dados?.timestamp || !dados?.dados) {
    return { valido: false, erro: 'Formato de arquivo inválido' };
  }
  
  // Verificar versão compatível
  if (dados.versao !== '1.0') {
    return { 
      valido: false, 
      erro: `Versão incompatível: ${dados.versao}. Esperada: 1.0` 
    };
  }
  
  // Verificar presença de pelo menos um módulo de dados
  if (Object.keys(dados.dados).length === 0) {
    return { valido: false, erro: 'Arquivo de backup vazio' };
  }
  
  return { valido: true };
};

/**
 * Importa dados de um arquivo JSON para o aplicativo
 * @param arquivo Arquivo a ser importado
 * @returns Objeto com informação de sucesso e mensagem
 */
export const importarDados = async (arquivo: File): Promise<{ sucesso: boolean; mensagem?: string; timestamp?: string; erro?: string }> => {
  try {
    // Ler arquivo
    const texto = await arquivo.text();
    const dados = JSON.parse(texto);
    
    // Validar dados
    const validacao = validarDadosImportados(dados);
    if (!validacao.valido) {
      return { sucesso: false, erro: validacao.erro };
    }
    
    // Aplicar dados aos stores
    if (dados.dados.financas) {
      const financas = dados.dados.financas;
      useFinancasStore.setState(state => ({
        ...state,
        ...financas
      }));
    }
    
    if (dados.dados.alimentacao) {
      const alimentacao = dados.dados.alimentacao;
      useAlimentacaoStore.setState(state => ({
        ...state,
        ...alimentacao
      }));
    }
    
    if (dados.dados.autoconhecimento) {
      const autoconhecimento = dados.dados.autoconhecimento;
      useAutoconhecimentoStore.setState(state => ({
        ...state,
        ...autoconhecimento
      }));
    }
    
    if (dados.dados.hiperfocos) {
      const hiperfocos = dados.dados.hiperfocos;
      useHiperfocosStore.setState(state => ({
        ...state,
        ...hiperfocos
      }));
    }
    
    if (dados.dados.painelDia) {
      const painelDia = dados.dados.painelDia;
      usePainelDiaStore.setState(state => ({
        ...state,
        ...painelDia
      }));
    }
    
    if (dados.dados.perfil) {
      const perfil = dados.dados.perfil;
      usePerfilStore.setState(state => ({
        ...state,
        ...perfil
      }));
    }
    
    if (dados.dados.pomodoro) {
      const pomodoro = dados.dados.pomodoro;
      usePomodoroStore.setState(state => ({
        ...state,
        ...pomodoro
      }));
    }
    
    if (dados.dados.prioridades) {
      const prioridades = dados.dados.prioridades;
      usePrioridadesStore.setState(state => ({
        ...state,
        ...prioridades
      }));
    }
    
    if (dados.dados.registroEstudos) {
      const registroEstudos = dados.dados.registroEstudos;
      useRegistroEstudosStore.setState(state => ({
        ...state,
        ...registroEstudos
      }));
    }
    
    if (dados.dados.sono) {
      const sono = dados.dados.sono;
      useSonoStore.setState(state => ({
        ...state,
        ...sono
      }));
    }
    
    if (dados.dados.atividades) {
      const atividades = dados.dados.atividades;
      useAtividadesStore.setState(state => ({
        ...state,
        ...atividades
      }));
    }
    
    if (dados.dados.appGlobal) {
      const appGlobal = dados.dados.appGlobal;
      useAppStore.setState(state => ({
        ...state,
        ...appGlobal
      }));
    }
    
    return { 
      sucesso: true, 
      mensagem: 'Dados importados com sucesso',
      timestamp: dados.timestamp
    };
  } catch (error: unknown) {
    console.error('Erro ao importar dados:', error);
    
    let mensagemErro = 'Erro desconhecido';
    if (error instanceof Error) {
      mensagemErro = error.message;
    }
    
    return { 
      sucesso: false, 
      erro: `Erro ao importar dados: ${mensagemErro}` 
    };
  }
}; 