import React, { useState } from 'react';
import DashboardHeader from '../Components/DashboardHeader';
import DisplayCard from '@/Components/DisplayCards';
import { Wrench, Globe, Send, Sparkles, PlusCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/AuthProvider';
import { useCompany } from '@/backendProvider';
import Spinner from '@/Components/Spinner';
import Swal from 'sweetalert2';

export default function WebsiteServices() {
  const { user } = useAuth();
  const companyId = user && typeof user !== 'string' ? user.user_metadata?.company_id : null;
  const { data: company, isLoading } = useCompany(companyId);

  const [editDescription, setEditDescription] = useState('');
  const [newSiteType, setNewSiteType] = useState('Business/Portfolio');
  const [showOrderForm, setShowOrderForm] = useState(false);

  const hasDomain = !!company?.domain;

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await Swal.fire({
      title: 'Submit Edit Request?',
      text: 'Our team will review your changes and get back to you shortly.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#e11d48', // rose-600
      cancelButtonColor: '#64748b', // slate-500
      confirmButtonText: 'Yes, submit it!',
      background: '#fff',
    });

    if (result.isConfirmed) {
      // Submission logic commented out as requested
      /*
      console.log('Edit request submitted:', editDescription);
      */
      
      Swal.fire({
        title: 'Request Sent!',
        text: 'We have received your edit request.',
        icon: 'success',
        confirmButtonColor: '#e11d48',
        background: '#fff',
      });
      setEditDescription('');
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: 'Confirm Your Order',
      text: `You are about to request a new ${newSiteType} website.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#2563eb', // blue-600
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Confirm Order',
      background: '#fff',
    });

    if (result.isConfirmed) {
      // Submission logic commented out as requested
      /*
      console.log('New website order submitted:', newSiteType);
      */

      Swal.fire({
        title: 'Order Received!',
        text: 'Our specialists will contact you at your registered email within 24 hours.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
        background: '#fff',
      });
    }
  };

  if (isLoading) {
    return (
      <div className='flex flex-col w-full h-full'>
        <DashboardHeader />
        <div className='flex-1 flex items-center justify-center'>
          <Spinner size='lg' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full h-full'>
      <DashboardHeader />

      <div className='flex-1 p-4 sm:p-6 md:p-8 w-full max-w-4xl mx-auto'>
        <div className='mb-10 text-center'>
          <div className='inline-flex items-center gap-2 bg-rose-500/10 px-4 py-2 rounded-full mb-4'>
            <Sparkles className='w-4 h-4 text-rose-500' />
            <span className='text-rose-600 font-semibold text-sm'>Teacup Services</span>
          </div>
          <h2 className='text-4xl font-bold text-foreground ubuntu-font mb-4'>
            {hasDomain ? 'Manage Your Website' : 'Get Started with Teacup'}
          </h2>
          <p className='text-muted-foreground text-lg'>
            {hasDomain 
              ? 'Need updates or improvements? Request an edit or order a new project.' 
              : 'Launch your professional online presence in minutes.'}
          </p>
        </div>

        <div className='space-y-6'>
          {/* Main Content Area */}
          {hasDomain && !showOrderForm ? (
            <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
              <DisplayCard className='bg-card border border-border/80 shadow-sm hover:shadow-xl transition-all p-8 rounded-3xl relative overflow-hidden'>
                <div className='flex items-center gap-4 mb-8'>
                  <div className='p-4 bg-rose-500 rounded-2xl shadow-lg shadow-rose-200'>
                    <Wrench className='text-white w-6 h-6' />
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-foreground'>Request Website Edits</h3>
                    <p className='text-sm text-muted-foreground'>Current site: <span className='text-rose-500 font-medium'>{company?.domain}</span></p>
                  </div>
                </div>

                <form onSubmit={handleEditSubmit} className='space-y-6'>
                  <div className='space-y-2'>
                    <label className='block text-sm font-semibold text-foreground/80 ml-1'>
                      What would you like us to change?
                    </label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder='Describe your changes in detail (e.g., "Add a new pricing table", "Change the contact email to hello@example.com", etc.)'
                      className='w-full min-h-[180px] p-5 rounded-2xl border border-border bg-muted/20 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all resize-none text-foreground placeholder:opacity-50'
                      required
                    />
                  </div>

                  <button
                    type='submit'
                    className='w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-rose-200 dark:shadow-none translate-y-0 active:translate-y-1'
                  >
                    <Send size={20} className='-rotate-45' />
                    Submit Request
                  </button>
                </form>

                <div className='mt-6 flex justify-center'>
                  <button 
                    onClick={() => setShowOrderForm(true)}
                    className='text-xs text-muted-foreground hover:text-rose-600 transition-colors font-medium flex items-center gap-1'
                  >
                    Don't have a website yet? Order here
                    <Sparkles size={10} />
                  </button>
                </div>
              </DisplayCard>
            </div>
          ) : (
            <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
              <DisplayCard className='bg-card border border-border/80 shadow-sm hover:shadow-xl transition-all p-8 rounded-3xl relative overflow-hidden'>
                
                {hasDomain && (
                  <button 
                    onClick={() => setShowOrderForm(false)}
                    className='mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
                  >
                    <ArrowLeft size={16} />
                    Back to Request Edits
                  </button>
                )}

                <div className='flex items-center gap-4 mb-8'>
                  <div className='p-4 bg-blue-500 rounded-2xl shadow-lg shadow-blue-200'>
                    <Globe className='text-white w-6 h-6' />
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-foreground'>Order New Website</h3>
                    <p className='text-sm text-muted-foreground'>Start a fresh digital presence</p>
                  </div>
                </div>

                <form onSubmit={handleOrderSubmit} className='space-y-8'>
                  <div className='space-y-3'>
                    <label className='block text-sm font-semibold text-foreground/80 ml-1'>
                      What kind of business are you running?
                    </label>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                      {['Business/Portfolio', 'E-commerce', 'Service/Booking', 'Blog/Content'].map((type) => (
                        <div 
                          key={type}
                          onClick={() => setNewSiteType(type)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                            newSiteType === type 
                              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm' 
                              : 'border-border hover:border-blue-200 hover:bg-muted/30'
                          }`}
                        >
                          <span className={`font-medium ${newSiteType === type ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`}>
                            {type}
                          </span>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            newSiteType === type ? 'border-blue-500 bg-blue-500' : 'border-border'
                          }`}>
                            {newSiteType === type && <div className='w-1.5 h-1.5 bg-white rounded-full' />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='p-5 bg-muted/30 rounded-2xl border border-dashed border-border'>
                    <h4 className='font-bold text-foreground text-sm flex items-center gap-2 mb-3'>
                      <Sparkles size={16} className='text-blue-500' />
                      Included in every plan:
                    </h4>
                    <ul className='grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-xs text-muted-foreground'>
                      <li className='flex items-center gap-2'>
                        <div className='w-1 h-1 bg-blue-500 rounded-full' />
                        Custom Design & Branding
                      </li>
                      <li className='flex items-center gap-2'>
                        <div className='w-1 h-1 bg-blue-500 rounded-full' />
                        Mobile-Responsive Layout
                      </li>
                      <li className='flex items-center gap-2'>
                        <div className='w-1 h-1 bg-blue-500 rounded-full' />
                        SEO Optimization
                      </li>
                      <li className='flex items-center gap-2'>
                        <div className='w-1 h-1 bg-blue-500 rounded-full' />
                        Dedicated Analytics Inbox
                      </li>
                    </ul>
                  </div>

                  <button
                    type='submit'
                    className='w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-200 dark:shadow-none translate-y-0 active:translate-y-1'
                  >
                    <Globe size={20} />
                    Submit Order Request
                  </button>
                </form>
              </DisplayCard>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
