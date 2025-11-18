import './index.css';
import React, { useState, useEffect, useContext, use } from 'react';
import supabase from './supabaseClient';
// import { Auth } from '@supabase/auth-ui-react';
// import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createContext } from 'react';

interface valueType {
  session: any;
  user: any;
  signUpUser: (email: string, password: string, name: string) => void;
  loginUser: (email: string, password: string) => void;
  logout: () => void;
}

export const authContext = createContext({} as valueType);
export const useAuth = () => useContext(authContext);
export default function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    // console.log(session);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    // console.log(session);
    return () => subscription.unsubscribe();
  }, []);
  // console.log(user);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    // console.log(user);
  }, [session]);
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
  }
  async function loginUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    // console.log(data);
    localStorage.setItem('token', JSON.stringify(data.session?.access_token));
    console.error(error);
  }
  function logout() {
    supabase.auth.signOut();
  }
  const value: valueType = {
    session,
    user,
    signUpUser,
    loginUser,
    logout,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
