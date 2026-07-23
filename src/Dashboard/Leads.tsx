'use client';

import { useMemo, useState } from 'react';
import DisplayCard from '@/Components/DisplayCards';
import Modal, { openModal } from '@/Components/Modal';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  useLeads,
  useLead,
  useMarkLeadRead,
  useUpdateLeadStatus,
  useAssignLead,
  useAddLeadNote,
  useConvertLead,
  useCompanyUsers,
} from '@/backendProvider';
import type { Lead, LeadStatus } from '@/types/schema';

const STATUSES: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CLOSED_WON',
  'CLOSED_LOST',
  'SPAM',
];

const TABS: { label: string; status?: LeadStatus }[] = [
  { label: 'All' },
  { label: 'New', status: 'NEW' },
  { label: 'Contacted', status: 'CONTACTED' },
  { label: 'Qualified', status: 'QUALIFIED' },
  { label: 'Won', status: 'CLOSED_WON' },
  { label: 'Lost', status: 'CLOSED_LOST' },
  { label: 'Spam', status: 'SPAM' },
];

const statusBadge: Record<string, string> = {
  NEW: 'bg-sky-500/15 text-sky-600',
  CONTACTED: 'bg-amber-500/15 text-amber-600',
  QUALIFIED: 'bg-rose-600/15 text-rose-600',
  CLOSED_WON: 'bg-emerald-500/15 text-emerald-600',
  CLOSED_LOST: 'bg-muted text-muted-foreground',
  SPAM: 'bg-red-500/15 text-red-600',
};

