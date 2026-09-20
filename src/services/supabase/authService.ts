import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured;
  },

  async signUp(email: string, password: string) {
    if (!isSupabaseConfigured) {
      return { data: null, error: 'Supabase cloud sync is not configured. Using offline guest mode.' };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      return { data: null, error: message };
    }
  },

  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      return { data: null, error: 'Supabase cloud sync is not configured. Using offline guest mode.' };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      return { data: null, error: message };
    }
  },

  async signOut() {
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      return { error: message };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) {
      return null;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch {
      return null;
    }
  },

  async getSession(): Promise<Session | null> {
    if (!isSupabaseConfigured) {
      return null;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch {
      return null;
    }
  },

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    try {
      return supabase.auth.onAuthStateChange(callback);
    } catch {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
};
