import { useEffect, useState } from 'react';
import { useAuth } from '@/AuthProvider';
import { useNavigate, useSearchParams } from 'react-router';
import { Building2, Globe, Mail, ArrowRight, Sparkles, LogOut, Users } from 'lucide-react';
import { createUserCompany, type CompanyType } from '@/backendProvider';
import Spinner from '@/Components/Spinner';
import supabase from '@/supabaseClient';

export default function Welcome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    owner: '',
  });

  useEffect(() => {
    // Check if user is authenticated
    if (user === 'userNotFound') {
      navigate('/login');
      return;
    }

    // Check for referral link in query parameters
    const referralLink = searchParams.get('referral');
    if (referralLink) {
      console.log('Referral link detected:', referralLink);
      // TODO: Handle referral link logic here
      // This could be used to add user to an existing company
    }

    // Check if user has company_id in metadata
    if (user && typeof user !== 'string') {
      const companyId = user.user_metadata?.company_id;
      if (companyId) {
        // User already has a company, redirect to dashboard
        navigate('/Dashboard');
      } else {
        // User needs to create a company
        setLoading(false);
        // Pre-fill owner email with user's email
        setFormData(prev => ({
          ...prev,
          owner: user.email || '',
        }));
      }
    }
  }, [user, navigate, searchParams]);

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
        activityData: [
          { day: 'Mon', visits: 0 },
          { day: 'Tue', visits: 0 },
          { day: 'Wed', visits: 0 },
          { day: 'Thu', visits: 0 },
          { day: 'Fri', visits: 0 },
          { day: 'Sat', visits: 0 },
          { day: 'Sun', visits: 0 },
        ],
        info: [],
        sharing: [],
      };

      // TODO: This will call the commented Supabase logic
      await createUserCompany(newCompany);

      // Update user metadata with owner_email
      await supabase.auth.updateUser({
        data: {
          owner_email: formData.owner,
        },
      });

      // After successful creation, redirect to dashboard
      // Note: The createCompany function should update user metadata with company_id
      setTimeout(() => {
        navigate('/Dashboard');
      }, 500);
    } catch (error) {
      console.error('Error creating company:', error);
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center p-4 relative overflow-hidden'>
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
          <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-6'>
            <Sparkles className='w-5 h-5 text-rose-500' />
            <span className='text-rose-600 font-semibold'>Welcome to Teacupnet</span>
          </div>
          <h1 className='text-5xl font-bold text-gray-800 mb-4 ubuntu-font'>
            Let's Create Your Company
          </h1>
          <p className='text-xl text-gray-600'>
            Set up your company profile to get started with your dashboard
          </p>
        </div>

        {/* Company Creation Form */}
        <div className='bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95 animate-slide-up'>
          <div className='bg-gradient-to-r from-rose-500 to-rose-600 p-8 text-white'>
            <h2 className='text-3xl font-bold mb-2'>Company Information</h2>
            <p className='text-rose-100'>
              Tell us about your company to personalize your experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className='p-8 space-y-6'>
            {/* Company Name */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                <Building2 className='w-4 h-4 text-rose-500' />
                Company Name
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-colors'
                placeholder='Acme Corporation'
              />
            </div>

            {/* Domain */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                <Globe className='w-4 h-4 text-rose-500' />
                Company Domain
              </label>
              <input
                type='text'
                name='domain'
                value={formData.domain}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-colors'
                placeholder='acme.com'
              />
            </div>

            {/* Owner Email */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                <Mail className='w-4 h-4 text-rose-500' />
                Owner Email
              </label>
              <input
                type='email'
                name='owner'
                value={formData.owner}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-colors bg-gray-50'
                placeholder='owner@acme.com'
                readOnly
              />
              <p className='text-xs text-gray-500'>
                This is automatically set to your account email
              </p>
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
            <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3'>
              <Users className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-gray-600'>
                <span className='font-semibold text-blue-600'>
                  Already part of a company?
                </span>{' '}
                Ask a team member for a referral link to join their existing
                company instead of creating a new one.
              </p>
            </div>

            {/* Info Note */}
            <div className='bg-rose-50 border border-rose-200 rounded-xl p-4'>
              <p className='text-sm text-gray-600'>
                <span className='font-semibold text-rose-600'>Note:</span> You
                can update your company information later in the settings.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between mt-6'>
          <p className='text-sm text-gray-600'>
            Need help?{' '}
            <button className='text-rose-500 hover:text-rose-600 font-medium'>
              Contact Support
            </button>
          </p>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className='text-sm text-gray-600 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors'
          >
            <LogOut className='w-4 h-4' />
            <span>Wrong account? Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
