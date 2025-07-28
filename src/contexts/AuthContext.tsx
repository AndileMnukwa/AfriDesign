
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Input validation and sanitization
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedFullName = fullName?.trim().replace(/[<>\"'&]/g, '') || '';
    
    // Basic validation
    if (!sanitizedEmail || !password) {
      return { error: { message: 'Email and password are required' } };
    }
    
    if (password.length < 6) {
      return { error: { message: 'Password must be at least 6 characters long' } };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return { error: { message: 'Please enter a valid email address' } };
    }
    
    const redirectUrl = `${window.location.origin}/`;
    
    try {
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: sanitizedFullName
          }
        }
      });
      return { error };
    } catch (networkError) {
      console.error('Network error during signup:', networkError);
      return { error: { message: 'Network error. Please check your connection and try again.' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Input validation and sanitization
    const sanitizedEmail = email.trim().toLowerCase();
    
    if (!sanitizedEmail || !password) {
      return { error: { message: 'Email and password are required' } };
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });
      return { error };
    } catch (networkError) {
      console.error('Network error during signin:', networkError);
      return { error: { message: 'Network error. Please check your connection and try again.' } };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
