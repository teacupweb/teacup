import DisplayCard from '@/Components/DisplayCards';
import DashboardHeader from '../Components/DashboardHeader';
import websiteData from '@/assets/websiteData.json';
// import { DynamicIcon } from 'lucide-react/dynamic';
import {
  Bar,
  Tooltip,
  ComposedChart,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '@/AuthProvider';

function Dashboard() {
  // const { user } = useAuth();
  // const navigate = useNavigate();
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (user) {
  //       navigate('/Dashboard');
  //     }
  //   }, 300);
  // });
  return (
    <div className='flex flex-col'>
      <DashboardHeader />
      <div className='grid grid-cols-4 gap-5'>
        {websiteData.info.map((item, index) => (
          <DisplayCard
            resetClass
            className='col-span-1 bg-rose-500 text-white '
            key={index}
          >
            {/* <DynamicIcon
              // @ts-ignore
              name={item.icon}
              size={48}
            /> */}
            <h3 className='font-extrabold ubuntu-font text-2xl my-2'>
              {item.title}
            </h3>
            <span className='text-xl text-gray-100 mb-5'>
              {item.description}
            </span>
            <span className='font-bold text-7xl ubuntu-font block'>
              {Array.isArray(item.data) ? item.data.length : item.data}
            </span>
          </DisplayCard>
        ))}
        <DisplayCard className='col-span-2 row-span-2'>
          <div className='h-full flex flex-col'>
            <div className='pt-5 pb-2 mb-3 border-b-2 border-rose-600'>
              <h3 className='font-bold mb-2 ubuntu-font text-2xl'>
                New Messages
              </h3>
            </div>
            <div>
              <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
                <table className='w-full text-sm text-left rtl:text-right text-gray-500'>
                  <thead className='text-xs text-gray-200 uppercase bg-rose-500'>
                    <tr>
                      <th scope='col' className='px-6 py-3'>
                        Name
                      </th>

                      <th scope='col' className='px-6 py-3'>
                        inboxes
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Date
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        <span className='sr-only'>Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='bg-white border-b border-gray-200 hover:bg-gray-50'>
                      <th
                        scope='row'
                        className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'
                      >
                        John Doe
                      </th>

                      <td className='px-6 py-4'>Inquiry</td>
                      <td className='px-6 py-4'>11-9-2025</td>
                      <td className='px-6 py-4 text-right'>
                        <a
                          href='#'
                          className='font-medium text-rose-600 hover:underline'
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <span className='text-rose-600 cursor-pointer py-3 block mt-5'>
                See all messages
              </span>
            </div>
          </div>
        </DisplayCard>
        <div className='flex flex-col gap-5 col-span-2'>
          <DisplayCard className='col-span-2 row-span-2 p-4 sm:p-6 from-slate-50 to-blue-50/30 border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300'>
            <div className='h-full flex flex-col'>
              {/* Header Section */}
              <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0'>
                <div>
                  <h3 className='font-bold ubuntu-font text-xl sm:text-2xl text-slate-800 mb-1'>
                    Activity Overview
                  </h3>
                  <p className='text-slate-500 text-sm'>
                    Last 7 days performance
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-rose-500'></div>
                    <span className='text-slate-600 text-sm font-medium'>
                      Visits
                    </span>
                  </div>
                  <div className='h-4 w-px bg-slate-300'></div>
                  <div className='text-sm text-slate-700 font-semibold'>
                    {websiteData.activityData
                      .reduce((sum, day) => sum + day.visits, 0)
                      .toLocaleString()}{' '}
                    total
                  </div>
                </div>
              </div>

              {/* Chart Section - Now Responsive */}
              <div className='flex-1 -mx-1 sm:-mx-2 -mb-2 min-h-[200px] sm:min-h-[250px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <ComposedChart
                    data={websiteData.activityData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient
                        id='barGradient'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='0%'
                          stopColor='#ff2056'
                          stopOpacity={0.9}
                        />
                        <stop
                          offset='100%'
                          stopColor='#db5f6c'
                          stopOpacity={0.5}
                        />
                      </linearGradient>
                    </defs>

                    {/* Grid */}
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={false}
                      stroke='#f1f5f9'
                      strokeOpacity={0.8}
                    />

                    {/* X Axis */}
                    <XAxis
                      dataKey='day'
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: '#64748b',
                        fontSize: 11,
                        fontWeight: 500,
                        fontFamily: 'system-ui',
                      }}
                      padding={{ left: 8, right: 8 }}
                    />

                    {/* Bars */}
                    <Bar
                      dataKey='visits'
                      fill='url(#barGradient)'
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                      opacity={0.9}
                    />

                    {/* Tooltip */}
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        borderRadius: '10px',
                        boxShadow: '0 8px 30px -6px rgba(0, 0, 0, 0.12)',
                        padding: '12px 16px',
                        fontSize: '13px',
                        fontFamily: 'system-ui',
                      }}
                      itemStyle={{
                        color: '#0f172a',
                        fontSize: '13px',
                        fontWeight: '600',
                        padding: '2px 0',
                      }}
                      labelStyle={{
                        color: '#475569',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '6px',
                        borderBottom: '1px solid #f1f5f9',
                        paddingBottom: '4px',
                      }}
                      cursor={{
                        stroke: '#cbd5e1',
                        strokeWidth: 1,
                        strokeDasharray: '3 3',
                      }}
                      formatter={(value) => [value.toLocaleString(), 'Visits']}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Footer Stats */}
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 mt-2 border-t border-slate-100 gap-2 sm:gap-0'>
                <div className='text-xs text-slate-500'>Updated just now</div>
                <div className='flex gap-3 sm:gap-4 text-xs'>
                  <div className='text-slate-600'>
                    <span className='font-semibold text-rose-600'>
                      {Math.max(
                        ...websiteData.activityData.map((d) => d.visits)
                      ).toLocaleString()}
                    </span>{' '}
                    peak visits
                  </div>
                  <div className='text-slate-600'>
                    <span className='font-semibold text-rose-600'>
                      {Math.round(
                        websiteData.activityData.reduce(
                          (sum, day) => sum + day.visits,
                          0
                        ) / websiteData.activityData.length
                      ).toLocaleString()}
                    </span>{' '}
                    avg daily
                  </div>
                </div>
              </div>
            </div>
          </DisplayCard>
          {/* <DisplayCard className='col-span-2'>
            <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
              <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th scope='col' className='px-6 py-3'>
                      Name
                    </th>

                    <th scope='col' className='px-6 py-3'>
                      Category
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Date
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      <span className='sr-only'>View</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'>
                    <th
                      scope='row'
                      className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                    >
                      Apple MacBook Pro 17"
                    </th>
                    <td className='px-6 py-4'>Laptop</td>
                    <td className='px-6 py-4'>$2999</td>
                    <td className='px-6 py-4 text-right'>
                      <a
                        href='#'
                        className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DisplayCard> */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
