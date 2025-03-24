'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Toast } from '../components/ui/Toast'

type ToastType = 'success' | 'error' | 'info' | 'warning'

type ToastContextType = {
  showToast: (message: string, type: ToastType, duration?: number) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider')
  }
  return context
}

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<{
    message: string
    type: ToastType
    duration: number
    show: boolean
  }>({
    message: '',
    type: 'info',
    duration: 5000,
    show: false
  })

  const showToast = (message: string, type: ToastType = 'info', duration: number = 5000) => {
    setToast({
      message,
      type,
      duration,
      show: true
    })
  }

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      show: false
    }))
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        show={toast.show}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  )
} 