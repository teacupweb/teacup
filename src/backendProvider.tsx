// import supabase from './supabaseClient';
// import { Database } from './database.types';

import {
  getBlogs,
  insertBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
} from './app/Blogs';

export type blogType = {
  id?: number;
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
  const newData = insertBlog(data);
  return newData;
}
export function getUserBlogById(id: number) {
  const data = getBlogById(id);
  return data;
}
export function updateUserBlog(id: number, blog: blogType) {
  const data = updateBlog(id, blog);
  return data;
}
export async function deleteUserBlog(id: number) {
  //   console.log(blog);
  const data = await deleteBlog(id);
  return data;
}
