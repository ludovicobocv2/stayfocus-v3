'use client'

import { useAuth } from '@/app/hooks/useAuth'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import { UserMenu } from './UserMenu'

export function AuthControl() {
  const { user, loading } = useAuth()

  // Se estiver carregando, mostrar um indicador de carregamento
  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
        <span className="sr-only">Carregando...</span>
      </div>
    )
  }

  // Se o usuário estiver autenticado, mostrar o menu do usuário
  if (user) {
    return <UserMenu />
  }

  // Se não estiver autenticado, mostrar opção de login
  return (
    <Link href="/auth/login">
      <button 
        className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Fazer login"
      >
        <LogIn className="h-4 w-4" />
        <span>Entrar</span>
      </button>
    </Link>
  )
} 