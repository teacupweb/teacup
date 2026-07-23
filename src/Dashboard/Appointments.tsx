'use client';

import { useMemo, useState } from 'react';
import DisplayCard from '@/Components/DisplayCards';
import Modal, { openModal, closeModal } from '@/Components/Modal';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointmentStatus,
  useRescheduleAppointment,
  useAppointmentSettings,
  useSaveAppointmentSettings,
} from '@/backendProvider';
import type { Appointment, ApptStatus } from '@/types/schema';

const STATUSES: ApptStatus[] = [
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
];

const statusBadge: Record<string, string> = {
  PENDING: 'bg-amber-500/15 text-amber-600',
  CONFIRMED: 'bg-emerald-500/15 text-emerald-600',
  COMPLETED: 'bg-muted text-muted-foreground',
  CANCELLED: 'bg-red-500/15 text-red-600',
  NO_SHOW: 'bg-red-500/15 text-red-600',
};

const DAY_LABELS: { key: string; label: string }[] = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

export default function Appointments() {
  const { data: appointments, isLoading } = useAppointments();
  const { data: settings } = useAppointmentSettings();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const create = useCreateAppointment();
  const updateStatus = useUpdateAppointmentStatus();
  const reschedule = useRescheduleAppointment();
  const saveSettings = useSaveAppointmentSettings();

  const selected =
    (appointments ?? []).find((a) => a.id === selectedId) ?? null;

  // Group upcoming/recent appointments by calendar day for a simple agenda view.
  const grouped = useMemo(() => {
    const groups = new Map<string, Appointment[]>();
    for (const a of appointments ?? []) {
      const key = new Date(a.startsAt).toDateString();
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(a);
    }
    return [...groups.entries()].sort(
      (x, y) => new Date(x[0]).getTime() - new Date(y[0]).getTime(),
    );
  }, [appointments]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const date = String(data.get('date') ?? '');
    const time = String(data.get('time') ?? '');
    const durationMin = Number(data.get('duration') || 60);
    const startsAt = new Date(`${date}T${time}`);
    if (Number.isNaN(startsAt.getTime())) {
      toast.error('Pick a valid date and time');
      return;
    }
    try {
      await create.mutateAsync({
        customerName: String(data.get('customerName') ?? ''),
        customerEmail: String(data.get('customerEmail') ?? ''),
        customerPhone: String(data.get('customerPhone') ?? '') || undefined,
        service: String(data.get('service') ?? '') || undefined,
        notes: String(data.get('notes') ?? '') || undefined,
        startsAt: startsAt.toISOString(),
        endsAt: new Date(startsAt.getTime() + durationMin * 60000).toISOString(),
      } as Partial<Appointment>);
      toast.success('Appointment created');
      closeModal('appt-form');
      form.reset();
    } catch (err) {
      toast.error(
        err instanceof Error && err.message.includes('taken')
          ? 'That slot is already taken'
          : 'Failed to create appointment',
      );
    }
  };

  const handleStatus = async (status: ApptStatus) => {
    if (!selected) return;
    try {
      await updateStatus.mutateAsync({ id: selected.id, status });
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleReschedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected) return;
    const data = new FormData(e.currentTarget);
    const startsAt = new Date(
      `${String(data.get('date'))}T${String(data.get('time'))}`,
    );
    if (Number.isNaN(startsAt.getTime())) {
      toast.error('Pick a valid date and time');
      return;
    }
    const duration =
      new Date(selected.endsAt).getTime() - new Date(selected.startsAt).getTime();
    try {
      await reschedule.mutateAsync({
        id: selected.id,
        startsAt: startsAt.toISOString(),
        endsAt: new Date(startsAt.getTime() + duration).toISOString(),
      });
      toast.success('Appointment rescheduled');
    } catch {
      toast.error('Failed to reschedule (slot may be taken)');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const hours: Record<string, { start: string; end: string }[]> = {};
    for (const { key } of DAY_LABELS) {
      const enabled = data.get(`${key}-enabled`) === 'on';
      const start = String(data.get(`${key}-start`) ?? '');
      const end = String(data.get(`${key}-end`) ?? '');
      if (enabled && start && end) hours[key] = [{ start, end }];
    }
    try {
      await saveSettings.mutateAsync({
        timezone: String(data.get('timezone') ?? 'UTC'),
        slotMinutes: Number(data.get('slotMinutes') || 30),
        bufferMinutes: Number(data.get('bufferMinutes') || 0),
        minNoticeHours: Number(data.get('minNoticeHours') || 12),
        hours,
      });
      toast.success('Booking settings saved');
      closeModal('appt-settings');
    } catch {
      toast.error('Failed to save settings — check the values');
    }
  };

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className='flex flex-col h-full mx-8'>
      <DisplayCard className='min-h-[500px] my-5'>
        <div className='h-full flex flex-col'>
          <div className='pt-5 pb-2 mb-3 border-b-2 border-rose-600 flex items-center justify-between'>
            <h3 className='font-bold ubuntu-font text-2xl'>Appointments</h3>
            <div className='flex gap-2'>
              <button
                onClick={() => openModal('appt-settings')}
                className='border border-border cursor-pointer text-muted-foreground px-5 py-1 rounded-2xl text-xs hover:bg-muted transition'
              >
                Booking Settings
              </button>
              <button
                onClick={() => openModal('appt-form')}
                className='bg-rose-600 cursor-pointer text-white px-5 py-1 rounded-2xl text-xs hover:bg-rose-700 transition'
              >
                New Appointment
              </button>
            </div>
          </div>

          {!settings && !isLoading && (
            <div className='rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-sm px-4 py-3 mb-4'>
              Online booking is off — visitors can't book until you configure
              your hours in <b>Booking Settings</b>.
            </div>
          )}

          {isLoading ? (
            <div className='space-y-2 py-4'>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className='h-10 w-full' />
              ))}
            </div>
          ) : grouped.length === 0 ? (
            <div className='py-16 text-center text-muted-foreground text-sm'>
              No appointments yet. Create one manually or let visitors book
              through your website via the teacupweb library.
            </div>
          ) : (
            <div className='flex flex-col gap-6 pb-6'>
              {grouped.map(([day, appts]) => (
                <div key={day}>
                  <p className='text-xs font-medium text-muted-foreground uppercase mb-2'>
                    {day}
                  </p>
                  <div className='flex flex-col gap-2'>
                    {appts.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          setSelectedId(a.id);
                          openModal('appt-detail');
                        }}
                        className='flex items-center justify-between gap-4 rounded-md border border-border p-3 text-left hover:bg-muted cursor-pointer transition'
                      >
                        <div>
                          <p className='text-sm font-medium text-foreground'>
                            {a.customerName}
                            {a.service ? (
                              <span className='text-muted-foreground font-normal'>
                                {' '}· {a.service}
                              </span>
                            ) : null}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {fmtTime(a.startsAt)} – {fmtTime(a.endsAt)} ·{' '}
                            {a.customerEmail}
                          </p>
                        </div>
                        <Badge
                          className={
                            statusBadge[a.status] ?? 'bg-muted text-muted-foreground'
                          }
                        >
                          {a.status.replace('_', ' ')}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DisplayCard>

      {/* Create */}
      <Modal id='appt-form' className='max-w-lg'>
        <div className='p-6'>
          <h4 className='font-bold ubuntu-font text-xl mb-4'>New Appointment</h4>
          <form onSubmit={handleCreate} className='flex flex-col gap-3'>
            <input name='customerName' required placeholder='Customer name'
              className='p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
            <input name='customerEmail' type='email' required placeholder='Customer email'
              className='p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
            <input name='customerPhone' placeholder='Phone (optional)'
              className='p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
            <input name='service' placeholder='Service (optional)'
              className='p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
            <div className='grid grid-cols-3 gap-3'>
              <input name='date' type='date' required
                className='p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
              <input name='time' type='time' required
                className='p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
              <select name='duration' defaultValue='60'
                className='p-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-rose-500'>
                <option value='30'>30 min</option>
                <option value='60'>1 hour</option>
                <option value='90'>1.5 hours</option>
                <option value='120'>2 hours</option>
              </select>
            </div>
            <textarea name='notes' placeholder='Notes (optional)' rows={3}
              className='p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
            <button type='submit' disabled={create.isLoading}
              className='mt-2 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:opacity-50 transition'>
              {create.isLoading ? 'Creating…' : 'Create'}
            </button>
          </form>
        </div>
      </Modal>

      {/* Detail */}
      <Modal id='appt-detail' className='max-w-lg' onClose={() => setSelectedId(null)}>
        {selected && (
          <div className='p-6'>
            <div className='mb-4 pr-8'>
              <h4 className='font-bold ubuntu-font text-xl'>{selected.customerName}</h4>
              <p className='text-sm text-muted-foreground'>
                {selected.customerEmail}
                {selected.customerPhone ? ` · ${selected.customerPhone}` : ''}
              </p>
              <p className='text-sm text-muted-foreground mt-1'>
                {new Date(selected.startsAt).toLocaleString()} –{' '}
                {fmtTime(selected.endsAt)}
                {selected.service ? ` · ${selected.service}` : ''}
              </p>
            </div>

            <div className='flex flex-wrap gap-2 mb-5'>
              {STATUSES.map((s) => (
                <button key={s} onClick={() => handleStatus(s)}
                  className={`px-3 py-1 rounded-2xl text-xs cursor-pointer transition ${
                    selected.status === s
                      ? 'bg-rose-600 text-white'
                      : 'border border-border text-muted-foreground hover:bg-muted'
                  }`}>
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>

            {selected.notes && (
              <div className='rounded-lg bg-muted/50 border border-border p-4 mb-5'>
                <p className='text-sm text-foreground whitespace-pre-wrap'>
                  {selected.notes}
                </p>
              </div>
            )}

            <p className='text-xs font-medium text-muted-foreground uppercase mb-2'>
              Reschedule
            </p>
            <form onSubmit={handleReschedule} className='flex gap-2'>
              <input name='date' type='date' required
                className='flex-1 p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
              <input name='time' type='time' required
                className='p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
              <button type='submit'
                className='bg-rose-600 cursor-pointer text-white px-4 rounded-md text-sm hover:bg-rose-700 transition'>
                Move
              </button>
            </form>
          </div>
        )}
      </Modal>

      {/* Booking settings */}
      <Modal id='appt-settings' className='max-w-lg'>
        <div className='p-6'>
          <h4 className='font-bold ubuntu-font text-xl mb-1'>Booking Settings</h4>
          <p className='text-xs text-muted-foreground mb-4'>
            These hours drive the public availability your visitors can book
            through your website.
          </p>
          <form onSubmit={handleSaveSettings} className='flex flex-col gap-3'>
            <div className='grid grid-cols-2 gap-3'>
              <label className='text-xs text-muted-foreground'>
                Timezone
                <input name='timezone' defaultValue={settings?.timezone ?? 'UTC'}
                  placeholder='e.g. America/New_York'
                  className='mt-1 w-full p-2 text-sm border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500' />
              </label>
              <label className='text-xs text-muted-foreground'>
                Slot length (min)
                <input name='slotMinutes' type='number' min={5} max={480}
                  defaultValue={settings?.slotMinutes ?? 30}
                  className='mt-1 w-full p-2 text-sm border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500' />
              </label>
              <label className='text-xs text-muted-foreground'>
                Buffer between (min)
                <input name='bufferMinutes' type='number' min={0} max={240}
                  defaultValue={settings?.bufferMinutes ?? 0}
                  className='mt-1 w-full p-2 text-sm border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500' />
              </label>
              <label className='text-xs text-muted-foreground'>
                Min notice (hours)
                <input name='minNoticeHours' type='number' min={0} max={720}
                  defaultValue={settings?.minNoticeHours ?? 12}
                  className='mt-1 w-full p-2 text-sm border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500' />
              </label>
            </div>

            <p className='text-xs font-medium text-muted-foreground uppercase mt-2'>
              Weekly hours
            </p>
            <div className='flex flex-col gap-2'>
              {DAY_LABELS.map(({ key, label }) => {
                const win = settings?.hours?.[key]?.[0];
                return (
                  <div key={key} className='flex items-center gap-3'>
                    <label className='flex items-center gap-2 w-28 text-sm'>
                      <input type='checkbox' name={`${key}-enabled`}
                        defaultChecked={!!win} className='accent-rose-600' />
                      {label}
                    </label>
                    <input name={`${key}-start`} type='time'
                      defaultValue={win?.start ?? '09:00'}
                      className='p-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
                    <span className='text-muted-foreground text-xs'>to</span>
                    <input name={`${key}-end`} type='time'
                      defaultValue={win?.end ?? '17:00'}
                      className='p-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500' />
                  </div>
                );
              })}
            </div>

            <button type='submit' disabled={saveSettings.isLoading}
              className='mt-3 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:opacity-50 transition'>
              {saveSettings.isLoading ? 'Saving…' : 'Save Settings'}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
