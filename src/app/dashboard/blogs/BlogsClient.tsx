'use client';

import DisplayCard from '@/Components/DisplayCards';
import Link from 'next/link';
import { useAuth } from '@/AuthProvider';
import { deleteBlog, getUserBlogs, type blogType } from '@/lib/blogs';
import Swal from 'sweetalert2';
import Spinner from '@/Components/Spinner';
import { useState, useEffect } from 'react';

interface BlogsClientProps {
  initialBlogs: blogType[];
}

function BlogsClient() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<blogType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserBlogs(user.companyId).then((res) => {
      setBlogs(res);
    });
  }, [user.companyId]);

  const handleDeleteBlog = (id: number | undefined) => async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed && id !== undefined) {
        try {
          setLoading(true);
          await deleteBlog(id);
          setBlogs(blogs.filter((blog) => blog.id !== id));
          Swal.fire('Deleted!', 'Your blog has been deleted.', 'success');
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete blog.', 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className='flex flex-col h-full'>
      <div className=''>
        <div className='flex flex-col gap-5 col-span-1 mx-8'>
          <DisplayCard className='min-h-[500px] my-5'>
            <div className='h-full flex flex-col'>
              <div className='pt-5 pb-2 mb-3 border-b-2 border-rose-600 flex items-center justify-between'>
                <h3 className='font-bold ubuntu-font text-2xl'>
                  Recent Blog Posts
                </h3>
                <Link href='/dashboard/blogs/new'>
                  <button className='bg-rose-600 cursor-pointer text-white px-5 py-1 rounded-2xl text-xs hover:bg-rose-700 transition'>
                    New Post
                  </button>
                </Link>
              </div>
              <div>
                <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
                  <table className='w-full text-sm text-left rtl:text-right text-muted-foreground'>
                    <thead className='text-xs text-white uppercase bg-rose-500'>
                      <tr>
                        <th scope='col' className='px-6 py-3'>
                          Blog Title
                        </th>
                        <th scope='col' className='px-6 py-3'>
                          <span className='sr-only'>Delete</span>
                        </th>
                        <th scope='col' className='px-6 py-3'>
                          <span className='sr-only'>Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={3} className='py-8'>
                            <Spinner className='mx-auto' />
                          </td>
                        </tr>
                      ) : blogs.length > 0 ? (
                        blogs.map((blog: blogType) => (
                          <tr
                            className='bg-card border-b border-border hover:bg-muted transition-colors'
                            key={blog.id}
                          >
                            <th
                              scope='row'
                              className='px-6 py-4 font-medium text-foreground whitespace-nowrap'
                            >
                              {blog.title}
                            </th>
                            <td className='px-6 py-4 text-right'>
                              <button
                                onClick={handleDeleteBlog(blog.id)}
                                className='font-medium text-red-600 hover:underline'
                              >
                                Delete
                              </button>
                            </td>
                            <td className='px-6 py-4 text-right'>
                              <Link
                                href={`/dashboard/blogs/edit/${blog.id}`}
                                className='font-medium text-rose-600 hover:underline'
                              >
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className='py-16 text-center'>
                            <div className='flex flex-col items-center gap-4'>
                              <div className='w-20 h-20 bg-muted rounded-full flex items-center justify-center'>
                                <svg
                                  className='w-10 h-10 text-rose-400'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className='text-foreground font-semibold text-lg mb-1'>
                                  No blog posts yet
                                </p>
                                <p className='text-muted-foreground text-sm'>
                                  Start writing your first blog post to share
                                  with your audience
                                </p>
                              </div>
                              <Link href='/dashboard/blogs/new'>
                                <button className='mt-2 bg-rose-600 text-white px-6 py-2 rounded-xl hover:bg-rose-700 transition font-medium'>
                                  Create Blog Post
                                </button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <span className='text-rose-600 cursor-pointer py-3 block mt-5'>
                  Read all blog posts
                </span>
              </div>
            </div>
          </DisplayCard>
        </div>
      </div>
    </div>
  );
}

export default BlogsClient;
