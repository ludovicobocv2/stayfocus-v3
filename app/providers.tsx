'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { SupabaseProvider } from './components/providers/supabase-provider'
import { ReactNode } from 'react'

type ProvidersProps = ThemeProviderProps & {
  children: ReactNode
}

export function Providers({ children, ...props }: ProvidersProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      <SupabaseProvider>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </SupabaseProvider>
    </NextThemesProvider>
  )
}
