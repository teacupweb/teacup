import DisplayCard from '@/Components/DisplayCards';
import DashboardHeader from '../Components/DashboardHeader';
import { BsFillCupHotFill } from 'react-icons/bs';
import { useState } from 'react';
import websiteData from '@/assets/websiteData.json';

import Modal, { openModal } from '@/Components/Modal';

import {
  Bar,
  Tooltip,
  ComposedChart,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface WebsiteInfo {
  title: string;
  description: string;
  data: any[] | number;
  icon?: string;
}

interface Message {
  name: string;
  inbox: string;
  date: string;
}

function Dashboard() {
  const messages: Message[] = [
    { name: 'John Doe', inbox: 'Inquiry', date: '11-9-2025' },
    { name: 'Jane Smith', inbox: 'Support', date: '12-9-2025' },
    { name: 'Alice Johnson', inbox: 'Sales', date: '13-9-2025' },
    { name: 'Bob Brown', inbox: 'General', date: '14-9-2025' },
  ];
  function handleClick() {
    // console.log('Button clicked!');
    openModal('magic-tea-modal');
  }
  return (
    <div className='flex flex-col w-full h-full'>
      <DashboardHeader />

      <div className='flex-1 p-6 w-full h-full'>
        <div className='grid grid-cols-4 gap-6 w-full h-full auto-rows-min'>
          {/* Enhanced Stats Cards */}
          <div className='col-span-4 grid grid-cols-4 gap-6'>
            {(websiteData.info as WebsiteInfo[]).map(
              (item: WebsiteInfo, index: number) => (
                <DisplayCard
                  resetClass
                  className='col-span-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 group p-6 relative overflow-hidden w-full'
                  key={index}
                >
                  {/* Animated background gradient */}
                  <div className='absolute inset-0 bg-gradient-to-br from-white to-rose-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

                  {/* Floating accent */}
                  <div className='absolute top-3 right-3 w-6 h-6 bg-rose-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform group-hover:scale-110' />

                  <div className='relative z-10'>
                    <h3 className='font-semibold text-slate-700 mb-3 text-lg tracking-tight'>
                      {item.title}
                    </h3>
                    <span className='text-sm text-slate-500 mb-6 block leading-relaxed'>
                      {item.description}
                    </span>
                    <span className='font-bold text-4xl block text-slate-900 group-hover:text-rose-600 transition-colors duration-300 tracking-tight'>
                      {Array.isArray(item.data) ? item.data.length : item.data}
                    </span>
                  </div>

                  {/* Animated progress bar */}
                  <div className='absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-rose-500 to-rose-400 group-hover:w-full transition-all duration-700 ease-out' />
                </DisplayCard>
              )
            )}
          </div>

          {/* Enhanced Messages Table */}
          <DisplayCard className='col-span-2 row-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden w-full h-full'>
            <div className='h-full flex flex-col'>
              {/* Header with gradient border */}
              <div className='pb-6 mb-2 border-b border-slate-100 relative'>
                <div className='absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-rose-500 to-rose-400' />
                <h3 className='font-semibold text-xl text-slate-900 flex items-center gap-3'>
                  New Messages
                  <span className='bg-rose-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm'>
                    {messages.length} new
                  </span>
                </h3>
                <p className='text-slate-500 text-sm mt-2'>
                  Recent customer inquiries
                </p>
              </div>

              <div className='flex-1'>
                <div className='relative overflow-hidden'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b border-slate-100'>
                        <th className='py-4 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide'>
                          Name
                        </th>
                        <th className='py-4 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide'>
                          Inbox
                        </th>
                        <th className='py-4 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide'>
                          Date
                        </th>
                        <th className='py-4 text-right font-semibold text-slate-700 text-xs uppercase tracking-wide'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100/80'>
                      {messages.map((person: Message, i: number) => (
                        <tr
                          key={i}
                          className='hover:bg-slate-50/50 transition-all duration-300 group/row'
                        >
                          <td className='py-4'>
                            <div className='flex items-center gap-3'>
                              <div className='w-2 h-2 bg-rose-400 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-300' />
                              <span className='font-medium text-slate-900 group-hover/row:text-slate-800 transition-colors'>
                                {person.name}
                              </span>
                            </div>
                          </td>
                          <td className='py-4'>
                            <span className='text-slate-600 group-hover/row:text-slate-700 transition-colors'>
                              {person.inbox}
                            </span>
                          </td>
                          <td className='py-4'>
                            <span className='text-slate-500 text-xs font-medium bg-slate-100 px-2 py-1 rounded'>
                              {person.date}
                            </span>
                          </td>
                          <td className='py-4 text-right'>
                            <button className='text-rose-600 hover:text-rose-700 font-medium text-sm hover:scale-110 transition-transform duration-200 inline-flex items-center gap-1 group/btn'>
                              View
                              <span className='group-hover/btn:translate-x-0.5 transition-transform'>
                                →
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button className='w-full mt-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-800 font-medium text-sm hover:border-slate-300 transition-all duration-300 hover:bg-white/50 group/viewall'>
                  <span className='flex items-center justify-center gap-2 group-hover/viewall:gap-3 transition-all duration-300'>
                    See all messages
                    <span className='group-hover/viewall:translate-x-1 transition-transform'>
                      →
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </DisplayCard>

          {/* Chart - UNTOUCHED */}
          <div className='flex flex-col gap-6 col-span-2 w-full h-full'>
            <DisplayCard className='col-span-2 row-span-2 p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 w-full h-full'>
              <div className='h-full flex flex-col'>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4'>
                  <div>
                    <h3 className='font-bold ubuntu-font text-2xl text-slate-900 mb-2'>
                      Activity Overview
                    </h3>
                    <p className='text-slate-500 text-sm'>
                      Last 7 days performance
                    </p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded-full bg-rose-500 shadow-sm' />
                      <span className='text-slate-700 text-sm font-medium'>
                        Visits
                      </span>
                    </div>
                    <div className='h-4 w-px bg-slate-300' />
                    <div className='text-sm text-slate-800 font-semibold'>
                      {websiteData.activityData
                        .reduce((sum: number, day: any) => sum + day.visits, 0)
                        .toLocaleString()}{' '}
                      total
                    </div>
                  </div>
                </div>

                <div className='flex-1 -mx-2 -mb-2 min-h-[250px] w-full'>
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
                      <CartesianGrid
                        strokeDasharray='3 3'
                        vertical={false}
                        stroke='#f1f5f9'
                        strokeOpacity={0.8}
                      />
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
                      <Bar
                        dataKey='visits'
                        fill='url(#barGradient)'
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                        opacity={0.9}
                      />
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
                        formatter={(value: number) => [
                          value.toLocaleString(),
                          'Visits',
                        ]}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 mt-4 border-t border-slate-100 gap-3'>
                  <div className='text-xs text-slate-500 font-medium'>
                    Updated just now
                  </div>
                  <div className='flex gap-6 text-xs'>
                    <div className='text-slate-700'>
                      <span className='font-semibold text-rose-600'>
                        {Math.max(
                          ...websiteData.activityData.map((d: any) => d.visits)
                        ).toLocaleString()}
                      </span>{' '}
                      peak visits
                    </div>
                    <div className='text-slate-700'>
                      <span className='font-semibold text-rose-600'>
                        {Math.round(
                          websiteData.activityData.reduce(
                            (sum: number, day: any) => sum + day.visits,
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
          </div>

          {/* EPIC MAGIC CTA BANNER - People will click this repeatedly! */}
          <div className='col-span-2'>
            <div className='w-full rounded-2xl bg-gradient-to-br from-rose-600 to-rose-900  p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-6'>
                  <div className='p-4 text-5xl bg-white/20 rounded-2xl backdrop-blur-sm'>
                    <BsFillCupHotFill className='text-4xl text-white' />
                  </div>
                  <div className='max-w-md'>
                    <h3 className='text-3xl font-bold mb-3 bg-gradient-to-r ubuntu-font from-white to-rose-100 bg-clip-text text-transparent'>
                      Hold My Tea
                    </h3>
                    <p className='text-lg text-white/90 mb-6 leading-relaxed'>
                      Experience the magic of seamless workflow. Just try it and
                      it will be worth it we promise.
                    </p>
                    <button
                      onClick={handleClick}
                      className='px-8 py-3 cursor-pointer bg-white text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-all duration-300 transform hover:scale-105 shadow-lg'
                    >
                      Just Do It!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal id='magic-tea-modal'>
        <div className='p-6'>
          <h2 className='text-2xl font-bold mb-4'>Hold My Tea</h2>
          <p className='mb-4'>Just try a promt and see the magic happen.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type='text'
              placeholder='Enter a prompt'
              className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent'
            />
            <button
              type='submit'
              className='w-full px-4 py-2 mt-4 text-lg text-white bg-rose-600 rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-opacity-50'
            >
              Try It
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;
