import './index.css';
import React, { useState, useEffect, useContext, createContext } from 'react';
import {
  type Session,
  type User,
  type UserResponse,
} from '@supabase/supabase-js';
import supabase from './supabaseClient';
// import { Auth } from '@supabase/auth-ui-react';
// import { ThemeSupa } from '@supabase/auth-ui-shared';

interface valueType {
  session: Session | null;
  user: User | null | 'userNotFound';
  signUpUser: (
    email: string,
    password: string,
    name: string
  ) => Promise<UserResponse>;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void> | void;
}

export const authContext = createContext({} as valueType);
export const useAuth = () => useContext(authContext);
export default function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null | 'userNotFound'>(null);

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
      // setUser(user);
      if (user) {
        setUser(user);
      } else {
        setUser('userNotFound');
      }
    });
    // console.log(user);
  }, []);
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
      window.location.reload();
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
      window.location.reload();
    }, 200);
  }
  function logout() {
    const data = supabase.auth.signOut();
    setUser('userNotFound');
    setTimeout(() => {
      window.location.reload();
    }, 200);
    console.log(data);
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
