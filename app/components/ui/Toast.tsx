'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

type ToastProps = {
  type: ToastType
  message: string
  duration?: number
  onClose?: () => void
  show: boolean
}

// Estado global para o toast atual
let toastCallback: ((props: { title?: string, description: string, variant?: ToastType }) => void) | null = null;

export function Toast({
  type = 'info',
  message,
  duration = 5000,
  onClose,
  show
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)
  }, [show])

  useEffect(() => {
    if (!isVisible) return

    // Auto close after duration
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, isVisible])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  // Se não estiver visível, não renderizar nada
  if (!isVisible) return null

  // Classes baseadas no tipo de toast
  const typeClasses = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200'
  }

  // Ícones baseados no tipo de toast
  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`p-4 rounded-md shadow-md border-l-4 flex items-start gap-3 max-w-md animate-fade-in-up ${typeClasses[type]}`}
      >
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button 
          onClick={handleClose}
          className="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Fechar"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

// Cria uma função toast que os outros componentes podem usar
export function setToastCallback(callback: (props: { title?: string, description: string, variant?: ToastType }) => void) {
  toastCallback = callback;
}

// Função para mostrar um toast
export const toast = (props: { title?: string, description: string, variant?: ToastType }) => {
  if (toastCallback) {
    toastCallback(props);
  } else {
    // Fallback para console quando o componente Toast não estiver montado
    console.log(`Toast: ${props.title || ''} - ${props.description}`);
  }
}

// Animação para o toast
// Adicione isso ao seu arquivo globals.css ou tailwind.config.js
// @keyframes fadeInUp {
//   from {
//     opacity: 0;
//     transform: translateY(1rem);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
// .animate-fade-in-up {
//   animation: fadeInUp 0.3s ease-out;
// } 