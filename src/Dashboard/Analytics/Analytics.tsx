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
  MousePointerClick
} from 'lucide-react';
// Import the generated 90-day analytics data
import analyticsData from './data.json';

function Analytics() {
  const [dataType, setDataType] = useState<'buttons' | 'forms' | 'pages'>('pages');
  const [selectedRoute, setSelectedRoute] = useState('home');
  const [selectedForm, setSelectedForm] = useState('contact-us');
  const [selectedButton, setSelectedButton] = useState('cta-primary');

  const routes = [
    { label: 'Home Page', value: 'home' },
    { label: 'About Us', value: 'about' },
    { label: 'Contact', value: 'contact' },
    { label: 'Pricing', value: 'pricing' },
    { label: 'Blog', value: 'blog' },
  ];

  const forms = [
    { label: 'Contact Us Form', value: 'contact-us' },
    { label: 'Newsletter Sign-up', value: 'newsletter' },
    { label: 'Waitlist Form', value: 'waitlist' },
  ];

  const buttons = [
    { label: 'Primary CTA', value: 'cta-primary' },
    { label: 'Secondary CTA', value: 'cta-secondary' },
    { label: 'Login Button', value: 'login' },
    { label: 'Register Button', value: 'register' },
  ];

  // Map dataType to the correct key in our JSON
  const dataKeyMap = {
    pages: 'pages',
    forms: 'forms',
    buttons: 'buttons'
  };

  // Get the correct selection based on current dataType
  const activeSelectionValue = useMemo(() => {
    switch(dataType) {
      case 'pages': return selectedRoute;
      case 'forms': return selectedForm;
      case 'buttons': return selectedButton;
    }
  }, [dataType, selectedRoute, selectedForm, selectedButton]);

  // Extract the full 90-day dataset for the selected item from the JSON
  const detailData = useMemo(() => {
    const category = dataKeyMap[dataType] as keyof typeof analyticsData;
    const itemData = (analyticsData[category] as any)[activeSelectionValue];
    return itemData || [];
  }, [dataType, activeSelectionValue]);

  const dummyStats = [
    { title: 'Active Users', value: '1,284', change: '+12%', icon: Users, color: 'text-blue-500' },
    { title: 'Top Page View', value: '/home', change: '+5%', icon: Layers, color: 'text-purple-500' },
    { title: 'Avg. Conv.', value: '14.2%', change: '+0.4%', icon: TrendingUp, color: 'text-green-500' },
  ];

  const getActiveSelectionMetadata = () => {
    switch(dataType) {
      case 'pages': return { value: selectedRoute, setter: setSelectedRoute, list: routes, icon: MousePointer2 };
      case 'forms': return { value: selectedForm, setter: setSelectedForm, list: forms, icon: FileCheck };
      case 'buttons': return { value: selectedButton, setter: setSelectedButton, list: buttons, icon: MousePointerClick };
    }
  };

  const active = getActiveSelectionMetadata();

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

        {/* Middle Row: Main Dynamic Chart Area */}
        <div className='w-full'>
          <ChartAreaInteractive 
            dataType={dataType}
            selectedItem={active.value}
            onItemChange={active.setter}
            options={active.list}
            data={detailData}
          />
        </div>

      </div>
    </div>
  );
}

export default Analytics;
