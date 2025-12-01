import './index.css';
import React, { useState, useEffect, useContext, createContext } from 'react';
import {
  type Session,
  type User,
  type UserResponse,
} from '@supabase/supabase-js';
import supabase from './supabaseClient';
import Spinner from '@/Components/Spinner';

interface valueType {
  session: Session | null;
  user: User | null | 'userNotFound';
  signUpUser: (
    email: string,
    password: string,
    name: string
  ) => Promise<UserResponse>;
  loginUser: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void> | void;
}

export const authContext = createContext({} as valueType);
export const useAuth = () => useContext(authContext);
export default function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null | 'userNotFound'>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? 'userNotFound');
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? 'userNotFound');
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className='h-screen w-full flex items-center justify-center bg-slate-50'>
        <Spinner size='lg' />
      </div>
    );
  }
  async function signUpUser(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,

      // options: {
      //   emailRedirectTo: 'https://example.com/welcome',
      // },
    });
    const updatedUser = await supabase.auth.updateUser({
      data: {
        name: name,
      },
    });
    // return updatedUser;
    // console.log(data);
    // console.log(data.session?.access_token);
    localStorage.setItem('token', JSON.stringify(data.session?.access_token));

    console.error(error);
    setTimeout(() => {
      window.location.href = '/welcome';
    }, 200);
    return updatedUser;
  }
  async function loginUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    // console.log(data);
    localStorage.setItem('token', JSON.stringify(data.session?.access_token));
    console.error(error);
    setTimeout(() => {
      window.location.href = '/welcome';
    }, 200);
  }
  async function signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      // options: {
      //   redirectTo: 'https://example.com/welcome',
      // },
    });

    console.error(error);

    // return data;
  }
  function logout() {
    supabase.auth.signOut();
    setUser('userNotFound');
    localStorage.clear();
    // setTimeout(() => {
    //   window.location.reload();
    // }, 500);
    // console.log(data);
  }
  const value: valueType = {
    session,
    user,
    signUpUser,
    loginUser,
    signInWithGoogle,
    logout,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
