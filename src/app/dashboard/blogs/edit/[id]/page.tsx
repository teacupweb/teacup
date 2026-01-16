"use client";

import NewBlog from '@/Dashboard/NewBlog';
import { use } from 'react';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <NewBlog isEditMode />;
}
