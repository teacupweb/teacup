import DisplayCard from '@/Components/DisplayCards';
import DashboardHeader from '../Components/DashboardHeader';
import { Link } from 'react-router';
import { deleteUserBlog, userBlogs, type blogType } from '@/backendProvider';
import { useEffect, useState } from 'react';
import { useAuth } from '@/AuthProvider';
import Swal from 'sweetalert2';

function Blogs() {
  const { user } = useAuth();
  const [data, setData] = useState<blogType[]>([]);

  useEffect(() => {
    if (user === 'userNotFound' || !user?.email) {
      setData([]);
      return;
    }
    userBlogs(user.email).then((data) => {
      if (!data) {
        setData([]);
      } else {
        setData(data as blogType[]);
      }
    });
  }, [user]);
  // console.log(data);
  const handleDeleteBlog = (id: number | undefined) => async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (id !== undefined) {
          deleteUserBlog(id).then(() => {
            Swal.fire('Deleted!', 'Your blog has been deleted.', 'success');
            // Update the local state to remove the deleted blog
            setData((prevData) => prevData.filter((blog) => blog.id !== id));
          });
        }
      }
    });
  };
  return (
    <div className='flex flex-col h-full'>
      <DashboardHeader />
      <div className=''>
        {/* {Array.from({ length: 4 }).map((_, index) => (
          <DisplayCard className='col-span-1' key={index} />
        ))} */}
        {/* <DisplayCard className='col-span-3 '>
          <div>

            <div>
              <BlogForm />
            </div>
          </div>
        </DisplayCard> */}
        <div className='flex flex-col gap-5 col-span-1'>
          <DisplayCard className='min-h-screen my-5'>
            <div className='h-full flex flex-col'>
              <div className='pt-5 pb-2 mb-3 border-b-2 border-rose-600 flex items-center justify-between'>
                <h3 className='font-bold ubuntu-font text-2xl'>
                  Recent Blog Posts
                </h3>
                <Link to='/dashboard/Blogs/new'>
                  <button className='bg-rose-600 cursor-pointer text-white px-5 py-1 rounded-2xl text-xs hover:bg-rose-700 transition'>
                    New Post
                  </button>
                </Link>
              </div>
              <div>
                <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
                  <table className='w-full text-sm text-left rtl:text-right text-gray-500 '>
                    <thead className='text-xs text-gray-200 uppercase bg-rose-500'>
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
                      {data.map((blog: blogType) => (
                        <tr className='bg-white border-b border-gray-200 hover:bg-gray-50 '>
                          <th
                            scope='row'
                            className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'
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
                              to={`/dashboard/Blogs/edit/${blog.id}`}
                              className='font-medium text-rose-600 hover:underline'
                            >
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <span className='text-rose-600 cursor-pointer py-3 block mt-5'>
                  Read all blog posts
                </span>
              </div>
            </div>
          </DisplayCard>
          {/* <DisplayCard className='col-span-2' /> */}
          {/* <DisplayCard className='col-span-2' /> */}
        </div>
      </div>
    </div>
  );
}

export default Blogs;
