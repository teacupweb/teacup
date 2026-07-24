'use client';

import { useAnalytics, useCompany, useLatestMessages } from '@/backendProvider';
import { useAuth } from '@/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Globe, 
  Mail, 
  Users, 
  FileText,
  TrendingUp,
  Activity,
  BarChart3,
  Clock,
  Download,
  Plus,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function DashboardContent() {
  const { user } = useAuth();
  const companyId = user && typeof user !== 'string' ? user.companyId : null;
  const { data: company, isLoading: loading } = useCompany(companyId);

  const { data: latestMessages, isLoading: messagesLoading } =
    useLatestMessages(companyId, 4);

  // Fetch all analytics categories
  const { data: pageAnalytics, isLoading: pageLoading } = useAnalytics(
    companyId,
    'page',
  );
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
        formData.forEach((d: any) => (totalConversions += d.secondary));
      });
    }

    if (buttonAnalytics?.data) {
      Object.values(buttonAnalytics.data).forEach((btnData: any) => {
        btnData.forEach((d: any) => (totalInteractions += d.primary));
      });
    }

    return [
      {
        title: 'Total visits',
        description: 'Total page views across all routes',
        data: totalVisits.toLocaleString(),
        icon: 'globe',
        trend: '+12.5%',
      },
      {
        title: 'New Messages',
        description: 'Messages received in your inboxes',
        data: latestMessages?.length ?? 0,
        icon: 'mail',
        trend: '+3',
      },
      {
        title: 'Conversions',
        description: 'Total 100% form completions',
        data: totalConversions.toLocaleString(),
        icon: 'users',
        trend: '+8.2%',
      },
      {
        title: 'Interactions',
        description: 'Total button clicks tracked',
        data: totalInteractions.toLocaleString(),
        icon: 'file-text',
        trend: '+15.3%',
      },
    ];
  }, [pageAnalytics, formAnalytics, buttonAnalytics, latestMessages]);

  // Activity data for chart
  const activityData = useMemo(() => {
    const dailyMetrics: Record<string, { visits: number; conversions: number }> = {};

    const normalizeDate = (d: string) => new Date(d).toISOString().split('T')[0];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyMetrics[normalizeDate(d.toISOString())] = {
        visits: 0,
        conversions: 0,
      };
    }

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

  // Icon mapping
  const iconMap = {
    globe: Globe,
    mail: Mail,
    users: Users,
    'file-text': FileText,
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  // Show loading state
  if (loading || pageLoading || formLoading || buttonLoading || !company) {
    return (
      <div className="flex-1 p-4 sm:p-6 w-full h-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 w-full h-full auto-rows-min">
          {/* Stats Cards Skeleton */}
          <div className="col-span-1 md:col-span-2 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="col-span-1 bg-card dark:bg-card/50 text-card-foreground rounded-2xl border border-border/80 shadow-sm p-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>

          {/* Messages Table Skeleton */}
          <div className="col-span-1 md:col-span-2 xl:col-span-2 row-span-1 lg:row-span-2 bg-card rounded-2xl border border-border/80 shadow-sm p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <div className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 py-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20 hidden sm:block" />
                    <Skeleton className="h-4 w-16 hidden md:block" />
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Skeleton */}
          <div className="col-span-1 md:col-span-2 xl:col-span-2 row-span-1 lg:row-span-2 bg-card border border-border/80 rounded-2xl shadow-sm p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-background-secondary/50">
      {/* Dashboard Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl ubuntu-font font-bold text-foreground">
                Welcome back, {company?.name || 'Friend'}!
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Here's what's happening with your business today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 p-4 sm:p-6 w-full h-full max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {stats.map((item, index) => (
            <StatCard key={index} stat={item} index={index} getIcon={getIcon} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ActivityChart activityData={activityData} />
          </div>

          {/* Recent Messages - Takes 1 column */}
          <div>
            <RecentMessages messages={latestMessages} isLoading={messagesLoading} />
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <QuickActions />
          <RecentBlogs companyId={companyId} />
        </div>
      </div>
    </div>
  );
}

// Enhanced Stat Card Component
function StatCard({ stat, index, getIcon }: { stat: any; index: number; getIcon: any }) {
  return (
    <div
      className="group relative bg-card border border-border rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Top row: Icon + Trend */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white group-hover:scale-110 transition-transform duration-300 shadow-md shadow-rose-500/30">
            {getIcon(stat.icon)}
          </div>
        </div>
        
        {/* Trend indicator */}
        {stat.trend && (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{stat.trend}</span>
          </div>
        )}
      </div>

      {/* Main stat */}
      <div className="relative">
        <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight group-hover:text-rose-600 transition-colors duration-300">
          {stat.data}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {stat.description}
        </p>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
        <div 
          className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-700 ease-out"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      </div>
    </div>
  );
}

// Activity Chart Component
function ActivityChart({ activityData }: { activityData: any[] }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500" />
            Activity Overview
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Weekly performance metrics
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span className="text-sm text-muted-foreground">Visits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400 shadow-sm shadow-rose-400/50" />
            <span className="text-sm text-muted-foreground">Conversions</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[300px] w-full">
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-rose-50/50 to-transparent dark:from-rose-950/20 rounded-xl border border-dashed border-border">
          <div className="text-center p-8">
            <div className="inline-flex p-4 rounded-full bg-rose-100 dark:bg-rose-900/30 mb-4">
              <BarChart3 className="w-8 h-8 text-rose-600" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">
              Analytics Chart
            </h4>
            <p className="text-sm text-muted-foreground max-w-sm">
              Interactive chart showing visits and conversions over time.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Updated just now</span>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <span className="text-2xl font-bold text-rose-600">
              {activityData.reduce((sum, day) => sum + day.visits, 0).toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground ml-2">total visits</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-rose-600">
              {activityData.reduce((sum, day) => sum + day.conversions, 0).toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground ml-2">conversions</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Recent Messages Component
function RecentMessages({ messages, isLoading }: { messages: any[]; isLoading: boolean }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Mail className="w-5 h-5 text-rose-500" />
            Recent Messages
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Latest customer inquiries
          </p>
        </div>
        {messages.length > 0 && (
          <span className="bg-rose-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
            {messages.length} new
          </span>
        )}
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 animate-pulse">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))
        ) : messages.length > 0 ? (
          messages.map((message: any, i: number) => (
            <div
              key={i}
              className="group flex items-start gap-3 p-3 rounded-xl hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all duration-300 cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/50 dark:to-rose-800/50 flex items-center justify-center text-lg font-semibold text-rose-600">
                {message.name?.charAt(0)?.toUpperCase() || '?'}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground truncate">
                    {message.name || 'Unknown'}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {message.created_at 
                      ? new Date(message.created_at).toLocaleDateString() 
                      : 'Recently'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {message.inbox?.name || message.inbox || 'General'}
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))
        ) : (
          // Empty state
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">
              No messages yet
            </p>
            <p className="text-muted-foreground/60 text-sm">
              New customer inquiries will appear here
            </p>
          </div>
        )}
      </div>

      {/* View All Button */}
      {messages.length > 0 && (
        <Link href="/dashboard/inboxes">
          <button className="w-full mt-6 py-3 border border-border rounded-xl text-muted-foreground hover:text-foreground font-medium text-sm hover:bg-muted/50 transition-all duration-300 flex items-center justify-center gap-2 group">
            See all messages
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      )}
    </div>
  );
}

// Quick Actions Component
function QuickActions() {
  const actions = [
    { icon: Plus, label: 'New Blog Post', href: '/dashboard/blogs/new' },
    { icon: Mail, label: 'Create Inbox', href: '/dashboard/inboxes' },
    { icon: BarChart3, label: 'View Analytics', href: '/dashboard/analytics' },
    { icon: MoreHorizontal, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-500">
      <h3 className="text-xl font-bold text-foreground mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link key={index} href={action.href}>
            <button className="w-full flex flex-col items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all duration-300 group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white group-hover:scale-110 transition-transform duration-300">
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {action.label}
              </span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Recent Blogs Component
function RecentBlogs({ companyId }: { companyId: string | null }) {
  // Placeholder blogs - replace with actual data fetching
  const blogs = [
    { id: 1, title: 'Getting Started with Teacup', date: '2 days ago', views: 234 },
    { id: 2, title: '10 Tips for Better Analytics', date: '1 week ago', views: 189 },
    { id: 3, title: 'Maximizing Customer Engagement', date: '2 weeks ago', views: 156 },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Recent Blog Posts</h3>
        <Link href="/dashboard/blogs">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all duration-300">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate group-hover:text-rose-600 transition-colors">
                {blog.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {blog.date}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>{blog.views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardContent;
