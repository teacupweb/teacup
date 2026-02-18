'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Building2,
  Globe,
  Mail,
  ArrowRight,
  Sparkles,
  LogOut,
  Users,
} from 'lucide-react';
import {
  useCompany,
  type CompanyData,
  type CompanyType,
} from '@/backendProvider';
import Spinner from '@/Components/Spinner';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_BACKEND;

export default function Welcome() {
  const { user, updateUserCompanyInfo, logout } = useAuth();
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [referralProcessing, setReferralProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    owner: '',
  });

  // Move hook calls to the top level - only call useCompany if we have a valid referral company ID
  const referralLink = searchParams.get('referral');
  const referralCompanyId =
    referralLink && searchParams.get('company')
      ? Number(searchParams.get('company'))
      : null;
  const company = useCompany(
    referralCompanyId && !isNaN(referralCompanyId)
      ? referralCompanyId.toString()
      : null,
  );

  useEffect(() => {
    // Check if user is authenticated
    if (user === 'userNotFound') {
      navigate.push('/auth/login');
      return;
    }

    if (referralLink) {
      console.log('Processing referral link:', referralLink);
      setReferralProcessing(true);

      if (
        searchParams.get('company') &&
        searchParams.get('owner_email') &&
        searchParams.get('user')
      ) {
        // Check if company data is loaded and valid
        if (company?.data && !company.isLoading && !company.error) {
          console.log('Company found:', company.data);
          try {
            // Update user with the referred company
            const result = updateUserCompanyInfo(company.data);
            console.log('User updated with company:', result);
            toast.success('Successfully joined the company!');

            // Redirect to dashboard after successful referral
            setTimeout(() => {
              navigate.push('/dashboard');
            }, 1000);
          } catch (error) {
            console.error('Error updating user with company:', error);
            toast.error('Failed to join the company. Please try again.');
          }
        } else if (company?.error) {
          console.error('Error loading company:', company.error);
          toast.error('Invalid company referral link.');
        } else if (company?.isLoading) {
          // Still loading, wait for next render
          setReferralProcessing(false);
          return;
        } else {
          console.log('Company not found');
          toast.error('Company not found.');
        }
      } else {
        console.log('Invalid referral parameters');
        toast.error('Invalid referral link.');
      }
      setReferralProcessing(false);
    }
    // Check if user has company_id stored in localStorage (Better Auth)
    if (user && typeof user !== 'string') {
      const companyInfo = localStorage.getItem('companyInfo');
      const companyId = companyInfo
        ? JSON.parse(companyInfo)?.company_id
        : null;
      if (companyId) {
        // User already has a company, redirect to dashboard
        navigate.push('/dashboard');
      } else {
        // User needs to create a company
        setLoading(false);
        // Pre-fill owner email with user's email
        setFormData((prev) => ({
          ...prev,
          owner: user.email || '',
        }));
      }
    }
    // Check for referral link in query parameters
  }, [
    user,
    navigate,
    searchParams,
    referralLink,
    company,
    updateUserCompanyInfo,
    referralProcessing,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const newCompany: CompanyType = {
        name: formData.name,
        domain: formData.domain,
        owner: formData.owner,
        // Default activity data - all zeros for new company
        activity_data: [
          { day: 'Mon', visits: 0 },
          { day: 'Tue', visits: 0 },
          { day: 'Wed', visits: 0 },
          { day: 'Thu', visits: 0 },
          { day: 'Fri', visits: 0 },
          { day: 'Sat', visits: 0 },
          { day: 'Sun', visits: 0 },
        ],
        // Default info cards - starting metrics for new company
        info: [
          {
            icon: 'globe',
            title: 'Active Sites',
            data: 0,
            description: "Total number of websites you're managing.",
          },
          {
            icon: 'mail',
            title: 'Form Submissions',
            data: 0,
            description: 'Total form submissions this month.',
          },
          {
            icon: 'users',
            title: 'Team Members',
            data: 1, // Owner is the first member
            description: 'Active collaborators in your workspace.',
          },
          {
            icon: 'file-text',
            title: 'Total Pages',
            data: 0,
            description: 'Pages created across all your websites.',
          },
        ],
        // Default sharing - owner is the first member
        sharing: [
          {
            name:
              user && typeof user !== 'string' ? user.name || 'Owner' : 'Owner',
            email: formData.owner,
            status: 'Owner',
          },
        ],
        key: '', // key to be generated later in the backend
      };

      // Manually create company using fetch
      const response = await fetch(`${API_URL}/dashboard/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCompany),
      });

      if (!response.ok) {
        throw new Error(`Failed to create company: ${response.statusText}`);
      }

      const createdCompany = await response.json();
      // console.log('Company created:', createdCompany);

      // Update user metadata with company_id
      await updateUserCompanyInfo(createdCompany);

      // Wait a moment for state to update before navigating
      setTimeout(() => {
        navigate.push('/dashboard');
      }, 300);
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error(
        error instanceof Error
          ? `Failed to create company: ${error.message}`
          : 'Failed to create company. Please try again.',
      );
      setCreating(false);
    }
  };

  if (loading || referralProcessing) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center transition-colors'>
        <div className='text-center'>
          <Spinner size='lg' />
          <p className='mt-4 text-muted-foreground'>
            {referralProcessing ? 'Processing referral...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors'>
      {/* Animated background blobs */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
        <div
          className='absolute -bottom-40 -left-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      <div className='w-full max-w-2xl relative'>
        {/* Welcome Header */}
        <div className='text-center mb-8 animate-fade-in'>
          <div className='inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-border mb-6'>
            <Sparkles className='w-5 h-5 text-rose-500' />
            <span className='text-rose-600 font-semibold'>
              Welcome to Teacup
            </span>
          </div>
          <h1 className='text-5xl font-bold text-foreground mb-4 ubuntu-font'>
            Let's Create Your Company
          </h1>
          <p className='text-xl text-muted-foreground font-medium'>
            Set up your company profile to get started with your dashboard
          </p>
        </div>

        {/* Company Creation Form */}
        <div className='bg-card rounded-3xl shadow-2xl overflow-hidden border border-border backdrop-blur-sm bg-opacity-95 animate-slide-up'>
          <div className='bg-gradient-to-r from-rose-500 to-rose-600 p-8 text-white'>
            <h2 className='text-3xl font-bold mb-2'>Company Information</h2>
            <p className='text-rose-100'>
              Tell us about your company to personalize your experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className='p-8 space-y-6'>
            {/* Company Name */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground/80 flex items-center gap-2'>
                <Building2 className='w-4 h-4 text-rose-500' />
                Company Name
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 rounded-xl border-2 border-border bg-muted/30 text-foreground focus:border-rose-500 focus:outline-none transition-colors'
                placeholder='Acme Corporation'
              />
            </div>

            {/* Domain */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground/80 flex items-center gap-2'>
                <Globe className='w-4 h-4 text-rose-500' />
                Company Domain{' '}
                <span className='text-xs text-muted-foreground'>
                  None if you don't have one
                </span>
              </label>
              <input
                type='text'
                name='domain'
                value={formData.domain}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 rounded-xl border-2 border-border bg-muted/30 text-foreground focus:border-rose-500 focus:outline-none transition-colors'
                placeholder='acme.com'
              />
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={creating}
              className='w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-xl font-semibold hover:from-rose-600 hover:to-rose-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {creating ? (
                <>
                  <Spinner size='sm' className='mr-2' />
                  <span>Creating Company...</span>
                </>
              ) : (
                <>
                  <span>Create Company & Continue</span>
                  <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </>
              )}
            </button>

            {/* Referral Info */}
            <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3'>
              <Users className='w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-muted-foreground'>
                <span className='font-semibold text-blue-500'>
                  Already part of a company?
                </span>{' '}
                Ask a team member for a referral link to join their existing
                company instead of creating a new one.
              </p>
            </div>

            {/* Info Note */}
            <div className='bg-rose-500/10 border border-rose-500/30 rounded-xl p-4'>
              <p className='text-sm text-muted-foreground'>
                <span className='font-semibold text-rose-500'>Note:</span> You
                can update your company information later in the settings.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between mt-6'>
          <p className='text-sm text-muted-foreground'>
            Need help?{' '}
            <button className='text-rose-500 hover:text-rose-600 font-medium transition-colors'>
              Contact Support
            </button>
          </p>
          <button
            onClick={() => {
              logout();
              navigate.push('/auth/login');
            }}
            className='text-sm text-muted-foreground hover:text-rose-500 font-medium flex items-center gap-1 transition-colors'
          >
            <LogOut className='w-4 h-4' />
            <span>Wrong account? Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
