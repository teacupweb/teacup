'use client';
import React, { useState, useEffect, useContext, createContext } from 'react';
import { authClient } from '@/lib/auth-client';
import Spinner from '@/Components/Spinner';
import type { CompanyData } from '@/types/schema';

interface valueType {
  session: any | null;
  user: any | null | 'userNotFound';
  signUpUser: (
    email: string,
    password: string,
    name: string,
  ) => Promise<any>;
  loginUser: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUserCompanyInfo: (data: CompanyData) => Promise<void>;
  logout: () => Promise<void> | void;
}

export const authContext = createContext({} as valueType);
export const useAuth = () => useContext(authContext);

export default function AuthProviderBetterAuth({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any | null | 'userNotFound'>('userNotFound');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: sessionData } = await authClient.getSession();
        setSession(sessionData);
        setUser(sessionData?.user || 'userNotFound');
      } catch (error) {
        console.error('Error getting session:', error);
        setUser('userNotFound');
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  if (loading) {
    return (
      <div className='h-screen w-full flex items-center justify-center bg-slate-50'>
        <Spinner size='lg' />
      </div>
    );
  }

  async function signUpUser(email: string, password: string, name: string) {
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        throw new Error(error.message || 'Sign up failed');
      }

      localStorage.setItem('token', JSON.stringify(data?.token));
      
      setTimeout(() => {
        window.location.href = '/welcome';
      }, 200);
      
      return data;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async function loginUser(email: string, password: string) {
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || 'Login failed');
      }

      localStorage.setItem('token', JSON.stringify(data?.token));
      
      setTimeout(() => {
        window.location.href = '/welcome';
      }, 200);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function signInWithGoogle(): Promise<void> {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/welcome`,
      });
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  async function updateUserCompanyInfo(data: CompanyData): Promise<void> {
    try {
      // For now, we'll store this info in localStorage as metadata
      // Better Auth doesn't support arbitrary metadata in the same way as Supabase
      localStorage.setItem('companyInfo', JSON.stringify({
        company_id: data.id,
        owner_email: data.owner
      }));
      console.log('Company info stored locally:', data);
    } catch (error: any) {
      console.error('Error updating user metadata:', error.message);
      throw error;
    }
  }

  async function logout() {
    try {
      await authClient.signOut();
      setUser('userNotFound');
      localStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
      setUser('userNotFound');
      localStorage.clear();
    }
  }

  const value: valueType = {
    session,
    user,
    signUpUser,
    loginUser,
    signInWithGoogle,
    updateUserCompanyInfo,
    logout,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
