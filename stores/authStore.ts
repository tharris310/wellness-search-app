import { create } from 'zustand';
import { authService, User, Session } from '@/lib/services';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  initialize: async () => {
    try {
      const session = await authService.getSession();
      set({
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
      });

      // Listen for auth changes
      authService.onAuthStateChange((session) => {
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session,
        });
      });
    } catch {
      set({ isLoading: false });
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.signIn(email, password);
      if (result) {
        set({
          user: result.user,
          session: result.session,
          isAuthenticated: true,
        });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to sign in',
      });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.signUp(email, password, name);
      if (result) {
        set({
          user: result.user,
          session: result.session,
          isAuthenticated: true,
        });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to sign up',
      });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
      set({ user: null, session: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
