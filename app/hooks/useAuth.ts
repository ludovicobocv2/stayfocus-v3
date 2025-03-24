import { useCallback, useEffect, useState } from 'react';
import { createClient } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar o usuário e sessão inicial
  useEffect(() => {
    async function loadUserSession() {
      try {
        setLoading(true);
        
        // Obter sessão atual
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Configurar listener para mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user || null);
        });
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar usuário'));
      } finally {
        setLoading(false);
      }
    }
    
    loadUserSession();
  }, [supabase]);

  // Função de login com email/senha
  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        
        return { data, error: null };
      } catch (err) {
        console.error('Erro ao fazer login:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido ao fazer login'));
        return { data: null, error: err };
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  // Função de cadastro com email/senha
  const signUpWithEmail = useCallback(
    async (email: string, password: string, userData?: { [key: string]: any }) => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData
          }
        });
        
        if (signUpError) throw signUpError;
        return { data, error: null };
      } catch (err) {
        console.error('Erro ao criar conta:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido ao criar conta'));
        return { data: null, error: err };
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  // Função de logout
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao fazer logout'));
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Login com OAuth (Google)
  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (oauthError) throw oauthError;
      return { data, error: null };
    } catch (err) {
      console.error('Erro ao fazer login com Google:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao fazer login com Google'));
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  return {
    user,
    session,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    signInWithGoogle
  };
} 