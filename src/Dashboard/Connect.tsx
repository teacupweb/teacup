'use client';

import { useState } from 'react';
import { useAuth } from '@/AuthProvider';
import { useCompany } from '@/backendProvider';
import DisplayCard from '@/Components/DisplayCards';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { IconCopy, IconEye, IconEyeOff } from '@tabler/icons-react';

function CredentialRow({
  label,
  value,
  masked = false,
}: {
  label: string;
  value: string;
  masked?: boolean;
}) {
  const [revealed, setRevealed] = useState(!masked);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div>
      <p className='text-xs font-medium text-muted-foreground mb-1'>
        {label}
      </p>
      <div className='flex items-center gap-2'>
        <div className='flex-1 bg-muted/50 p-2.5 rounded-lg border border-border overflow-hidden'>
          <code className='text-sm text-foreground/80 font-mono break-all'>
            {revealed ? value : '•'.repeat(Math.min(value.length, 32))}
          </code>
        </div>
        {masked && (
          <button
            onClick={() => setRevealed((r) => !r)}
            aria-label={revealed ? `Hide ${label}` : `Reveal ${label}`}
            className='shrink-0 p-2.5 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer'
          >
            {revealed ? (
              <IconEyeOff className='w-4 h-4' />
            ) : (
              <IconEye className='w-4 h-4' />
            )}
          </button>
        )}
        <button
          onClick={handleCopy}
          aria-label={`Copy ${label}`}
          className='shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors cursor-pointer'
        >
          <IconCopy className='w-3.5 h-3.5' />
          Copy
        </button>
      </div>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className='relative group'>
      <pre className='bg-muted/50 border border-border rounded-lg p-4 text-xs font-mono overflow-x-auto text-foreground/90 whitespace-pre'>
        {code}
      </pre>
      <button
        onClick={handleCopy}
        aria-label='Copy code'
        className='absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted text-xs font-medium transition-colors cursor-pointer opacity-0 group-hover:opacity-100'
      >
        <IconCopy className='w-3.5 h-3.5' />
        Copy
      </button>
    </div>
  );
}

export default function Connect() {
  const { user } = useAuth();
  const companyId = user.companyId;
  const { data: company, isLoading } = useCompany(companyId);

  const clientId = company?.id || '';
  const clientKey = company?.key || '';

  const initSnippet = `import teacup from 'teacupweb';

const client = teacup('${clientId || 'YOUR_CLIENT_ID'}', '${
    clientKey || 'YOUR_CLIENT_KEY'
  }');

if (client.error) {
  console.error(client.message);
} else {
  client.analytics.track();
}`;

  const envSnippet = `TEACUP_CLIENT_ID=${clientId || 'your_client_id'}
TEACUP_CLIENT_KEY=${clientKey || 'your_client_key'}`;

  if (isLoading) {
    return (
      <div className='flex flex-col w-full h-full p-6'>
        <div className='flex-1 space-y-6'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-40 w-full' />
          <Skeleton className='h-64 w-full' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full h-full p-6'>
      <div className='mb-8'>
        <h2 className='font-bold ubuntu-font text-3xl text-foreground mb-2'>
          Connect Your Website
        </h2>
        <p className='text-muted-foreground'>
          Use these credentials to link your website to this dashboard via
          the <code className='text-xs'>teacupweb</code> package.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-6'>
          <DisplayCard>
            <h3 className='font-bold text-xl text-foreground mb-4 pb-2 border-b border-border/50'>
              Your Credentials
            </h3>
            <div className='space-y-4'>
              <CredentialRow label='Client ID' value={clientId} />
              <CredentialRow label='Client Key' value={clientKey} masked />
            </div>
          </DisplayCard>

          <DisplayCard>
            <h3 className='font-bold text-xl text-foreground mb-4 pb-2 border-b border-border/50'>
              1. Install the library
            </h3>
            <CodeBlock code='npm install teacupweb' />
          </DisplayCard>

          <DisplayCard>
            <h3 className='font-bold text-xl text-foreground mb-4 pb-2 border-b border-border/50'>
              2. Initialize with your credentials
            </h3>
            <p className='text-xs text-muted-foreground mb-3'>
              Run this once when your site loads. It connects your site to
              this dashboard and starts sending analytics.
            </p>
            <CodeBlock code={initSnippet} />
          </DisplayCard>

          <DisplayCard>
            <h3 className='font-bold text-xl text-foreground mb-4 pb-2 border-b border-border/50'>
              Optional: keep credentials in env vars
            </h3>
            <p className='text-xs text-muted-foreground mb-3'>
              Recommended if your site is built with a bundler (Next.js,
              Vite, etc.) instead of hardcoding the values above.
            </p>
            <CodeBlock code={envSnippet} />
          </DisplayCard>
        </div>

        <div className='space-y-6'>
          <div className='bg-card p-6 rounded-2xl border border-border shadow-sm'>
            <h3 className='font-bold text-lg text-foreground mb-2'>
              How it works
            </h3>
            <ul className='space-y-2 text-sm text-muted-foreground list-disc list-inside'>
              <li>
                Your Client ID and Client Key uniquely identify your company
                to the Teacup backend.
              </li>
              <li>
                Once initialized, your site can submit leads, appointments,
                and testimonials, and show approved content — all managed
                from this dashboard.
              </li>
              <li>
                The Client Key is safe to ship in client-side JavaScript; it
                only grants access to your company&apos;s public-facing data.
              </li>
            </ul>
          </div>

          <div className='bg-amber-500/10 p-6 rounded-2xl border border-amber-500/30'>
            <h3 className='font-bold text-lg text-amber-600 dark:text-amber-400 mb-2'>
              Keep it linked to your company
            </h3>
            <p className='text-amber-600/80 dark:text-amber-400/80 text-sm'>
              Anyone with these credentials can submit data as your company.
              Don&apos;t share them outside of your own website&apos;s
              codebase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
