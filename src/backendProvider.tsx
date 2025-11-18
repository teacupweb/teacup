// import supabase from './supabaseClient';
// import { Database } from './database.types';
import { useEffect, useState } from 'react';
import { getBlogs, insertBlog } from './app/Blogs';
import { useAuth } from './AuthProvider';
export type blogType = {
  title: string;
  image: string;
  data: string;
  created_by: string;
};
export async function userBlogs(email: string) {
  //   const { user } = useAuth();
  const data = await getBlogs(email);
  return data;
}

export function postBlog(data: blogType) {
  //   console.log(blog);
  insertBlog(data);
}
