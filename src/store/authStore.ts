import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, Company } from '@/types';
import { supabase } from '@/supabase';

interface AuthState {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, companyName: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      company: null,
      isAuthenticated: false,
      isLoading: true,

      initializeAuth: async () => {
        try {
          set({ isLoading: true });
          const { data: { session } } = await supabase.auth.getSession();

          if (!session) {
            set({ user: null, company: null, isAuthenticated: false, isLoading: false });
            return;
          }

          // Fetch profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError.message);
            set({ user: null, company: null, isAuthenticated: false, isLoading: false });
            return;
          }

          set({
            user: {
              id: session.user.id,
              name: profileData.name || 'User',
              email: session.user.email!,
              role: profileData.role || 'admin',
              companyId: profileData.company_id || 'default-company',
              avatar: profileData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
              createdAt: new Date(session.user.created_at),
              lastLogin: new Date(),
              apiKey: profileData.api_key,
              model: profileData.ai_model,
              googleAccessToken: profileData.google_access_token,
            },
            company: {
              id: profileData.company_id || 'default-company',
              name: profileData.company_name || 'My Company',
              plan: 'starter',
              createdAt: new Date()
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error || !data.user) {
            return { success: false, error: error?.message || 'Login failed' };
          }

          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            if (profileError.message.includes('503') || profileError.message.includes('fetch')) {
              return { success: false, error: 'Database service unavailable. Please check your Supabase project status.' };
            }
            return { success: false, error: 'User profile not found.' };
          }

          set({
            user: {
              id: data.user.id,
              name: profileData.name || 'User',
              email: data.user.email!,
              role: profileData.role || 'admin',
              companyId: profileData.company_id || '11111111-1111-1111-1111-111111111111',
              avatar: profileData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
              createdAt: new Date(data.user.created_at),
              lastLogin: new Date(),
              apiKey: profileData.api_key,
              model: profileData.ai_model,
              googleAccessToken: profileData.google_access_token,
            },
            company: {
              id: profileData.company_id || '11111111-1111-1111-1111-111111111111',
              name: profileData.company_name || 'My Company',
              plan: 'starter',
              createdAt: new Date()
            },
            isAuthenticated: true,
          });

          return { success: true };
        } catch (err: any) {
          return { success: false, error: err?.message || 'An unexpected error occurred' };
        }
      },

      signup: async (name: string, email: string, password: string, companyName: string) => {
        try {
          const { data: userData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name, company_name: companyName }
            }
          });

          if (authError || !userData.user) {
            return { success: false, error: authError?.message || 'Signup failed' };
          }

          // Create base profile
          const { error: dbError } = await supabase
            .from('profiles')
            .insert([{
              id: userData.user.id,
              name,
              company_name: companyName,
              role: 'admin'
            }]);

          if (dbError && dbError.code !== '23505') {
            console.error('Profile creation error:', dbError);
          }

          // If session exists, user is auto-confirmed or confirmation is disabled
          if (userData.session) {
            set({
              user: {
                id: userData.user.id,
                name,
                email,
                role: 'admin',
                companyId: '11111111-1111-1111-1111-111111111111',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                createdAt: new Date(),
                lastLogin: new Date(),
              },
              company: { id: '11111111-1111-1111-1111-111111111111', name: companyName, plan: 'starter', createdAt: new Date() },
              isAuthenticated: true,
            });
            return { success: true };
          }

          // If no session, verification email was sent
          return { success: true, needsVerification: true };
        } catch (err: any) {
          return { success: false, error: err?.message || 'An unexpected error occurred' };
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, company: null, isAuthenticated: false });
      },

      updateUser: async (updates) => {
        const { user } = get();
        if (!user) return;

        // Map camelCase to snake_case for Supabase
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.apiKey) dbUpdates.api_key = updates.apiKey;
        if (updates.model) dbUpdates.ai_model = updates.model;
        if (updates.googleAccessToken) dbUpdates.google_access_token = updates.googleAccessToken;
        if (updates.role) dbUpdates.role = updates.role;
        if (updates.avatar) dbUpdates.avatar_url = updates.avatar;

        const { error } = await supabase
          .from('profiles')
          .update(dbUpdates)
          .eq('id', user.id);

        if (error) {
          console.error('Error updating user profile:', error.message);
        }

        set({ user: { ...user, ...updates } });
      },

      hasRole: (roles) => {
        const { user } = get();
        return user ? roles.includes(user.role) : false;
      },
    }),
    {
      name: 'nexuscrm-auth',
      partialize: (state) => ({
        user: state.user,
        company: state.company,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
