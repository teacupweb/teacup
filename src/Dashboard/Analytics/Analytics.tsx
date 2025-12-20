import { useState, useMemo, useEffect } from 'react';
import DashboardHeader from '../../Components/DashboardHeader';
import ChartAreaInteractive from './Chart';
import DisplayCard from '@/Components/DisplayCards';
import { 
  Layers, 
  TrendingUp, 
  Users, 
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/AuthProvider';
import { useAnalytics, type AnalyticsEvent } from '@/backendProvider';
import Spinner from '@/Components/Spinner';

function Analytics() {
  const { user } = useAuth();
  const companyId = user && typeof user !== 'string' ? user.user_metadata?.company_id : null;

  const [dataType, setDataType] = useState<'pages' | 'forms' | 'buttons'>('pages');
  
  const eventMap: Record<string, AnalyticsEvent> = {
    pages: 'page',
    forms: 'form',
    buttons: 'button'
  };

  const { data: analyticsResponse, isLoading, error } = useAnalytics(
    companyId, 
    eventMap[dataType]
  );

  const [selectedItem, setSelectedItem] = useState<string>('');

  // Extract keys from data to form options
  const options = useMemo(() => {
    if (!analyticsResponse?.data) return [];
    return Object.keys(analyticsResponse.data).map(key => ({
      label: key,
      value: key
    }));
  }, [analyticsResponse]);

  // Handle initial selection and selection when dataType/options change
  useEffect(() => {
    if (options.length > 0) {
      if (!selectedItem || !options.find(opt => opt.value === selectedItem)) {
        setSelectedItem(options[0].value);
      }
    } else {
      setSelectedItem('');
    }
  }, [options, dataType]);

  // Extract the full 90-day dataset for the selected item
  const detailData = useMemo(() => {
    if (!analyticsResponse?.data || !selectedItem) return [];
    const itemData = analyticsResponse.data[selectedItem] || [];
    // Convert 'date' field to 'name' for the Chart component
    return itemData.map((d: any) => ({ ...d, name: d.date }));
  }, [analyticsResponse, selectedItem]);

  // Compute summary stats for the current category
  const computedStats = useMemo(() => {
    if (!analyticsResponse?.data) return [];

    let totalPrimary = 0;
    let totalSecondary = 0;
    let count = 0;
    let topItem = 'N/A';
    let maxVal = -1;

    Object.entries(analyticsResponse.data).forEach(([key, items]) => {
      let itemPrimary = 0;
      items.forEach((d: any) => {
        itemPrimary += d.primary;
        totalPrimary += d.primary;
        totalSecondary += d.secondary;
        count++;
      });
      if (itemPrimary > maxVal) {
        maxVal = itemPrimary;
        topItem = key;
      }
    });

    const avgSecondary = count > 0 ? (totalSecondary / count).toFixed(1) : '0';
    const avgPrimary = count > 0 ? (totalPrimary / count).toFixed(1) : '0';

    if (dataType === 'pages') {
      return [
        { title: 'Total Views', value: totalPrimary.toLocaleString(), change: '', icon: Layers, color: 'text-blue-500' },
        { title: 'Avg. Scroll', value: `${avgSecondary}%`, change: '', icon: TrendingUp, color: 'text-green-500' },
        { title: 'Top Page', value: topItem, change: '', icon: Users, color: 'text-purple-500' },
      ];
    } else if (dataType === 'forms') {
      const totalCompletions = Object.values(analyticsResponse.data).reduce((acc: number, items: any) => 
        acc + items.reduce((sum: number, d: any) => sum + d.secondary, 0), 0
      );
      return [
        { title: 'Avg. Completion', value: `${avgPrimary}%`, change: '', icon: TrendingUp, color: 'text-green-500' },
        { title: '100% Completes', value: totalCompletions.toLocaleString(), change: '', icon: Layers, color: 'text-blue-500' },
        { title: 'Top Form', value: topItem, change: '', icon: Users, color: 'text-purple-500' },
      ];
    } else {
      return [
        { title: 'Total Clicks', value: totalPrimary.toLocaleString(), change: '', icon: Layers, color: 'text-blue-500' },
        { title: 'Avg. Clicks/Day', value: (totalPrimary / 90).toFixed(1), change: '', icon: TrendingUp, color: 'text-green-500' },
        { title: 'Top Button', value: topItem, change: '', icon: Users, color: 'text-purple-500' },
      ];
    }
  }, [analyticsResponse, dataType]);


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

          {/* Dynamic Stats Cards */}
          {computedStats.map((stat, index) => (
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
          {isLoading ? (
            <div className='w-full h-[400px] flex items-center justify-center bg-card rounded-2xl border border-border/80'>
              <Spinner size='lg' />
            </div>
          ) : error ? (
            <div className='w-full h-[400px] flex flex-col items-center justify-center bg-card rounded-2xl border border-border/80 text-destructive gap-4'>
              <AlertCircle className='w-12 h-12' />
              <p className='font-semibold'>Failed to load analytics data</p>
              <button 
                onClick={() => window.location.reload()}
                className='px-4 py-2 bg-rose-500 text-white rounded-lg text-sm hover:bg-rose-600 transition-colors'
              >
                Retry
              </button>
            </div>
          ) : options.length === 0 ? (
            <div className='w-full h-[400px] flex flex-col items-center justify-center bg-card rounded-2xl border border-border/80 text-muted-foreground gap-4'>
              <Layers className='w-12 h-12 opacity-20' />
              <p className='font-semibold'>No data available for this category</p>
              <p className='text-xs'>Try selecting a different data source or check back later.</p>
            </div>
          ) : (
            <ChartAreaInteractive 
              dataType={dataType}
              selectedItem={selectedItem}
              onItemChange={setSelectedItem}
              options={options}
              data={detailData}
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default Analytics;
