'use client'

import { useState } from 'react'
import { Menu, X, Sun, Moon, HelpCircle, Anchor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Sidebar } from './Sidebar'
import Link from 'next/link'
import { AuthControl } from './AuthControl'
import { ThemeToggle } from './ThemeToggle'
import { SyncStatus } from '../SyncStatus'
import { useAuthContext } from '@/app/context/AuthContext'

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user } = useAuthContext()
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Função para abrir o sidebar
  const openSidebar = () => {
    setSidebarOpen(true)
  }

  // Função para fechar o sidebar
  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <>
      {/* Sidebar controlável */}
      {sidebarOpen && (
        <Sidebar onClose={closeSidebar} />
      )}
      
      {/* Header fixo no topo */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold sm:inline-block">
                MyNeuroApp
              </span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Logo e menu button */}
              <div className="flex items-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={openSidebar}
                  aria-label="Abrir menu"
                >
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="ml-3 flex items-center">
                  <span className="sr-only">StayFocus</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user && <SyncStatus />}
              <ThemeToggle />
              <AuthControl />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
