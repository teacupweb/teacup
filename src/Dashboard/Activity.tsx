'use client';

import { useState } from 'react';
import DisplayCard from '@/Components/DisplayCards';
import { Skeleton } from '@/components/ui/skeleton';
import { useActivityLog } from '@/backendProvider';

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Leads', value: 'lead' },
  { label: 'Appointments', value: 'appointment' },
  { label: 'Testimonials', value: 'testimonial' },
];

function describeDiff(diff: {
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
} | null): string {
  if (!diff) return '';
  const parts: string[] = [];
  const after = diff.after ?? {};
  const before = diff.before ?? {};
  for (const key of Object.keys(after)) {
    const from = before[key];
    const to = after[key];
    parts.push(
      from !== undefined
        ? `${key}: ${String(from)} → ${String(to)}`
        : `${key}: ${String(to)}`,
    );
  }
  return parts.join(', ');
}

export default function Activity() {
  const [filter, setFilter] = useState('');
  const { data, isLoading } = useActivityLog(filter || undefined);

  return (
    <div className='flex flex-col h-full mx-8'>
      <DisplayCard className='min-h-[500px] my-5'>
        <div className='h-full flex flex-col'>
          <div className='pt-5 pb-2 mb-3 border-b-2 border-rose-600 flex items-center justify-between'>
            <h3 className='font-bold ubuntu-font text-2xl'>Activity</h3>
            <span className='text-xs text-muted-foreground'>
              Audit trail of changes across your workspace
            </span>
          </div>

          <div className='flex flex-wrap gap-2 mb-4'>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-1.5 rounded-2xl text-xs cursor-pointer transition ${
                  filter === f.value
                    ? 'bg-rose-600 text-white'
                    : 'border border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className='space-y-2 py-4'>
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className='h-8 w-full' />
              ))}
            </div>
          ) : (data?.entries ?? []).length === 0 ? (
            <div className='py-16 text-center text-muted-foreground text-sm'>
              No activity yet. Changes to leads, appointments, and testimonials
              are recorded here automatically.
            </div>
          ) : (
            <ol className='relative border-s border-border ms-3 pb-6'>
              {(data?.entries ?? []).map((entry) => (
                <li key={entry.id} className='mb-6 ms-5'>
                  <span className='absolute flex items-center justify-center w-3 h-3 bg-rose-500 rounded-full -start-1.5 mt-1.5' />
                  <p className='text-sm text-foreground'>
                    <span className='font-medium'>
                      {entry.actor?.name ?? 'System'}
                    </span>{' '}
                    <span className='text-muted-foreground'>
                      {entry.action.replace(/[._]/g, ' ')}
                    </span>
                  </p>
                  {describeDiff(entry.diff) && (
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      {describeDiff(entry.diff)}
                    </p>
                  )}
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </DisplayCard>
    </div>
  );
}
