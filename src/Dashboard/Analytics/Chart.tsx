'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { 
  MousePointer2, 
  FileCheck, 
  MousePointerClick,
  Calendar
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ChartAreaInteractiveProps {
  dataType: 'pages' | 'forms' | 'buttons';
  selectedItem: string;
  onItemChange: (value: string) => void;
  options: { label: string; value: string }[];
  data: { name: string; primary: number; secondary: number }[];
}

export default function ChartAreaInteractive({
  dataType,
  selectedItem,
  onItemChange,
  options,
  data,
}: ChartAreaInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState('7d');

  const chartConfig = React.useMemo(() => {
    const primaryLabel = dataType === 'buttons' ? 'Clicks' : 'Views';
    const secondaryLabel = dataType === 'pages' ? 'Bounce Rate' : dataType === 'forms' ? 'Submissions' : 'Conversions';
    
    return {
      primary: {
        label: primaryLabel,
        color: '#e11d48',
      },
      secondary: {
        label: secondaryLabel,
        color: '#8b5cf6',
      },
    } satisfies ChartConfig;
  }, [dataType]);

  const filteredData = React.useMemo(() => {
    // data is already sorted by date (reverse order from generator, then reversed back in generate.js)
    // Actually our generator reversed them to be chronological.
    // The incoming 'data' is 90 items.
    let count = 7;
    if (timeRange === '30d') count = 30;
    if (timeRange === '90d') count = 90;
    
    return data.slice(-count);
  }, [data, timeRange]);

  const getTitle = () => {
    switch(dataType) {
      case 'pages': return 'Page Performance';
      case 'forms': return 'Form Conversion Funnel';
      case 'buttons': return 'Button Interaction Comparison';
      default: return 'Analytics Overview';
    }
  };

  const getDescription = () => {
    const period = timeRange === '7d' ? 'last 7 days' : timeRange === '30d' ? 'last 30 days' : 'last 90 days';
    return `Comparing metrics for the ${period}`;
  };

  const getIcon = () => {
    switch(dataType) {
      case 'pages': return <MousePointer2 className="w-5 h-5 text-rose-500" />;
      case 'forms': return <FileCheck className="w-5 h-5 text-rose-500" />;
      case 'buttons': return <MousePointerClick className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <Card className='relative overflow-hidden bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500'>
      {/* Animated background gradient */}
      <div className='absolute inset-0 bg-gradient-to-br from-card to-rose-50/10 dark:to-rose-950/10 opacity-50 pointer-events-none' />

      <CardHeader className='flex flex-col gap-4 space-y-0 border-b border-border/50 py-6 sm:flex-row sm:items-center relative z-10'>
        <div className='flex items-center gap-3 flex-1'>
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
            {getIcon()}
          </div>
          <div className='grid gap-1'>
            <CardTitle className="text-xl font-bold tracking-tight">{getTitle()}</CardTitle>
            <CardDescription className="text-sm font-medium opacity-70">
              {getDescription()}
            </CardDescription>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Item Selector */}
          <Select value={selectedItem} onValueChange={onItemChange}>
            <SelectTrigger className="w-[180px] bg-muted/40 border-border/60 rounded-xl h-10 text-xs font-semibold">
              <SelectValue placeholder="Select Item" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/60 bg-card/95 backdrop-blur-md">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs rounded-lg">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Time Range Selector */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className='w-[140px] bg-muted/40 border-border/60 rounded-xl h-10 text-xs font-semibold'
              aria-label='Select a time range'
            >
              <Calendar className="w-3.5 h-3.5 mr-2 opacity-60" />
              <SelectValue placeholder='Last 7 days' />
            </SelectTrigger>
            <SelectContent className='rounded-xl border-border/60 bg-card/95 backdrop-blur-md'>
              <SelectItem value='7d' className='rounded-lg text-xs'>
                Last 7 days
              </SelectItem>
              <SelectItem value='30d' className='rounded-lg text-xs'>
                Last 30 days
              </SelectItem>
              <SelectItem value='90d' className='rounded-lg text-xs'>
                Last 90 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className='px-2 pt-6 sm:px-6 sm:pt-10'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[400px] w-full'
        >
          <AreaChart data={filteredData} margin={{ left: 10, right: 10, top: 10 }}>
            <defs>
              <linearGradient id='fillPrimary' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#e11d48' stopOpacity={0.3}/>
                <stop offset='95%' stopColor='#e11d48' stopOpacity={0}/>
              </linearGradient>
              <linearGradient id='fillSecondary' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#8b5cf6' stopOpacity={0.3}/>
                <stop offset='95%' stopColor='#8b5cf6' stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
            <XAxis
              dataKey='name'
              tickLine={false}
              axisLine={false}
              tickMargin={15}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
              minTickGap={timeRange === '90d' ? 60 : 30}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontWeight: 500 }}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
              width={40}
            />
            {dataType !== 'buttons' && (
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                width={40}
              />
            )}
            <ChartTooltip
              cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  indicator='line'
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                  }}
                  formatter={(value: any, name: any) => {
                    const label = chartConfig[name as keyof typeof chartConfig]?.label;
                    const suffix = (dataType === 'pages' && name === 'secondary') ? '%' : '';
                    return [
                      `${value}${suffix}`,
                      label || name
                    ];
                  }}
                />
              }
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              height={36} 
              iconType="circle"
              formatter={(value: any) => {
                const label = chartConfig[value as keyof typeof chartConfig]?.label;
                return <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label || value}</span>
              }}
            />
            {dataType !== 'buttons' && (
              <Area
                yAxisId="right"
                dataKey='secondary'
                type='monotone'
                fill='url(#fillSecondary)'
                stroke='#8b5cf6'
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: 'var(--card)' }}
              />
            )}
            <Area
              yAxisId="left"
              dataKey='primary'
              type='monotone'
              fill='url(#fillPrimary)'
              stroke='#e11d48'
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#e11d48', strokeWidth: 2, stroke: 'var(--card)' }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
