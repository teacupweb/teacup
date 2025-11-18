// import supabase from './supabaseClient';
// import { Database } from './database.types';
import { getBlogs, insertBlog } from './app/Blogs';

export function blogs(email: string) {
  getBlogs(email);
}
export type blogType = {
  title: string;
  image: string;
  data: string;
  created_by: string;
};
export function postBlog(data: blogType) {
  //   console.log(blog);
  insertBlog(data);
}