export default function Leads() {
  const [tab, setTab] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  const activeStatus = TABS.find((t) => t.label === tab)?.status;
  const { data, isLoading } = useLeads(
    activeStatus ? { status: activeStatus } : undefined,
  );
  const { data: selected } = useLead(selectedId);
  const { data: users } = useCompanyUsers();

  const markRead = useMarkLeadRead();
  const updateStatus = useUpdateLeadStatus();
  const assign = useAssignLead();
  const addNote = useAddLeadNote();
  const convert = useConvertLead();

  const leads = data?.leads ?? [];
  const counts = useMemo(() => {
    const c = data?.counts ?? {};
    const total = Object.values(c).reduce((a, b) => a + (b ?? 0), 0);
    return { total, byStatus: c };
  }, [data]);

  const tabCount = (t: (typeof TABS)[number]) =>
    t.status === undefined ? counts.total : counts.byStatus[t.status] ?? 0;

  const openLead = (lead: Lead) => {
    setSelectedId(lead.id);
    setNoteDraft('');
    if (!lead.readAt) markRead.mutateAsync(lead.id).catch(() => {});
    openModal('lead-detail');
  };

  const handleStatus = async (status: LeadStatus) => {
    if (!selected) return;
    try {
      await updateStatus.mutateAsync({ id: selected.id, status });
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleAssign = async (userId: string) => {
    if (!selected) return;
    try {
      await assign.mutateAsync({ id: selected.id, userId: userId || null });
    } catch {
      toast.error('Failed to assign lead');
    }
  };

  const handleAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected || !noteDraft.trim()) return;
    try {
      await addNote.mutateAsync({ id: selected.id, body: noteDraft.trim() });
      setNoteDraft('');
    } catch {
      toast.error('Failed to add note');
    }
  };

  const handleConvert = async () => {
    if (!selected) return;
    try {
      await convert.mutateAsync(selected.id);
      toast.success('Draft appointment created — adjust the time in Appointments');
    } catch {
      toast.error('Failed to convert lead');
    }
  };

  return (
    <div className='flex flex-col h-full mx-8'>
      <DisplayCard className='min-h-[500px] my-5'>
        <div className='h-full flex flex-col'>
          <div className='pt-5 pb-2 mb-3 border-b-2 border-rose-600 flex items-center justify-between'>
            <h3 className='font-bold ubuntu-font text-2xl'>
              Leads
              {data && data.unread > 0 && (
                <span className='ml-2 text-xs align-middle bg-rose-600 text-white rounded-full px-2 py-0.5'>
                  {data.unread} unread
                </span>
              )}
            </h3>
            <span className='text-xs text-muted-foreground'>
              Submissions from your public site forms
            </span>
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
                <span className='ml-1.5 opacity-70'>{tabCount(t)}</span>
              </button>
            ))}
          </div>

          <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-sm text-left text-muted-foreground'>
              <thead className='text-xs text-gray-200 uppercase bg-rose-500'>
                <tr>
                  <th scope='col' className='px-6 py-3'>Name</th>
                  <th scope='col' className='px-6 py-3 hidden md:table-cell'>Type</th>
                  <th scope='col' className='px-6 py-3'>Status</th>
                  <th scope='col' className='px-6 py-3 hidden lg:table-cell'>Assigned to</th>
                  <th scope='col' className='px-6 py-3 hidden sm:table-cell'>Received</th>
                  <th scope='col' className='px-6 py-3 text-right'>
                    <span className='sr-only'>Open</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className='py-8 px-6'>
                      <div className='space-y-2'>
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className='h-6 w-full' />
                        ))}
                      </div>
                    </td>
                  </tr>
                ) : leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className='bg-card border-b border-border hover:bg-muted transition-colors'
                    >
                      <th scope='row' className='px-6 py-4 font-medium text-foreground'>
                        <div className='flex items-center gap-2'>
                          {!lead.readAt && (
                            <span
                              className='w-2 h-2 rounded-full bg-rose-500 shrink-0'
                              title='Unread'
                            />
                          )}
                          <div>
                            <p>{lead.name}</p>
                            <p className='text-muted-foreground text-xs font-normal'>
                              {lead.email}
                            </p>
                          </div>
                        </div>
                      </th>
                      <td className='px-6 py-4 hidden md:table-cell capitalize'>
                        {lead.type.toLowerCase()}
                      </td>
                      <td className='px-6 py-4'>
                        <Badge
                          className={
                            statusBadge[lead.status] ?? 'bg-muted text-muted-foreground'
                          }
                        >
                          {lead.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className='px-6 py-4 hidden lg:table-cell'>
                        {lead.assignedTo?.name ?? 'Unassigned'}
                      </td>
                      <td className='px-6 py-4 hidden sm:table-cell'>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <button
                          onClick={() => openLead(lead)}
                          className='font-medium text-rose-600 hover:underline cursor-pointer'
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className='bg-card'>
                    <td colSpan={6} className='px-6 py-10 text-center text-muted-foreground'>
                      No leads in this view. Wire up your site's contact form with
                      the teacupweb library to start collecting leads.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DisplayCard>

      <Modal id='lead-detail' className='max-w-2xl' onClose={() => setSelectedId(null)}>
        {selected && (
          <div className='p-6'>
            <div className='mb-4 pr-8'>
              <h4 className='font-bold ubuntu-font text-xl'>{selected.name}</h4>
              <p className='text-sm text-muted-foreground'>
                {selected.email}
                {selected.phone ? ` · ${selected.phone}` : ''}
                {selected.source ? ` · via ${selected.source}` : ''}
              </p>
            </div>

            <div className='flex flex-wrap gap-2 mb-5'>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatus(s)}
                  className={`px-3 py-1 rounded-2xl text-xs cursor-pointer transition ${
                    selected.status === s
                      ? 'bg-rose-600 text-white'
                      : 'border border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Message is always rendered as plain text — lead content is
                visitor-controlled input and must never be injected as HTML. */}
            <div className='rounded-lg bg-muted/50 border border-border p-4 mb-5'>
              <p className='text-sm text-foreground whitespace-pre-wrap'>
                {selected.message}
              </p>
            </div>

            <div className='grid sm:grid-cols-2 gap-4 mb-5'>
              <div>
                <label
                  htmlFor='lead-assignee'
                  className='text-xs font-medium text-muted-foreground uppercase'
                >
                  Assigned to
                </label>
                <select
                  id='lead-assignee'
                  value={selected.assignedToId ?? ''}
                  onChange={(e) => handleAssign(e.target.value)}
                  className='mt-1 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-rose-600/40'
                >
                  <option value=''>Unassigned</option>
                  {(users ?? []).map((u: any) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex items-end'>
                <button
                  onClick={handleConvert}
                  className='h-9 px-4 rounded-md border border-border text-sm text-muted-foreground hover:bg-muted cursor-pointer transition w-full'
                >
                  Convert to appointment
                </button>
              </div>
            </div>

            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase mb-2'>
                Notes
              </p>
              <div className='flex flex-col gap-2 mb-3 max-h-40 overflow-y-auto'>
                {(selected.notes ?? []).length === 0 && (
                  <p className='text-sm text-muted-foreground'>No notes yet.</p>
                )}
                {(selected.notes ?? []).map((n) => (
                  <div key={n.id} className='rounded-md border border-border p-3 text-sm'>
                    <p className='text-foreground'>{n.body}</p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {n.author?.name ?? 'Unknown'} ·{' '}
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddNote} className='flex gap-2'>
                <input
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder='Add a note…'
                  className='flex-1 p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500'
                />
                <button
                  type='submit'
                  className='bg-rose-600 cursor-pointer text-white px-4 rounded-md text-sm hover:bg-rose-700 transition'
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
