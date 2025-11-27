import { useAuth } from '@/AuthProvider';
import { useNavigate } from 'react-router';
import { useCompany } from '@/backendProvider';
import Swal from 'sweetalert2';
import { useState } from 'react';
import Spinner from '@/Components/Spinner';

function Settings() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const companyId =
    user && typeof user !== 'string' ? user.user_metadata?.company_id : null;
  const { data: company, isLoading: loading } = useCompany(companyId);

  // State for toggles
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // State for invite form
  const [inviteEmail, setInviteEmail] = useState('');

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You'll need to login again to access your dashboard!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: 'Logged out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate('/login');
        });
      }
    });
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Invite clicked for email:', inviteEmail);
    // TODO: Implement actual invite logic
    Swal.fire({
      title: 'Invitation Sent!',
      text: `An invitation has been sent to ${inviteEmail}`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
    setInviteEmail('');
  };

  const handleEditProfile = () => {
    console.log('Edit Profile clicked');
    Swal.fire({
      title: 'Coming Soon!',
      text: 'Profile editing will be available soon.',
      icon: 'info',
    });
  };

  // Get user info
  const userName =
    user && typeof user !== 'string'
      ? user.user_metadata?.name || 'User'
      : 'User';
  const userEmail = user && typeof user !== 'string' ? user.email || '' : '';
  const userInitials = userName
    .split(' ')
    .map((word: any) => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  if (loading) {
    return (
      <div className='flex flex-col w-full h-full p-6'>
        <div className='flex-1 flex items-center justify-center'>
          <Spinner size='lg' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full h-full p-6'>
      <div className='mb-8'>
        <h2 className='font-bold ubuntu-font text-3xl text-slate-800 mb-2'>
          Settings
        </h2>
        <p className='text-slate-500'>
          Manage your account preferences and system settings.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Account Section */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm'>
            <h3 className='font-bold text-xl text-slate-800 mb-4 pb-2 border-b border-slate-50'>
              Account Settings
            </h3>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors'>
                <div>
                  <h4 className='font-medium text-slate-700'>
                    Email Notifications
                  </h4>
                  <p className='text-sm text-slate-500'>
                    Receive daily summaries
                  </p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    type='checkbox'
                    className='sr-only peer'
                    checked={emailNotifications}
                    onChange={(e) => {
                      setEmailNotifications(e.target.checked);
                      console.log('Email Notifications:', e.target.checked);
                    }}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>
              <div className='flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors'>
                <div>
                  <h4 className='font-medium text-slate-700'>
                    Two-Factor Authentication
                  </h4>
                  <p className='text-sm text-slate-500'>
                    Add an extra layer of security
                  </p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    type='checkbox'
                    className='sr-only peer'
                    checked={twoFactorAuth}
                    onChange={(e) => {
                      setTwoFactorAuth(e.target.checked);
                      console.log('Two-Factor Auth:', e.target.checked);
                    }}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm'>
            <h3 className='font-bold text-xl text-slate-800 mb-4 pb-2 border-b border-slate-50'>
              Team Management
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1'>
                  Invite Team Member
                </label>
                <form onSubmit={handleInviteSubmit} className='flex gap-2'>
                  <input
                    required
                    type='email'
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder='colleague@example.com'
                    className='flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all'
                  />
                  <button
                    type='submit'
                    className='bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-900 transition-colors font-medium'
                  >
                    Invite
                  </button>
                </form>
              </div>
              <div className='pt-2'>
                <h4 className='text-xs font-semibold text-rose-500 uppercase tracking-wider mb-3'>
                  Members ({company?.sharing?.length || 0})
                </h4>
                {company?.sharing && company.sharing.length > 0 ? (
                  <div className='space-y-3'>
                    {company.sharing.map((member: any, index: number) => (
                      <div
                        className='flex items-center justify-between bg-slate-50 p-3 rounded-lg'
                        key={member.email + index}
                      >
                        <div className='flex items-center gap-3'>
                          <div className='w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-xs font-bold'>
                            {member.name
                              .split(' ')
                              .map((word: string) => word.charAt(0).toUpperCase())
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className='text-sm font-medium text-slate-700'>
                              {member.name}
                            </p>
                            <p className='text-xs text-slate-500'>
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            member.status === 'Owner'
                              ? 'bg-rose-100 text-rose-600'
                              : member.status === 'Member'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-orange-100 text-orange-600'
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-slate-500 text-center py-4'>
                    No team members yet. Invite someone to get started!
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm'>
            <h3 className='font-bold text-xl text-slate-800 mb-4 pb-2 border-b border-slate-50'>
              Appearance
            </h3>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors'>
                <div>
                  <h4 className='font-medium text-slate-700'>Dark Mode</h4>
                  <p className='text-sm text-slate-500'>
                    Switch between light and dark themes
                  </p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    type='checkbox'
                    className='sr-only peer'
                    checked={darkMode}
                    onChange={(e) => {
                      setDarkMode(e.target.checked);
                      console.log('Dark Mode:', e.target.checked);
                    }}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Danger Zone */}
        <div className='space-y-6'>
          <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm'>
            <h3 className='font-bold text-xl text-slate-800 mb-4'>Profile</h3>
            <div className='flex flex-col items-center text-center'>
              <div className='w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-2xl mb-3'>
                {userInitials}
              </div>
              <h4 className='font-bold text-lg text-slate-800'>{userName}</h4>
              <p className='text-slate-500 text-sm mb-1'>{userEmail}</p>
              <p className='text-slate-400 text-xs mb-4'>
                {company?.sharing?.[0]?.status || 'Member'}
              </p>
              <button
                onClick={handleEditProfile}
                className='w-full py-2 px-4 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-medium'
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm'>
            <h3 className='font-bold text-lg text-slate-800 mb-2'>
              Company ID
            </h3>
            <p className='text-xs text-slate-500 mb-3'>
              Your unique company identifier
            </p>
            <div className='bg-slate-50 p-3 rounded-lg border border-slate-200'>
              <code className='text-xs text-slate-700 font-mono break-all'>
                {companyId || 'No company ID'}
              </code>
            </div>
          </div>

          <div className='bg-red-50 p-6 rounded-2xl border border-red-100'>
            <h3 className='font-bold text-xl text-red-800 mb-2'>Danger Zone</h3>
            <p className='text-red-600/80 text-sm mb-4'>
              Once you logout, you will need to enter your credentials to access
              the dashboard again.
            </p>
            <button
              onClick={handleLogout}
              className='w-full py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-sm hover:shadow-md'
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
