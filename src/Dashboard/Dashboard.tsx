import DisplayCard from '@/Components/DisplayCards';
import DashboardHeader from '../Components/DashboardHeader';
import { BsFillCupHotFill } from 'react-icons/bs';
import { useState } from 'react';
import { useCompany, useLatestMessages } from '@/backendProvider';
import { useAuth } from '@/AuthProvider';
import Spinner from '@/Components/Spinner';
import websiteData from '@/assets/websiteData.json';
import { Globe, Mail, Users, FileText } from 'lucide-react';

import Modal, { openModal, closeModal } from '@/Components/Modal';
import AILoadingSpinner from '@/Components/AILoadingSpinner';

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
  data: any[] | number | string;
  icon?: string;
}

function Dashboard() {
  const { user } = useAuth();
  const companyId =
    user && typeof user !== 'string' ? user.user_metadata?.company_id : null;
  const { company, loading } = useCompany(companyId);
  const userEmail = user && typeof user !== 'string' ? user.email : null;
  const { messages: latestMessages, loading: messagesLoading } = useLatestMessages(userEmail, 4);

  const [isAILoading, setIsAILoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  function handleClick() {
    openModal('magic-tea-modal');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Close modal and show AI loading
    closeModal('magic-tea-modal');
    setIsAILoading(true);

    // Simulate AI processing for 3.5 seconds
    setTimeout(() => {
      setIsAILoading(false);
      setPrompt('');
      setShowSuccessModal(true);
    }, 3500);
  }

  // Show loading state while fetching company data
  if (loading || !company) {
    return (
      <div className='flex flex-col w-full h-full'>
        <DashboardHeader />
        <div className='flex-1 flex items-center justify-center'>
          <Spinner size='lg' />
        </div>
      </div>
    );
  }

  // Icon mapping for info cards
  const iconMap: { [key: string]: any } = {
    globe: Globe,
    mail: Mail,
    users: Users,
    'file-text': FileText,
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className='w-6 h-6' /> : null;
  };

  return (
    <div className='flex flex-col w-full h-full'>
      <DashboardHeader />

      {/* AI Loading Spinner Overlay */}
      <AILoadingSpinner isVisible={isAILoading} />

      <div className='flex-1 p-3 sm:p-4 md:p-6 w-full h-full'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full h-full auto-rows-min'>
          {/* Enhanced Stats Cards */}
          <div className='col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
            {(websiteData.info as WebsiteInfo[]).map(
              (item: WebsiteInfo, index: number) => (
                <DisplayCard
                  resetClass
                  className='col-span-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500 group p-4 sm:p-5 md:p-6 relative overflow-hidden w-full'
                  key={index}
                >
                  {/* Animated background gradient */}
                  <div className='absolute inset-0 bg-gradient-to-br from-white to-rose-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

                  {/* Icon in top right */}
                  <div className='absolute top-4 right-4 p-2 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl text-white opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110'>
                    {getIcon(item.icon)}
                  </div>

                  <div className='relative z-10'>
                    <h3 className='font-semibold text-slate-700 mb-2 sm:mb-3 text-base sm:text-lg tracking-tight'>
                      {item.title}
                    </h3>
                    <span className='text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 block leading-relaxed'>
                      {item.description}
                    </span>
                    <span className='font-bold text-3xl sm:text-4xl block text-slate-900 group-hover:text-rose-600 transition-colors duration-300 tracking-tight'>
                      {typeof item.data === 'string' ? item.data : item.data}
                    </span>
                  </div>

                  {/* Animated progress bar */}
                  <div className='absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-rose-500 to-rose-400 group-hover:w-full transition-all duration-700 ease-out' />
                </DisplayCard>
              )
            )}
          </div>

          {/* Enhanced Messages Table */}
          <DisplayCard className='col-span-1 md:col-span-2 lg:col-span-2 row-span-1 lg:row-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden w-full h-full'>
            <div className='h-full flex flex-col'>
              {/* Header with gradient border */}
              <div className='pb-6 mb-2 border-b border-slate-100 relative'>
                <div className='absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-rose-500 to-rose-400' />
                <h3 className='font-semibold text-lg sm:text-xl text-slate-900 flex flex-wrap items-center gap-2 sm:gap-3'>
                  New Messages
                  <span className='bg-rose-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm'>
                    {latestMessages.length} new
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
                        <th className='py-4 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide hidden sm:table-cell'>
                          Inbox
                        </th>
                        <th className='py-4 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide hidden md:table-cell'>
                          Date
                        </th>
                        <th className='py-4 text-right font-semibold text-slate-700 text-xs uppercase tracking-wide'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100/80'>
                      {messagesLoading ? (
                        <tr>
                          <td colSpan={4} className='py-8 text-center'>
                            <Spinner size='sm' />
                          </td>
                        </tr>
                      ) : latestMessages.length > 0 ? (
                        latestMessages.map((message: any, i: number) => (
                          <tr
                            key={message.id || i}
                            className='hover:bg-slate-50/50 transition-all duration-300 group/row'
                          >
                            <td className='py-4'>
                              <div className='flex items-center gap-3'>
                                <div className='w-2 h-2 bg-rose-400 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-300' />
                                <span className='font-medium text-slate-900 group-hover/row:text-slate-800 transition-colors'>
                                  {message.name || 'Unknown'}
                                </span>
                              </div>
                            </td>
                            <td className='py-4 hidden sm:table-cell'>
                              <span className='text-slate-600 group-hover/row:text-slate-700 transition-colors'>
                                {message.inbox?.name || message.inbox || 'General'}
                              </span>
                            </td>
                            <td className='py-4 hidden md:table-cell'>
                              <span className='text-slate-500 text-xs font-medium bg-slate-100 px-2 py-1 rounded'>
                                {message.created_at
                                  ? new Date(message.created_at).toLocaleDateString()
                                  : message.date || 'N/A'}
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className='py-12 text-center'>
                            <div className='flex flex-col items-center gap-3'>
                              <div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center'>
                                <Mail className='w-8 h-8 text-slate-400' />
                              </div>
                              <div>
                                <p className='text-slate-600 font-medium mb-1'>
                                  No messages yet
                                </p>
                                <p className='text-slate-400 text-sm'>
                                  New customer inquiries will appear here
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
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

          {/* Chart */}
          <div className='flex flex-col gap-3 sm:gap-4 md:gap-6 col-span-1 md:col-span-2 lg:col-span-2 w-full h-full'>
            <DisplayCard className='col-span-1 md:col-span-2 row-span-1 lg:row-span-2 p-4 sm:p-5 md:p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 w-full h-full'>
              <div className='h-full flex flex-col'>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4'>
                  <div>
                    <h3 className='font-bold ubuntu-font text-xl sm:text-2xl text-slate-900 mb-2'>
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
                      {(company.activity_data || [])
                        .reduce((sum: number, day: any) => sum + day.visits, 0)
                        .toLocaleString()}{' '}
                      total
                    </div>
                  </div>
                </div>

                <div className='flex-1 -mx-2 -mb-2 min-h-[250px] w-full'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <ComposedChart
                      data={company.activity_data || []}
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
                          ...(company.activity_data || [{ visits: 0 }]).map(
                            (d: any) => d.visits
                          )
                        ).toLocaleString()}
                      </span>{' '}
                      peak visits
                    </div>
                    <div className='text-slate-700'>
                      <span className='font-semibold text-rose-600'>
                        {Math.round(
                          (company.activity_data || []).reduce(
                            (sum: number, day: any) => sum + day.visits,
                            0
                          ) / (company.activity_data?.length || 1)
                        ).toLocaleString()}
                      </span>{' '}
                      avg daily
                    </div>
                  </div>
                </div>
              </div>
            </DisplayCard>
          </div>

          {/* EPIC MAGIC CTA BANNER */}
          <div className='col-span-1 md:col-span-2 lg:col-span-2'>
            <div className='w-full rounded-2xl bg-gradient-to-br from-rose-600 to-rose-900 p-4 sm:p-6 md:p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]'>
              <div className='flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6'>
                <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full'>
                  <div className='p-3 sm:p-4 text-4xl sm:text-5xl bg-white/20 rounded-2xl backdrop-blur-sm'>
                    <BsFillCupHotFill className='text-3xl sm:text-4xl text-white' />
                  </div>
                  <div className='max-w-md text-center sm:text-left'>
                    <h3 className='text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r ubuntu-font from-white to-rose-100 bg-clip-text text-transparent'>
                      Hold My Tea
                    </h3>
                    <p className='text-base sm:text-lg text-white/90 mb-4 sm:mb-6 leading-relaxed'>
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

      {/* Enhanced Magic Modal */}
      <Modal id='magic-tea-modal' className='max-w-2xl'>
        <div className='p-8'>
          {/* Header with gradient */}
          <div className='mb-6'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl'>
                <BsFillCupHotFill className='text-3xl text-white' />
              </div>
              <div>
                <h2 className='text-3xl font-bold bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent ubuntu-font'>
                  Hold My Tea ☕
                </h2>
                <p className='text-slate-500 text-sm mt-1'>
                  AI-powered magic at your fingertips
                </p>
              </div>
            </div>
            <div className='h-1 w-20 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full' />
          </div>

          {/* Description */}
          <div className='mb-6 p-4 bg-gradient-to-br from-rose-50 to-purple-50 rounded-xl border border-rose-100'>
            <p className='text-slate-700 leading-relaxed'>
              ✨ Just type a prompt and watch the AI work its magic. Our
              intelligent system will process your request and deliver amazing
              results in seconds!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='ai-prompt'
                className='block text-sm font-semibold text-slate-700 mb-2'
              >
                Your Prompt
              </label>
              <textarea
                id='ai-prompt'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g., Create a landing page for my coffee shop...'
                rows={4}
                className='w-full px-4 py-3 text-base text-gray-700 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 resize-none'
              />
            </div>

            <button
              type='submit'
              disabled={!prompt.trim()}
              className='w-full px-6 py-4 text-lg font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 rounded-xl hover:from-rose-700 hover:to-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl'
            >
              ✨ Let the Magic Begin
            </button>
          </form>

          {/* Footer hint */}
          <p className='text-xs text-slate-400 text-center mt-4'>
            Press Enter or click the button to submit
          </p>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        id='success-modal'
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        className='max-w-md'
      >
        <div className='p-8 text-center'>
          {/* Animated success icon */}
          <div className='mb-6 relative'>
            <div className='w-24 h-24 mx-auto bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center animate-bounce-once'>
              <svg
                className='w-12 h-12 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={3}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            {/* Confetti effect */}
            <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
              <div className='absolute w-2 h-2 bg-rose-400 rounded-full animate-confetti-1' />
              <div className='absolute w-2 h-2 bg-pink-400 rounded-full animate-confetti-2' />
              <div className='absolute w-2 h-2 bg-rose-500 rounded-full animate-confetti-3' />
              <div className='absolute w-2 h-2 bg-pink-500 rounded-full animate-confetti-4' />
              <div className='absolute w-2 h-2 bg-rose-300 rounded-full animate-confetti-5' />
              <div className='absolute w-2 h-2 bg-pink-300 rounded-full animate-confetti-6' />
            </div>
          </div>

          {/* Success message */}
          <h3 className='text-3xl font-bold bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent mb-3 ubuntu-font'>
            Magic Complete! ✨
          </h3>
          <p className='text-slate-600 text-lg mb-6'>
            Your request has been processed successfully. The AI has worked its
            magic!
          </p>

          {/* Action button */}
          <button
            onClick={() => setShowSuccessModal(false)}
            className='px-8 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl font-bold hover:from-rose-700 hover:to-rose-800 transition-all duration-300 transform hover:scale-105 shadow-lg'
          >
            Awesome!
          </button>
        </div>

        <style>{`
          @keyframes bounce-once {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-20px) scale(1.1);
            }
          }

          @keyframes confetti-1 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(-60px, -80px) rotate(180deg);
              opacity: 0;
            }
          }

          @keyframes confetti-2 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(60px, -70px) rotate(-180deg);
              opacity: 0;
            }
          }

          @keyframes confetti-3 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(-40px, -100px) rotate(90deg);
              opacity: 0;
            }
          }

          @keyframes confetti-4 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(70px, -90px) rotate(-90deg);
              opacity: 0;
            }
          }

          @keyframes confetti-5 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(-80px, -60px) rotate(270deg);
              opacity: 0;
            }
          }

          @keyframes confetti-6 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(50px, -110px) rotate(-270deg);
              opacity: 0;
            }
          }

          .animate-bounce-once {
            animation: bounce-once 0.6s ease-out;
          }

          .animate-confetti-1 {
            animation: confetti-1 1s ease-out forwards;
          }

          .animate-confetti-2 {
            animation: confetti-2 1.1s ease-out forwards;
          }

          .animate-confetti-3 {
            animation: confetti-3 0.9s ease-out forwards;
          }

          .animate-confetti-4 {
            animation: confetti-4 1.2s ease-out forwards;
          }

          .animate-confetti-5 {
            animation: confetti-5 1s ease-out forwards;
          }

          .animate-confetti-6 {
            animation: confetti-6 1.1s ease-out forwards;
          }
        `}</style>
      </Modal>
    </div>
  );
}

export default Dashboard;
