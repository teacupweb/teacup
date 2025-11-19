import DashboardHeader from '@/Components/DashboardHeader';
import DisplayCard from '@/Components/DisplayCards';
import { useParams } from 'react-router';

export default function Inbox() {
  const { id } = useParams();
  console.log(id);
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
                <h3 className='font-bold ubuntu-font text-2xl'>inbox</h3>
                {/* <Link to='/dashboard/Blogs/new'> */}
                <button className='bg-rose-600 cursor-pointer text-white px-5 py-1 rounded-2xl text-xs hover:bg-rose-700 transition'>
                  Inbox
                </button>
                {/* </Link> */}
              </div>
              <div>
                <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
                  <table className='w-full text-sm text-left rtl:text-right text-gray-500 '>
                    <thead className='text-xs text-gray-200 uppercase bg-rose-500'>
                      <tr>
                        <th scope='col' className='px-6 py-3'>
                          Messages
                        </th>
                        <th scope='col' className='px-6 py-3'>
                          <span className='sr-only'>View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='bg-white border-b border-gray-200 hover:bg-gray-50 '>
                        <th
                          scope='row'
                          className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'
                        >
                          Contact Info
                        </th>

                        <td className='px-6 py-4 text-right'>
                          <a
                            href='#'
                            className='font-medium text-rose-600 hover:underline'
                          >
                            Visit
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
