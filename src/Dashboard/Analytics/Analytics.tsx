import { useState, useMemo } from 'react';
import DashboardHeader from '../../Components/DashboardHeader';
import ChartAreaInteractive from './Chart';
import DisplayCard from '@/Components/DisplayCards';
import { 
  MousePointer2, 
  FileCheck, 
  Layers, 
  TrendingUp, 
  Users, 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

function Analytics() {
  const [dataType, setDataType] = useState<'buttons' | 'forms' | 'pages'>('pages');
  const [selectedRoute, setSelectedRoute] = useState('home');
  const [selectedForm, setSelectedForm] = useState('contact-us');

  const routes = [
    { label: 'Home', value: 'home' },
    { label: 'About', value: 'about' },
    { label: 'Contact', value: 'contact' },
    { label: 'Pricing', value: 'pricing' },
    { label: 'Blog', value: 'blog' },
  ];

  const forms = [
    { label: 'Contact Us', value: 'contact-us' },
    { label: 'Newsletter Sign-up', value: 'newsletter' },
    { label: 'Waitlist Form', value: 'waitlist' },
  ];

  // Dummy Page Performance Data (Percentages - e.g. Bounce Rate)
  const pageData = useMemo(() => {
    return [
      { name: 'Mon', percentage: Math.floor(Math.random() * 40) + 20 },
      { name: 'Tue', percentage: Math.floor(Math.random() * 40) + 20 },
      { name: 'Wed', percentage: Math.floor(Math.random() * 40) + 20 },
      { name: 'Thu', percentage: Math.floor(Math.random() * 40) + 20 },
      { name: 'Fri', percentage: Math.floor(Math.random() * 40) + 20 },
      { name: 'Sat', percentage: Math.floor(Math.random() * 40) + 20 },
      { name: 'Sun', percentage: Math.floor(Math.random() * 40) + 20 },
    ];
  }, [selectedRoute]);

  // Dummy Form Completion Distribution Data (Visitors per Completion Level)
  const formCompletionDistribution = useMemo(() => {
    return [
      { level: '0%', visitors: Math.floor(Math.random() * 200) + 400 },
      { level: '25%', visitors: Math.floor(Math.random() * 150) + 250 },
      { level: '50%', visitors: Math.floor(Math.random() * 100) + 150 },
      { level: '75%', visitors: Math.floor(Math.random() * 100) + 100 },
      { level: '100%', visitors: Math.floor(Math.random() * 200) + 300 },
    ];
  }, [selectedForm]);

  const dummyStats = [
    { title: 'Active Users', value: '1,284', change: '+12%', icon: Users, color: 'text-blue-500' },
    { title: 'Top Page View', value: '/home', change: '+5%', icon: Layers, color: 'text-purple-500' },
    { title: 'Avg. Conv.', value: '14.2%', change: '+0.4%', icon: TrendingUp, color: 'text-green-500' },
  ];

  return (
    <div className='flex flex-col w-full h-full'>
      <DashboardHeader />
      <div className='flex-1 p-4 sm:p-6 md:p-8 w-full h-full max-w-7xl mx-auto space-y-6 sm:space-y-8'>
        
        {/* Top Row: Key Stats & Data Selector */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
          
          {/* Data Type Selector Card */}
          <DisplayCard 
            resetClass 
            className='col-span-1 bg-card border border-border/80 rounded-2xl p-5 relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300'
          >
            <div className='absolute inset-0 bg-gradient-to-br from-card to-rose-50/5 dark:to-rose-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
            
            <div className='relative z-10 space-y-3'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-semibold text-foreground opacity-80'>Data Source</h3>
                <Layers className='w-4 h-4 text-rose-500' />
              </div>
              
              <div className='flex flex-col gap-1.5'>
                {(['pages', 'forms', 'buttons'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setDataType(type)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-300 ${
                      dataType === type 
                      ? 'bg-rose-500 text-white shadow-md' 
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/60'
                    }`}
                  >
                    <span className='capitalize font-medium'>{type}</span>
                    {dataType === type && <TrendingUp className='w-3 h-3' />}
                  </button>
                ))}
              </div>
            </div>
          </DisplayCard>

          {/* Dummy Stats Cards */}
          {dummyStats.map((stat, index) => (
            <DisplayCard 
              key={index}
              resetClass
              className='col-span-1 bg-card border border-border/80 rounded-2xl p-5 relative overflow-hidden group hover:shadow-xl transition-all duration-500'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-card to-rose-50/5 dark:to-rose-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              
              <div className='relative z-10 h-full flex flex-col justify-between'>
                <div className='flex items-center justify-between mb-4'>
                  <div className={`p-2 rounded-xl bg-muted/50 ${stat.color}`}>
                    <stat.icon className='w-4 h-4' />
                  </div>
                  <span className='text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full'>
                    {stat.change}
                  </span>
                </div>
                
                <div>
                  <p className='text-xs text-muted-foreground mb-0.5'>{stat.title}</p>
                  <p className='text-xl font-bold text-foreground tracking-tight'>{stat.value}</p>
                </div>
              </div>
              
              <div className='absolute bottom-0 left-0 h-0.5 bg-rose-500 w-0 group-hover:w-full transition-all duration-700' />
            </DisplayCard>
          ))}
        </div>

        {/* Middle Row: Main Chart Area */}
        <div className='w-full'>
          <ChartAreaInteractive />
        </div>

        {/* Bottom Row: Detailed Analysis & Charts */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
          
          {/* Pages Performance with Shadcn Select & Percentage BarChart */}
          <DisplayCard 
            resetClass 
            className='bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden group shadow-sm h-full flex flex-col'
          >
            <div className='absolute inset-0 bg-gradient-to-br from-card to-rose-50/5 dark:to-rose-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none' />
            
            <div className='relative z-10 h-full flex flex-col'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
                <div>
                  <h3 className='font-bold text-xl text-foreground flex items-center gap-2'>
                    <MousePointer2 className='w-5 h-5 text-rose-500' />
                    Page Performance
                  </h3>
                  <p className='text-sm text-muted-foreground'>Individual route analysis (%)</p>
                </div>
                
                <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                  <SelectTrigger className="w-[140px] bg-muted/40 border-border/60 rounded-xl h-9 text-xs">
                    <SelectValue placeholder="Select Route" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/60 bg-card/95 backdrop-blur-md">
                    {routes.map((route) => (
                      <SelectItem key={route.value} value={route.value} className="text-xs rounded-lg">
                        {route.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* BarChart Implementation */}
              <div className='w-full flex-1 min-h-[250px]'>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} 
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                      formatter={(value: number) => [`${value}%`, 'Value']}
                      contentStyle={{ 
                        background: 'var(--card)', 
                        border: '1px solid var(--border)', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="percentage" 
                      fill="url(#roseGradient)" 
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    >
                      {pageData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 5 ? '#e11d48' : '#fb7185'} opacity={0.8} />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e11d48" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#e11d48" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </DisplayCard>

          {/* Forms Completion Frequency (Histogram) */}
          <DisplayCard 
            resetClass 
            className='bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden group shadow-sm h-full flex flex-col'
          >
             <div className='absolute inset-0 bg-gradient-to-br from-card to-rose-50/5 dark:to-rose-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none' />
            
            <div className='relative z-10 h-full flex flex-col'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
                <div>
                  <h3 className='font-bold text-xl text-foreground flex items-center gap-2'>
                    <FileCheck className='w-5 h-5 text-rose-500' />
                    Form Completion
                  </h3>
                  <p className='text-sm text-muted-foreground'>Visitors by completion level</p>
                </div>
                
                <Select value={selectedForm} onValueChange={setSelectedForm}>
                  <SelectTrigger className="w-[160px] bg-muted/40 border-border/60 rounded-xl h-9 text-xs">
                    <SelectValue placeholder="Select Form" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/60 bg-card/95 backdrop-blur-md">
                    {forms.map((form) => (
                      <SelectItem key={form.value} value={form.value} className="text-xs rounded-lg">
                        {form.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Histogram Implementation (BarChart) */}
              <div className='w-full flex-1 min-h-[250px]'>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={formCompletionDistribution} 
                    layout="vertical"
                    margin={{ left: 10, right: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="level" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} 
                      width={50}
                    />
                    <Tooltip 
                      cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                      formatter={(value: number) => [`${value} visitors`, 'Count']}
                      contentStyle={{ 
                        background: 'var(--card)', 
                        border: '1px solid var(--border)', 
                        borderRadius: '12px'
                      }}
                    />
                    <Bar 
                      dataKey="visitors" 
                      fill="url(#roseGradientForm)" 
                      radius={[0, 6, 6, 0]}
                      barSize={24}
                    >
                      {formCompletionDistribution.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill="#e11d48" 
                          fillOpacity={0.4 + (index * 0.15)}
                        />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="roseGradientForm" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#e11d48" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#e11d48" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className='mt-4 flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-wider font-bold'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 rounded-full bg-rose-500' />
                  Top of Funnel
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 rounded-full bg-rose-200' />
                  Conversion
                </div>
              </div>
            </div>
          </DisplayCard>

        </div>
      </div>
    </div>
  );
}

export default Analytics;
