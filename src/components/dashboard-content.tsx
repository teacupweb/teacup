'use client';

import DisplayCard from '@/Components/DisplayCards';
import { useCompany, useLatestMessages } from '@/backendProvider';
import { useAuth } from '@/AuthProvider';
import Spinner from '@/Components/Spinner';
import { Globe, Mail, Users, FileText } from 'lucide-react';
import { useAnalytics } from '@/backendProvider';
import { useMemo } from 'react';

function DashboardContent() {
  const { user } = useAuth();
  const companyId =
    user && typeof user !== 'string' ? user.companyId : null;
  const { data: company, isLoading: loading } = useCompany(companyId);

  const { data: latestMessages, isLoading: messagesLoading } =
    useLatestMessages(companyId, 4);

  // Fetch all analytics categories
  const { data: pageAnalytics, isLoading: pageLoading } = useAnalytics(
    companyId,
    'page',
  );
  console.log(pageAnalytics);
  const { data: formAnalytics, isLoading: formLoading } = useAnalytics(
    companyId,
    'form',
  );
  const { data: buttonAnalytics, isLoading: buttonLoading } = useAnalytics(
    companyId,
    'button',
  );

  // Compute stats for cards
  const stats = useMemo(() => {
    let totalVisits = 0;
    let totalConversions = 0;
    let totalInteractions = 0;

    if (pageAnalytics?.data) {
      Object.values(pageAnalytics.data).forEach((pageData: any) => {
        pageData.forEach((d: any) => (totalVisits += d.primary));
      });
    }

    if (formAnalytics?.data) {
      Object.values(formAnalytics.data).forEach((formData: any) => {
        formData.forEach((d: any) => (totalConversions += d.secondary)); // secondary is 100% completions
      });
    }

    if (buttonAnalytics?.data) {
      Object.values(buttonAnalytics.data).forEach((btnData: any) => {
        btnData.forEach((d: any) => (totalInteractions += d.primary)); // primary is click count
      });
    }

    return [
      {
        title: 'Total visits',
        description: 'Total page views across all routes',
        data: totalVisits.toLocaleString(),
        icon: 'globe',
      },
      {
        title: 'New Messages',
        description: 'Messages received in your inboxes',
        data: latestMessages?.length ?? 0,
        icon: 'mail',
      },
      {
        title: 'Conversions',
        description: 'Total 100% form completions',
        data: totalConversions.toLocaleString(),
        icon: 'users',
      },
      {
        title: 'Interactions',
        description: 'Total button clicks tracked',
        data: totalInteractions.toLocaleString(),
        icon: 'file-text',
      },
    ];
  }, [pageAnalytics, formAnalytics, buttonAnalytics, latestMessages]);

  // Aggregate daily metrics for the chart (Visits & Conversions)
  const activityData = useMemo(() => {
    const dailyMetrics: Record<
      string,
      { visits: number; conversions: number }
    > = {};

    // Helper to normalize date to YYYY-MM-DD
    const normalizeDate = (d: string) =>
      new Date(d).toISOString().split('T')[0];

    // Initialize last 7 days with zeros
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyMetrics[normalizeDate(d.toISOString())] = {
        visits: 0,
        conversions: 0,
      };
    }

    // Aggregate Visits
    if (pageAnalytics?.data) {
      Object.values(pageAnalytics.data).forEach((pageData: any) => {
        pageData.forEach((d: any) => {
          const date = normalizeDate(d.date);
          if (dailyMetrics[date]) {
            dailyMetrics[date].visits += d.primary;
          }
        });
      });
    }

    // Aggregate Conversions (100% form completions)
    if (formAnalytics?.data) {
      Object.values(formAnalytics.data).forEach((formData: any) => {
        formData.forEach((d: any) => {
          const date = normalizeDate(d.date);
          if (dailyMetrics[date]) {
            dailyMetrics[date].conversions += d.secondary;
          }
        });
      });
    }

    return Object.entries(dailyMetrics)
      .map(([date, metrics]) => ({
        day: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
        visits: metrics.visits,
        conversions: metrics.conversions,
        rawDate: date,
      }))
      .sort(
        (a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime(),
      );
  }, [pageAnalytics, formAnalytics]);

  // Show loading state
  if (loading || pageLoading || formLoading || buttonLoading || !company) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <Spinner size='lg' />
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
      <div className='flex-1 p-2 sm:p-4 md:p-6 w-full h-full max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 w-full h-full auto-rows-min'>
          {/* Enhanced Stats Cards */}
          <div className='col-span-1 md:col-span-2 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
            {stats.map((item: any, index: number) => (
              <DisplayCard
                resetClass
                className='col-span-1 bg-card dark:bg-card/50 text-card-foreground rounded-2xl border border-border/80 shadow-sm hover:shadow-xl transition-all duration-500 group p-4 sm:p-5 md:p-6 relative overflow-hidden w-full'
                key={index}
              >
                {/* Animated background gradient */}
                <div className='absolute inset-0 bg-gradient-to-br from-card to-rose-50/10 dark:to-rose-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

                {/* Icon in top right */}
                <div className='absolute top-4 right-4 p-2 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl text-white opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110'>
                  {getIcon(item.icon)}
                </div>

                <div className='relative z-10'>
                  <h3 className='font-semibold text-foreground mb-2 sm:mb-3 text-base sm:text-lg tracking-tight pr-12 opacity-80'>
                    {item.title}
                  </h3>
                  <span className='text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 block leading-relaxed'>
                    {item.description}
                  </span>
                  <span className='font-bold text-3xl sm:text-4xl block text-foreground group-hover:text-rose-600 transition-colors duration-300 tracking-tight'>
                    {item.data}
                  </span>
                </div>

                {/* Animated progress bar */}
                <div className='absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-rose-500 to-rose-400 group-hover:w-full transition-all duration-700 ease-out' />
              </DisplayCard>
            ))}
          </div>

          {/* Enhanced Messages Table */}
          <DisplayCard className='col-span-1 md:col-span-2 xl:col-span-2 row-span-1 lg:row-span-2 bg-card rounded-2xl border border-border/80 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden w-full h-full min-h-[400px] sm:min-h-0'>
            <div className='h-full flex flex-col'>
              {/* Header with gradient border */}
              <div className='pb-6 mb-2 border-b border-border relative'>
                <div className='absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-rose-500 to-rose-400' />
                <h3 className='font-semibold text-lg sm:text-xl text-foreground flex flex-wrap items-center gap-2 sm:gap-3'>
                  New Messages
                  <span className='bg-rose-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm'>
                    {latestMessages.length} new
                  </span>
                </h3>
                <p className='text-muted-foreground text-sm mt-2'>
                  Recent customer inquiries
                </p>
              </div>

              <div className='flex-1'>
                <div className='relative overflow-hidden'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b border-border'>
                        <th className='py-4 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide'>
                          Name
                        </th>
                        <th className='py-4 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell'>
                          Inbox
                        </th>
                        <th className='py-4 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell'>
                          Date
                        </th>
                        <th className='py-4 text-right font-semibold text-muted-foreground text-xs uppercase tracking-wide'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-border/50'>
                      {messagesLoading ? (
                        <tr>
                          <td colSpan={4} className='py-8 text-center'>
                            <Spinner size='sm' />
                          </td>
                        </tr>
                      ) : (latestMessages ?? []).length > 0 ? (
                        (latestMessages ?? []).map((message: any, i: number) => (
                          <tr
                            key={message.id || i}
                            className='hover:bg-muted/50 transition-all duration-300 group/row'
                          >
                            <td className='py-4'>
                              <div className='flex items-center gap-3'>
                                <div className='w-2 h-2 bg-rose-400 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-300' />
                                <span className='font-medium text-foreground group-hover/row:text-foreground transition-colors'>
                                  {message.name || 'Unknown'}
                                </span>
                              </div>
                            </td>
                            <td className='py-4 hidden sm:table-cell'>
                              <span className='text-muted-foreground group-hover/row:text-foreground transition-colors'>
                                {message.inbox?.name ||
                                  message.inbox ||
                                  'General'}
                              </span>
                            </td>
                            <td className='py-4 hidden md:table-cell'>
                              <span className='text-muted-foreground/80 text-xs font-medium bg-muted px-2 py-1 rounded'>
                                {message.created_at
                                  ? new Date(
                                      message.created_at,
                                    ).toLocaleDateString()
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
                              <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center'>
                                <Mail className='w-8 h-8 text-muted-foreground' />
                              </div>
                              <div>
                                <p className='text-muted-foreground font-medium mb-1'>
                                  No messages yet
                                </p>
                                <p className='text-muted-foreground/60 text-sm'>
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

                <button className='w-full mt-6 py-3 border border-border rounded-xl text-muted-foreground hover:text-foreground font-medium text-sm hover:border-border/80 transition-all duration-300 hover:bg-muted/30 group/viewall'>
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

          {/* Chart Section */}
          <div className='flex flex-col gap-4 sm:gap-6 col-span-1 md:col-span-2 xl:col-span-2 row-span-1 lg:row-span-2 w-full h-full'>
            <DisplayCard className='col-span-1 md:col-span-2 p-4 sm:p-5 md:p-6 bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 w-full h-full min-h-[400px] sm:min-h-0'>
              <div className='h-full flex flex-col'>
                {/* Header Section */}
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4'>
                  <div>
                    <h3 className='font-bold ubuntu-font text-xl sm:text-2xl text-foreground mb-2'>
                      Activity Overview
                    </h3>
                    <p className='text-muted-foreground text-sm'>
                      Average weekly performance
                    </p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded-full bg-rose-500 shadow-sm' />
                      <span className='text-muted-foreground text-sm font-medium'>
                        Visits
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded-full bg-rose-400 shadow-sm' />
                      <span className='text-muted-foreground text-sm font-medium'>
                        Conversions
                      </span>
                    </div>
                    <div className='h-4 w-px bg-border' />
                    <div className='text-sm text-foreground font-semibold'>
                      {activityData
                        .reduce((sum: number, day: any) => sum + day.visits, 0)
                        .toLocaleString()}{' '}
                      visits
                    </div>
                  </div>
                </div>

                {/* Chart Content - Temporarily commented out due to recharts import issue */}
                {/* <div className='flex-1 -mx-2 -mb-2 min-h-[250px] w-full'>
                  <Recharts.ResponsiveContainer width='100%' height='100%'>
                    <Recharts.ComposedChart
                      data={activityData}
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
                      <Recharts.CartesianGrid
                        strokeDasharray='3 3'
                        vertical={false}
                        stroke='var(--border)'
                        strokeOpacity={0.5}
                      />
                      <Recharts.XAxis
                        dataKey='day'
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: 'var(--muted-foreground)',
                          fontSize: 11,
                          fontWeight: 500,
                          fontFamily: 'system-ui',
                        }}
                        padding={{ left: 8, right: 8 }}
                      />
                      <Recharts.Bar
                        dataKey='visits'
                        fill='url(#barGradient)'
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                        opacity={0.8}
                      />
                      <Recharts.Line
                        type='monotone'
                        dataKey='conversions'
                        stroke='#fb7185'
                        strokeWidth={3}
                        dot={{ fill: '#fb7185', r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                      <Recharts.Tooltip
                        contentStyle={{
                          background: 'var(--card)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid var(--border)',
                          borderRadius: '10px',
                          boxShadow: '0 8px 30px -6px rgba(0, 0, 0, 0.12)',
                          padding: '12px 16px',
                          fontSize: '13px',
                          fontFamily: 'system-ui',
                        }}
                        itemStyle={{
                          color: 'var(--foreground)',
                          fontSize: '13px',
                          fontWeight: '600',
                          padding: '2px 0',
                        }}
                        labelStyle={{
                          color: 'var(--muted-foreground)',
                          fontSize: '12px',
                          fontWeight: '600',
                          marginBottom: '6px',
                          borderBottom: '1px solid var(--border)',
                          paddingBottom: '4px',
                        }}
                        cursor={{
                          stroke: 'var(--muted-foreground)',
                          strokeWidth: 1,
                          strokeDasharray: '3 3',
                        }}
                        formatter={(value: number, name: string) => [
                          value.toLocaleString(),
                          name.charAt(0).toUpperCase() + name.slice(1),
                        ]}
                      />
                    </Recharts.ComposedChart>
                  </Recharts.ResponsiveContainer>
                </div> */}

                {/* Temporary placeholder for chart */}
                <div className='flex-1 -mx-2 -mb-2 min-h-[250px] w-full flex items-center justify-center bg-muted/20 rounded-lg border border-border/50'>
                  <div className='text-center'>
                    <div className='w-16 h-16 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-4 mx-auto'>
                      <span className='text-2xl'>📊</span>
                    </div>
                    <h3 className='text-lg font-semibold text-foreground mb-2'>
                      Activity Chart
                    </h3>
                    <p className='text-muted-foreground text-sm'>
                      Chart temporarily disabled due to dependency issues
                    </p>
                  </div>
                </div>

                {/* Footer Stats Section */}
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 mt-4 border-t border-border gap-3'>
                  <div className='text-xs text-muted-foreground/60 font-medium'>
                    Updated just now
                  </div>
                  <div className='flex gap-6 text-xs'>
                    <div className='text-foreground opacity-80'>
                      <span className='font-semibold text-rose-600'>
                        {Math.max(
                          ...(activityData.length > 0
                            ? activityData
                            : [{ visits: 0 }]
                          ).map((d: any) => d.visits),
                        ).toLocaleString()}
                      </span>{' '}
                      peak visits
                    </div>
                    <div className='text-foreground opacity-80'>
                      <span className='font-semibold text-rose-600'>
                        {Math.round(
                          activityData.reduce(
                            (sum: number, day: any) => sum + day.visits,
                            0,
                          ) / (activityData.length || 1),
                        ).toLocaleString()}
                      </span>{' '}
                      avg daily
                    </div>
                  </div>
                </div>
              </div>
            </DisplayCard>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
