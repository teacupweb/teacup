'use client';

import { useState } from 'react';
import DisplayCard from '@/Components/DisplayCards';
import Modal, { openModal, closeModal } from '@/Components/Modal';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  useHeadTags,
  useCreateHeadTag,
  useUpdateHeadTag,
  useDeleteHeadTag,
} from '@/backendProvider';
import type { HeadTag, HeadTagKind } from '@/types/schema';

const KINDS: HeadTagKind[] = ['META', 'LINK', 'SCRIPT', 'STYLE', 'NOSCRIPT'];

const kindBadge: Record<HeadTagKind, string> = {
  META: 'bg-sky-500/15 text-sky-600',
  LINK: 'bg-violet-500/15 text-violet-600',
  SCRIPT: 'bg-amber-500/15 text-amber-600',
  STYLE: 'bg-emerald-500/15 text-emerald-600',
  NOSCRIPT: 'bg-slate-500/15 text-slate-600',
};

const MODAL_ID = 'head-tag-form';

type AttrRow = { key: string; value: string };

function attributesToRows(attributes: HeadTag['attributes']): AttrRow[] {
  if (!attributes) return [{ key: '', value: '' }];
  const rows = Object.entries(attributes).map(([key, value]) => ({ key, value }));
  return rows.length ? rows : [{ key: '', value: '' }];
}

