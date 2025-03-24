import { useState } from 'react';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  visible: boolean;
}

/**
 * Hook personalizado para exibir mensagens toast na aplicação
 * @returns Funções e estado para gerenciar toasts
 */
export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    visible: false,
  });

  /**
   * Exibe uma mensagem toast
   * @param message Mensagem a ser exibida
   * @param type Tipo de toast (sucesso, erro, informação ou alerta)
   */
  const showToast = (
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) => {
    setToast({
      message,
      type,
      visible: true,
    });

    // Esconde o toast após 5 segundos
    setTimeout(() => {
      hideToast();
    }, 5000);
  };

  /**
   * Esconde o toast atual
   */
  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      visible: false,
    }));
  };

  return {
    toast,
    showToast,
    hideToast,
  };
} 