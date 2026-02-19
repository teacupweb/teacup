'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthProvider';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Globe, ArrowRight, Layout, Sparkles } from 'lucide-react';

export default function OrderSitePage() {
  const { user } = useAuth();
  const router = useRouter();

  // AUTH PROTECTION - Commented out as requested
  /*
  useEffect(() => {
    if (user === 'userNotFound') {
      router.push('/auth/login?redirect=/order-site');
    }
  }, [user, router]);

  if (user === null || user === 'userNotFound') {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='animate-pulse text-xl font-medium text-rose-600'>Redirecting...</div>
      </div>
    );
  }
  */

  return (
    <div className='bg-background text-foreground min-h-screen'>
      <div className='mx-auto container'>
        <Navbar />
        
        <div className='py-20 px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-16'>
              <span className='bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-1 rounded-3xl text-sm font-medium mb-4 inline-block'>
                Free Forever
              </span>
              <h1 className='text-5xl ubuntu-font mb-6'>Order Your New Website</h1>
              <p className='text-xl text-muted-foreground'>
                Tell us a bit about your business and we'll handle the rest. No coding required.
              </p>
            </div>

            <div className='grid md:grid-cols-2 gap-12 items-center'>
              <div className='space-y-8'>
                <div className='bg-card border border-border p-8 rounded-3xl shadow-sm'>
                  <h2 className='text-2xl font-bold mb-6 flex items-center gap-2'>
                    <Layout className='w-6 h-6 text-rose-600' />
                    Site Details
                  </h2>
                  
                  <div className='space-y-6'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>Business Name</label>
                      <input 
                        type='text' 
                        placeholder='My Awesome Business'
                        className='w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-rose-500 focus:outline-none transition-colors'
                      />
                    </div>
                    
                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>Industry / Category</label>
                      <select className='w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-rose-500 focus:outline-none transition-colors'>
                        <option>Retail</option>
                        <option>E-commerce</option>
                        <option>Service Business</option>
                        <option>Portfolio</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>Description</label>
                      <textarea 
                        placeholder='Tell us what your business does...'
                        rows={4}
                        className='w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-rose-500 focus:outline-none transition-colors resize-none'
                      />
                    </div>
                  </div>

                  <button 
                    className='w-full mt-8 bg-linear-to-r from-rose-500 to-rose-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 group'
                  >
                    Launch My Free Site
                    <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                  </button>
                </div>
              </div>

              <div className='space-y-8'>
                <div className='bg-rose-50 dark:bg-rose-900/10 p-8 rounded-3xl border border-rose-100 dark:border-rose-900/30'>
                  <h3 className='text-xl font-bold mb-4 flex items-center gap-2 text-rose-700 dark:text-rose-300'>
                    <Sparkles className='w-5 h-5' />
                    What you get for free
                  </h3>
                  <ul className='space-y-4 text-muted-foreground'>
                    <li className='flex gap-3'>
                      <div className='w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0' />
                      <span>Professional design customized for your business</span>
                    </li>
                    <li className='flex gap-3'>
                      <div className='w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0' />
                      <span>Mobile-responsive layout</span>
                    </li>
                    <li className='flex gap-3'>
                      <div className='w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0' />
                      <span>Ready-to-use CMS for blogs and products</span>
                    </li>
                    <li className='flex gap-3'>
                      <div className='w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0' />
                      <span>Secure hosting on teacup.website</span>
                    </li>
                  </ul>
                </div>

                <div className='bg-card border border-border p-8 rounded-3xl text-center'>
                  <Globe className='w-12 h-12 text-rose-600 mx-auto mb-4 opacity-20' />
                  <p className='text-sm text-muted-foreground'>
                    Once you submit, our system will generate your site within minutes. You'll receive an email with your access details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