export default function HeadTags() {
  const { data, isLoading } = useHeadTags();
  const create = useCreateHeadTag();
  const update = useUpdateHeadTag();
  const remove = useDeleteHeadTag();

  const [editing, setEditing] = useState<HeadTag | null>(null);
  const [kind, setKind] = useState<HeadTagKind>('META');
  const [attrRows, setAttrRows] = useState<AttrRow[]>([{ key: '', value: '' }]);

  const headTags = data?.headTags ?? [];

  const openCreate = () => {
    setEditing(null);
    setKind('META');
    setAttrRows([{ key: '', value: '' }]);
    openModal(MODAL_ID);
  };

  const openEdit = (tag: HeadTag) => {
    setEditing(tag);
    setKind(tag.kind);
    setAttrRows(attributesToRows(tag.attributes));
    openModal(MODAL_ID);
  };

  const toggleEnabled = async (tag: HeadTag) => {
    try {
      await update.mutateAsync({ id: tag.id, enabled: !tag.enabled });
    } catch {
      toast.error('Failed to update head tag');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this head tag permanently?')) return;
    try {
      await remove.mutateAsync(id);
      toast.success('Head tag deleted');
    } catch {
      toast.error('Failed to delete head tag');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const attributes: Record<string, string> = {};
    for (const row of attrRows) {
      if (row.key.trim()) attributes[row.key.trim()] = row.value;
    }

    const body = {
      kind,
      label: String(data.get('label') ?? '') || undefined,
      content: String(data.get('content') ?? '') || undefined,
      attributes: Object.keys(attributes).length ? attributes : undefined,
    };

    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, ...body });
        toast.success('Head tag updated');
      } else {
        await create.mutateAsync(body);
        toast.success('Head tag added');
      }
      closeModal(MODAL_ID);
      form.reset();
    } catch {
      toast.error(editing ? 'Failed to update head tag' : 'Failed to add head tag');
    }
  };

  const setAttrRow = (index: number, field: 'key' | 'value', value: string) => {
    setAttrRows((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const addAttrRow = () => setAttrRows((rows) => [...rows, { key: '', value: '' }]);
  const removeAttrRow = (index: number) =>
    setAttrRows((rows) => (rows.length > 1 ? rows.filter((_, i) => i !== index) : rows));

  return (
    <div className='flex flex-col h-full mx-8'>
      <DisplayCard className='min-h-[500px] my-5'>
        <div className='h-full flex flex-col'>
          <div className='pt-5 pb-2 mb-3 border-b-2 border-rose-600 flex items-center justify-between'>
            <h3 className='font-bold ubuntu-font text-2xl'>Custom Head Tags</h3>
            <button
              onClick={openCreate}
              className='bg-rose-600 cursor-pointer text-white px-5 py-1 rounded-2xl text-xs hover:bg-rose-700 transition'
            >
              Add Tag
            </button>
          </div>

          <p className='text-xs text-muted-foreground mb-4'>
            Injected into <code>&lt;head&gt;</code> on your live site via the
            teacupweb embed script — for meta tags, verification snippets,
            analytics/pixel scripts, custom fonts, and stylesheets. Disabled
            tags are saved but not sent to your site.
          </p>

          {isLoading ? (
            <div className='space-y-2 py-4'>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className='h-16 w-full' />
              ))}
            </div>
          ) : headTags.length === 0 ? (
            <div className='py-16 text-center text-muted-foreground text-sm'>
              No custom head tags yet. Add one to inject a meta tag, script,
              stylesheet, or link into your site&apos;s &lt;head&gt;.
            </div>
          ) : (
            <div className='flex flex-col gap-2 pb-6'>
              {headTags.map((tag) => (
                <div
                  key={tag.id}
                  className='rounded-lg border border-border p-4 flex items-start justify-between gap-3'
                >
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <Badge className={kindBadge[tag.kind]}>{tag.kind}</Badge>
                      <span className='font-medium text-foreground'>
                        {tag.label || '(untitled)'}
                      </span>
                      {!tag.enabled && (
                        <span className='text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5'>
                          Disabled
                        </span>
                      )}
                    </div>
                    {tag.attributes && Object.keys(tag.attributes).length > 0 && (
                      <p className='text-xs text-muted-foreground mt-1 font-mono truncate'>
                        {Object.entries(tag.attributes)
                          .map(([k, v]) => `${k}="${v}"`)
                          .join(' ')}
                      </p>
                    )}
                    {tag.content && (
                      <p className='text-xs text-muted-foreground mt-1 font-mono truncate'>
                        {tag.content}
                      </p>
                    )}
                  </div>
                  <div className='flex flex-wrap gap-2 shrink-0'>
                    <button
                      onClick={() => toggleEnabled(tag)}
                      className='px-3 py-1 rounded-2xl text-xs border border-border text-muted-foreground hover:bg-muted cursor-pointer transition'
                    >
                      {tag.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => openEdit(tag)}
                      className='px-3 py-1 rounded-2xl text-xs border border-border text-muted-foreground hover:bg-muted cursor-pointer transition'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className='px-3 py-1 rounded-2xl text-xs border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DisplayCard>

      <Modal id={MODAL_ID} className='max-w-lg'>
        <div className='p-6'>
          <h4 className='font-bold ubuntu-font text-xl mb-4'>
            {editing ? 'Edit Head Tag' : 'Add Head Tag'}
          </h4>
          <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as HeadTagKind)}
              className='p-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-rose-500'
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>

            <input
              name='label'
              defaultValue={editing?.label ?? ''}
              placeholder='Label (optional, for your own reference)'
              className='p-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500'
            />

            <div>
              <p className='text-xs text-muted-foreground mb-1'>
                Attributes (e.g. name, content, rel, href, src)
              </p>
              <div className='flex flex-col gap-2'>
                {attrRows.map((row, i) => (
                  <div key={i} className='flex gap-2'>
                    <input
                      value={row.key}
                      onChange={(e) => setAttrRow(i, 'key', e.target.value)}
                      placeholder='attribute'
                      className='p-2 text-sm border border-input rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-rose-500'
                    />
                    <input
                      value={row.value}
                      onChange={(e) => setAttrRow(i, 'value', e.target.value)}
                      placeholder='value'
                      className='p-2 text-sm border border-input rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-rose-500'
                    />
                    <button
                      type='button'
                      onClick={() => removeAttrRow(i)}
                      className='px-2 text-muted-foreground hover:text-red-600 transition'
                      aria-label='Remove attribute'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type='button'
                onClick={addAttrRow}
                className='mt-2 text-xs text-rose-600 hover:text-rose-700 cursor-pointer'
              >
                + Add attribute
              </button>
            </div>

            <textarea
              name='content'
              defaultValue={editing?.content ?? ''}
              rows={4}
              placeholder='Content (optional — e.g. inline script/style body or noscript markup)'
              className='p-2 text-sm border border-input rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-rose-500'
            />

            <button
              type='submit'
              disabled={create.isLoading || update.isLoading}
              className='mt-2 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:opacity-50 transition'
            >
              {create.isLoading || update.isLoading
                ? 'Saving…'
                : editing
                  ? 'Save changes'
                  : 'Add'}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
