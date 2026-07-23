'use client';

import { useState } from 'react';
import DisplayCard from '@/Components/DisplayCards';
import Modal, { openModal, closeModal } from '@/Components/Modal';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from '@/backendProvider';
import type { ApprovalStatus } from '@/types/schema';

const TABS: { label: string; status?: ApprovalStatus }[] = [
  { label: 'All' },
  { label: 'Pending', status: 'PENDING' },
  { label: 'Approved', status: 'APPROVED' },
  { label: 'Rejected', status: 'REJECTED' },
];

const statusBadge: Record<string, string> = {
  PENDING: 'bg-amber-500/15 text-amber-600',
  APPROVED: 'bg-emerald-500/15 text-emerald-600',
  REJECTED: 'bg-red-500/15 text-red-600',
};

export default function Testimonials() {
  const [tab, setTab] = useState('All');
  const activeStatus = TABS.find((t) => t.label === tab)?.status;
  const { data, isLoading } = useTestimonials(activeStatus);

  const create = useCreateTestimonial();
  const update = useUpdateTestimonial();
  const remove = useDeleteTestimonial();

  const testimonials = data?.testimonials ?? [];

  const setStatus = async (id: string, status: ApprovalStatus) => {
    try {
      await update.mutateAsync({ id, status });
    } catch {
      toast.error('Failed to update testimonial');
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      await update.mutateAsync({ id, featured });
    } catch {
      toast.error('Failed to update testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial permanently?')) return;
    try {
      await remove.mutateAsync(id);
      toast.success('Testimonial deleted');
    } catch {
      toast.error('Failed to delete testimonial');
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await create.mutateAsync({
        authorName: String(data.get('authorName') ?? ''),
        company: String(data.get('company') ?? '') || undefined,
        role: String(data.get('role') ?? '') || undefined,
        rating: Number(data.get('rating')) || undefined,
        body: String(data.get('body') ?? ''),
      } as any);
      toast.success('Testimonial added');
      closeModal('testimonial-form');
      form.reset();
    } catch {
      toast.error('Failed to add testimonial');
    }
  };

  return (
    <div className='flex flex-col h-full mx-8'>
      <DisplayCard className='min-h-[500px] my-5'>
        <div className='h-full flex flex-col'>
          <div className='pt-5 pb-2 mb-3 border-b-2 border-rose-600 flex items-center justify-between'>
            <h3 className='font-bold ubuntu-font text-2xl'>
              Testimonials
              {data && data.pending > 0 && (
                <span className='ml-2 text-xs align-middle bg-amber-500 text-white rounded-full px-2 py-0.5'>
                  {data.pending} awaiting approval
                </span>
              )}
            </h3>
            <button
              onClick={() => openModal('testimonial-form')}
              className='bg-rose-600 cursor-pointer text-white px-5 py-1 rounded-2xl text-xs hover:bg-rose-700 transition'
            >
              Add Testimonial
            </button>
          </div>

          <div className='flex flex-wrap gap-2 mb-4'>
            {TABS.map((t) => (
              <button
                key={t.label}
                onClick={() => setTab(t.label)}
                className={`px-4 py-1.5 rounded-2xl text-xs cursor-pointer transition ${
                  tab === t.label
                    ? 'bg-rose-600 text-white'
                    : 'border border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className='space-y-2 py-4'>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className='h-24 w-full' />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className='py-16 text-center text-muted-foreground text-sm'>
              No testimonials in this view. Visitors can submit them through
              your website via the teacupweb library — they land here as
              Pending until you approve them.
            </div>
          ) : (
            <div className='grid md:grid-cols-2 gap-4 pb-6'>
              {testimonials.map((t) => (
                <div key={t.id} className='rounded-lg border border-border p-4 flex flex-col gap-2'>
                  <div className='flex items-start justify-between gap-2'>
                    <div>
                      <p className='font-medium text-foreground'>
                        {t.authorName}
                        {t.featured && (
                          <span className='ml-2 text-xs text-rose-600'>★ Featured</span>
                        )}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {[t.role, t.company].filter(Boolean).join(' · ') || t.source}
                        {t.rating ? ` · ${'★'.repeat(t.rating)}` : ''}
                      </p>
                    </div>
                    <Badge className={statusBadge[t.status] ?? ''}>{t.status}</Badge>
                  </div>
                  {/* Testimonial text is visitor-controlled — render as plain text only */}
                  <p className='text-sm text-foreground whitespace-pre-wrap'>{t.body}</p>
                  <div className='flex flex-wrap gap-2 mt-auto pt-2'>
                    {t.status !== 'APPROVED' && (
                      <button onClick={() => setStatus(t.id, 'APPROVED')}
                        className='px-3 py-1 rounded-2xl text-xs bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer transition'>
                        Approve
                      </button>
                    )}
                    {t.status !== 'REJECTED' && (
                      <button onClick={() => setStatus(t.id, 'REJECTED')}
                        className='px-3 py-1 rounded-2xl text-xs border border-border text-muted-foreground hover:bg-muted cursor-pointer transition'>
                        Reject
                      </button>
                    )}
                    <button onClick={() => toggleFeatured(t.id, !t.featured)}
                      className='px-3 py-1 rounded-2xl text-xs border border-border text-muted-foreground hover:bg-muted cursor-pointer transition'>
                      {t.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button onClick={() => handleDelete(t.id)}
                      className='px-3 py-1 rounded-2xl text-xs border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition ml-auto'>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DisplayCard>

      <Modal id='testimonial-form' className='max-w-lg'>
        <div className='p-6'>
          <h4 className='font-bold ubuntu-font text-xl mb-4'>Add Testimonial</h4>
          <form onSubmit={handleCreate} className='flex flex-col gap-3'>
            <input name='authorName' required placeholder='Author name'
              className='p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
            <div className='grid grid-cols-2 gap-3'>
              <input name='role' placeholder='Role (optional)'
                className='p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
              <input name='company' placeholder='Company (optional)'
                className='p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
            </div>
            <select name='rating' defaultValue=''
              className='p-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-rose-500'>
              <option value=''>No rating</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{'★'.repeat(n)}</option>
              ))}
            </select>
            <textarea name='body' required rows={4} placeholder='Testimonial text'
              className='p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
            <button type='submit' disabled={create.isLoading}
              className='mt-2 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:opacity-50 transition'>
              {create.isLoading ? 'Adding…' : 'Add'}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
