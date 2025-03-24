'use client'

import { useCallback, useEffect, useState } from 'react';
import { useSupabase } from '../components/providers/supabase-provider';
import { useRouter } from 'next/navigation';
import { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const { supabase } = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  // Função para sincronizar dados do localStorage com Supabase
  const syncLocalDataWithSupabase = useCallback(async (userId: string) => {
    try {
      const localData = localStorage.getItem('zustand');
      if (!localData) return;

      const parsedData = JSON.parse(localData);
      const state = parsedData?.state;

      if (!state) return;

      // Sincronizar prioridades
      if (state.prioridades?.length > 0) {
        const { error: prioritiesError } = await supabase
          .from('priorities')
          .upsert(
            state.prioridades.map((p: any) => ({
              user_id: userId,
              content: p.texto,
              completed: p.concluida,
              category: p.categoria,
              due_date: p.dataVencimento
            })),
            { onConflict: 'user_id,content' }
          );

        if (prioritiesError) console.error('Erro ao sincronizar prioridades:', prioritiesError);
      }

      // Sincronizar medicamentos
      if (state.medicamentos?.length > 0) {
        const { error: medsError } = await supabase
          .from('medications')
          .upsert(
            state.medicamentos.map((m: any) => ({
              user_id: userId,
              name: m.nome,
              dosage: m.dosagem,
              frequency: m.frequencia,
              schedule: m.horarios,
              start_date: m.dataInicio,
              notes: m.observacoes,
              last_taken: m.ultimaTomada,
              interval_minutes: m.intervalo
            })),
            { onConflict: 'user_id,name,dosage' }
          );

        if (medsError) console.error('Erro ao sincronizar medicamentos:', medsError);
      }

      // Sincronizar registros de humor
      if (state.registrosHumor?.length > 0) {
        const { error: moodError } = await supabase
          .from('mood_records')
          .upsert(
            state.registrosHumor.map((r: any) => ({
              user_id: userId,
              record_date: r.data,
              mood_level: r.nivel,
              factors: r.fatores,
              notes: r.notas
            })),
            { onConflict: 'user_id,record_date' }
          );

        if (moodError) console.error('Erro ao sincronizar registros de humor:', moodError);
      }

      // Sincronizar registros de sono
      if (state.registrosSono?.length > 0) {
        const { error: sleepError } = await supabase
          .from('sleep_records')
          .upsert(
            state.registrosSono.map((s: any) => ({
              user_id: userId,
              start_time: s.horaInicio,
              end_time: s.horaFim,
              quality: s.qualidade,
              notes: s.observacoes
            })),
            { onConflict: 'user_id,start_time' }
          );

        if (sleepError) console.error('Erro ao sincronizar registros de sono:', sleepError);
      }
    } catch (err) {
      console.error('Erro ao sincronizar dados:', err);
    }
  }, [supabase]);

  // Carregar o usuário e sessão inicial
  useEffect(() => {
    let mounted = true;

    async function loadUserSession() {
      try {
        setLoading(true);
        
        // Obter sessão atual
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);

          // Se houver uma sessão, sincronizar dados
          if (currentSession?.user) {
            await syncLocalDataWithSupabase(currentSession.user.id);
          }
        }
        
        // Configurar listener para mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
          if (mounted) {
            setSession(newSession);
            setUser(newSession?.user || null);

            // Se houver uma nova sessão, sincronizar dados
            if (newSession?.user) {
              await syncLocalDataWithSupabase(newSession.user.id);
            }
          }
        });
        
        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar usuário'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    
    loadUserSession();

    return () => {
      mounted = false;
    };
  }, [supabase, syncLocalDataWithSupabase]);

  // Função de login com email/senha
  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        
        // Se o login for bem-sucedido, sincronizar dados
        if (data?.user) {
          await syncLocalDataWithSupabase(data.user.id);
        }
        
        return { data, error: null };
      } catch (err) {
        console.error('Erro ao fazer login:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido ao fazer login'));
        return { data: null, error: err };
      } finally {
        setLoading(false);
      }
    },
    [supabase, syncLocalDataWithSupabase]
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
      
      router.push('/auth/login');
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao fazer logout'));
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

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