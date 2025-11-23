import { useState, useEffect, useCallback } from 'react';
import {
  getBlogs,
  insertBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "./app/Blogs";
import { createInbox, getInboxData, getInboxes, deleteInboxData, deleteInbox } from "./app/inbox";

// Blog part --
export type blogType = {
  id?: number;
  title: string;
  image: string;
  data: string;
  created_by: string;
};

export function useUserBlogs(email: string | undefined | null) {
  const [blogs, setBlogs] = useState<blogType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchBlogs = useCallback(async () => {
    if (!email) {
      setBlogs([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getBlogs(email);
      setBlogs((data as blogType[]) || []);
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, loading, error, refetch: fetchBlogs };
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

// blog part end
// inbox part --

export function useUserInboxes(email: string | undefined | null) {
  const [inboxes, setInboxes] = useState<inboxType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchInboxes = useCallback(async () => {
    if (!email) {
      setInboxes([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getInboxes(email);
      setInboxes((data as inboxType[]) || []);
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Error fetching inboxes:", err);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchInboxes();
  }, [fetchInboxes]);

  return { inboxes, loading, error, refetch: fetchInboxes };
}

export type inboxType = {
  id?: number;
  created_by: string;
  name: string;
};
export async function createUserInbox(inbox: inboxType) {
  const data = await createInbox(inbox);
  return data;
}
//Inbox Data

export function useInboxData(id: string | undefined) {
  const [inboxData, setInboxData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchInboxData = useCallback(async () => {
    if (!id) {
      setInboxData(null);
      return;
    }
    setLoading(true);
    try {
      const data = await getInboxData(id);
      setInboxData(data);
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Error fetching inbox data:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInboxData();
  }, [fetchInboxData]);

  return { inboxData, loading, error, refetch: fetchInboxData };
}

export async function deleteUserInboxData(id: string) {
  const data = await deleteInboxData(id);
  return data;
}
