'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '@/app/hooks/useAuth'

export function UserMenu() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Definir a inicial do nome do usuário ou email para exibir no avatar
  const userInitial = user?.user_metadata?.full_name 
    ? user.user_metadata.full_name.charAt(0).toUpperCase() 
    : user?.email?.charAt(0).toUpperCase() || 'U'

  // Fecha o menu quando clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Função para fazer logout
  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button 
        className="h-8 w-8 rounded-full bg-perfil-primary hover:bg-perfil-secondary text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-perfil-primary"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu do usuário"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium">{userInitial}</span>
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {user?.email}
            </p>
          </div>
          
          <Link href="/perfil">
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Perfil</span>
            </div>
          </Link>
          
          <Link href="/configuracoes">
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              <span>Configurações</span>
            </div>
          </Link>
          
          <button 
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sair</span>
          </button>
        </div>
      )}
    </div>
  )
} 