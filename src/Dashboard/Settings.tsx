import { useAuth } from '@/AuthProvider';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/backendProvider';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Spinner from '@/Components/Spinner';
import Modal from '@/Components/Modal';
import supabase from '@/supabaseClient';
import { useTheme } from '@/ThemeProvider';

function Settings() {
  const { logout, user } = useAuth();
  const navigate = useRouter();
  const companyId =
    user && typeof user !== 'string' ? user.user_metadata?.company_id : null;
  const ownerEmail =
    user && typeof user !== 'string' ? user.user_metadata?.owner_email : null;
  const { data: company, isLoading: loading } = useCompany(companyId);
  const companySecret = company?.key || 'No company secret found';

  // State for toggles
  const [emailNotifications, setEmailNotifications] = useState(true);
  // const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const { theme, setTheme } = useTheme();

  // State for modals
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInviteLinkModalOpen, setIsInviteLinkModalOpen] = useState(false);
  const [isManualCompanyModalOpen, setIsManualCompanyModalOpen] =
    useState(false);

  // State for forms
  const [inviteEmail, setInviteEmail] = useState('');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');
  const [manualCompanyId, setManualCompanyId] = useState('');
  const [manualOwnerEmail, setManualOwnerEmail] = useState('');

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
        toast.success('You have been successfully logged out.');
        navigate.push('/login');
      }
    });
  };

  const handleInviteClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    // Open the invite modal with the email
    setIsInviteModalOpen(true);
  };

  const handleGenerateInviteLink = () => {
    // Generate the invite link
    const link = `https://teacupnet.netlify.app/welcome?company=${companyId}&owner_email=${ownerEmail}&user=${inviteEmail}`;
    setGeneratedInviteLink(link);

    // Close invite modal and open link modal
    setIsInviteModalOpen(false);
    setIsInviteLinkModalOpen(true);
    setInviteEmail('');
  };

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedInviteLink);
      toast.success('Invite link copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleEditProfile = () => {
    const userName =
      user && typeof user !== 'string' ? user.user_metadata?.name || '' : '';
    const userEmail = user && typeof user !== 'string' ? user.email || '' : '';

    setEditName(userName);
    setEditEmail(userEmail);
    setIsEditProfileModalOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: editEmail,
        data: { name: editName },
      });

      if (error) throw error;

      toast.success('Profile updated successfully');
      setIsEditProfileModalOpen(false);

      // Refresh the page to show updated data
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleLeaveCompany = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be removed from this company and lose access to its data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, leave company!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Remove company_id and owner_email from user metadata
          const { error } = await supabase.auth.updateUser({
            data: {
              company_id: null,
              owner_email: null,
            },
          });

          if (error) throw error;

          toast.success('You have successfully left the company.');
          // Redirect to welcome page
          setTimeout(() => {
            window.location.href = '/welcome';
          }, 1500);
        } catch (error: any) {
          toast.error(error.message || 'Failed to leave company');
        }
      }
    });
  };

  const handleSetManualCompany = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          company_id: manualCompanyId,
          owner_email: manualOwnerEmail,
        },
      });

      if (error) throw error;

      toast.success('Company information has been set manually');
      setIsManualCompanyModalOpen(false);
      setManualCompanyId('');
      setManualOwnerEmail('');

      // Refresh the page to show updated data
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to set company information');
    }
  };

  const handleOpenManualCompanyModal = () => {
    setManualCompanyId(companyId || '');
    setManualOwnerEmail(ownerEmail || '');
    setIsManualCompanyModalOpen(true);
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
        <h2 className='font-bold ubuntu-font text-3xl text-foreground mb-2'>
          Settings
        </h2>
        <p className='text-muted-foreground'>
          Manage your account preferences and system settings.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Account Section */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-card p-6 rounded-2xl border border-border shadow-sm'>
            <h3 className='font-bold text-xl text-foreground mb-4 pb-2 border-b border-border/50'>
              Account Settings
            </h3>
            <div className='space-y-4'>
              {[
                {
                  text: 'Email Notifications',
                  description: 'Receive email updates and alerts',
                  disabled: false,
                  checked: emailNotifications,
                  onchange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmailNotifications(e.target.checked);
                  },
                },
              ].map((setting, index) => (
                <div key={index}>
                  <div className='flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors group cursor-default'>
                    <div>
                      <h4 className='font-medium text-foreground/90 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors'>
                        {setting.text}
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        {setting.description}
                      </p>
                    </div>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        onChange={setting.onchange}
                        checked={setting.checked}
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                    </label>
                  </div>
                </div>
              ))}
              <div>
                <div className='flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors group cursor-default'>
                  <div>
                    <h4 className='font-medium text-foreground/90 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors'>
                      Company Secret
                    </h4>
                    <p className='text-sm text-muted-foreground'>
                      Company secret is for your website integration and API
                      access
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(companySecret);
                      toast.success('Copied to clipboard');
                    }}
                    className='text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer btn-xs p-5 py-1'
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-card p-6 rounded-2xl border border-border shadow-sm relative overflow-hidden group'>
            {/* Coming Soon Overlay */}
            <div className='absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'>
              <div className='bg-card/90 border border-border px-4 py-2 rounded-xl shadow-xl transform -rotate-12 scale-110'>
                <span className='text-rose-600 font-bold uppercase tracking-widest text-sm'>
                  Coming Soon
                </span>
              </div>
            </div>

            <div className='absolute inset-0 z-10 flex items-center justify-center pointer-events-none'>
              <div className='px-3 py-1 bg-muted/80 backdrop-blur-sm border border-border rounded-lg opacity-100 group-hover:opacity-0 transition-opacity duration-300'>
                <span className='text-[10px] font-bold uppercase tracking-tighter text-muted-foreground'>
                  Limited Preview
                </span>
              </div>
            </div>

            <div className='relative z-0 opacity-40 pointer-events-none grayscale-[50%] transition-all duration-500 group-hover:blur-[1px]'>
              <h3 className='font-bold text-xl text-foreground mb-4 pb-2 border-b border-border/50'>
                Team Management
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-foreground/80 mb-1'>
                    Invite Team Member
                  </label>
                  <form onSubmit={handleInviteClick} className='flex gap-2'>
                    <input
                      disabled
                      type='email'
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder='colleague@example.com'
                      className='flex-1 px-4 py-2 border border-border bg-card rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-foreground'
                    />
                    <button
                      disabled
                      type='submit'
                      className='bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors font-medium opacity-50'
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
                          className='flex items-center justify-between bg-muted/50 p-3 rounded-lg'
                          key={member.email + index}
                        >
                          <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-xs font-bold'>
                              {member.name
                                .split(' ')
                                .map((word: string) =>
                                  word.charAt(0).toUpperCase()
                                )
                                .join('')
                                .slice(0, 2)}
                            </div>
                            <div>
                              <p className='text-sm font-medium text-foreground/90'>
                                {member.name}
                              </p>
                              <p className='text-xs text-muted-foreground'>
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
                    <p className='text-sm text-muted-foreground text-center py-4'>
                      No team members yet. Invite someone to get started!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='bg-card p-6 rounded-2xl border border-border shadow-sm'>
            <h3 className='font-bold text-xl text-foreground mb-4 pb-2 border-b border-border/50'>
              Appearance
            </h3>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors group cursor-default'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <h4 className='font-medium text-foreground/90 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors'>
                      Dark Mode
                    </h4>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Switch between light and dark themes
                  </p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    type='checkbox'
                    className='sr-only peer'
                    checked={theme === 'dark'}
                    onChange={(e) => {
                      setTheme(e.target.checked ? 'dark' : 'light');
                    }}
                  />
                  <div className="w-11 h-6 bg-muted dark:bg-muted/80 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          <div className='bg-card p-6 rounded-2xl border border-border shadow-sm'>
            <h3 className='font-bold text-xl text-foreground mb-4'>Profile</h3>
            <div className='flex flex-col items-center text-center'>
              <div className='w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-2xl mb-3'>
                {userInitials}
              </div>
              <h4 className='font-bold text-lg text-foreground'>{userName}</h4>
              <p className='text-muted-foreground text-sm mb-1'>{userEmail}</p>
              <p className='text-muted-foreground/60 text-xs mb-4'>
                {company?.sharing?.[0]?.status || 'Member'}
              </p>
              <div className='w-full space-y-2'>
                <button
                  onClick={handleEditProfile}
                  className='w-full py-2 px-4 border border-border rounded-xl text-foreground/70 hover:bg-muted hover:text-foreground transition-all font-medium'
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className='w-full py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-sm hover:shadow-md'
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className='bg-card p-6 rounded-2xl border border-border shadow-sm'>
            <h3 className='font-bold text-lg text-foreground mb-2'>
              Company Information
            </h3>
            <p className='text-xs text-muted-foreground mb-3'>
              Your company identifier and owner
            </p>
            <div className='space-y-2 mb-3'>
              <div>
                <p className='text-xs font-medium text-muted-foreground mb-1'>
                  Company ID
                </p>
                <div className='bg-muted/50 p-2 rounded-lg border border-border'>
                  <code className='text-xs text-foreground/80 font-mono break-all'>
                    {companyId || 'No company ID'}
                  </code>
                </div>
              </div>
              <div>
                <p className='text-xs font-medium text-muted-foreground mb-1'>
                  Owner Email
                </p>
                <div className='bg-muted/50 p-2 rounded-lg border border-border'>
                  <code className='text-xs text-foreground/80 font-mono break-all'>
                    {ownerEmail || 'Owner email not found'}
                  </code>
                </div>
              </div>
            </div>
            <button
              onClick={handleOpenManualCompanyModal}
              className='w-full py-2 px-4 border border-amber-500/30 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors font-medium text-sm'
            >
              ⚠️ Set Manually
            </button>
          </div>

          {companyId && (
            <div className='bg-orange-500/10 p-6 rounded-2xl border border-orange-500/30'>
              <h3 className='font-bold text-xl text-orange-600 dark:text-orange-400 mb-2'>
                Leave Company
              </h3>
              <p className='text-orange-600/80 dark:text-orange-400/80 text-sm mb-4'>
                Remove yourself from this company. You will lose access to all
                company data.
              </p>
              <button
                onClick={handleLeaveCompany}
                className='w-full py-2 px-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium shadow-sm hover:shadow-md'
              >
                Leave Company
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
      >
        <div className='p-6'>
          <h3 className='font-bold text-2xl text-foreground mb-2'>
            Edit Profile
          </h3>
          <p className='text-muted-foreground text-sm mb-6'>
            Update your profile information
          </p>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-foreground/80 mb-1'>
                Name
              </label>
              <input
                type='text'
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder='Your name'
                className='w-full px-4 py-2 border border-border bg-card rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-foreground'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-foreground/80 mb-1'>
                Email
              </label>
              <input
                type='email'
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder='your.email@example.com'
                className='w-full px-4 py-2 border border-border bg-card rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-foreground'
              />
            </div>
          </div>

          <div className='flex gap-3 mt-6'>
            <button
              onClick={() => setIsEditProfileModalOpen(false)}
              className='flex-1 py-2 px-4 border border-border rounded-xl text-foreground/70 hover:bg-muted hover:text-foreground transition-all font-medium'
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className='flex-1 py-2 px-4 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-medium'
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Invite Confirmation Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      >
        <div className='p-6'>
          <h3 className='font-bold text-2xl text-foreground mb-2'>
            Send Invitation
          </h3>
          <p className='text-muted-foreground text-sm mb-6'>
            Generate an invite link for{' '}
            <span className='font-semibold text-foreground'>{inviteEmail}</span>
          </p>

          <div className='flex gap-3'>
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className='flex-1 py-2 px-4 border border-border rounded-xl text-foreground/70 hover:bg-muted hover:text-foreground transition-all font-medium'
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateInviteLink}
              className='flex-1 py-2 px-4 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-medium'
            >
              Generate Link
            </button>
          </div>
        </div>
      </Modal>

      {/* Invite Link Modal */}
      <Modal
        isOpen={isInviteLinkModalOpen}
        onClose={() => setIsInviteLinkModalOpen(false)}
      >
        <div className='p-6'>
          <h3 className='font-bold text-2xl text-foreground mb-2'>
            Invitation Link
          </h3>
          <p className='text-muted-foreground text-sm mb-6'>
            Share this link with your team member to join the company
          </p>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-foreground/80 mb-1'>
                Invite Link
              </label>
              <input
                type='text'
                value={generatedInviteLink}
                readOnly
                className='w-full px-4 py-2 border border-border rounded-xl bg-muted/50 text-foreground text-sm font-mono'
              />
            </div>
          </div>

          <div className='flex gap-3 mt-6'>
            <button
              onClick={() => setIsInviteLinkModalOpen(false)}
              className='flex-1 py-2 px-4 border border-border rounded-xl text-foreground/70 hover:bg-muted hover:text-foreground transition-all font-medium'
            >
              Close
            </button>
            <button
              onClick={handleCopyInviteLink}
              className='flex-1 py-2 px-4 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-medium flex items-center justify-center gap-2'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
              Copy Link
            </button>
          </div>
        </div>
      </Modal>

      {/* Manual Company Configuration Modal */}
      <Modal
        isOpen={isManualCompanyModalOpen}
        onClose={() => setIsManualCompanyModalOpen(false)}
      >
        <div className='p-6'>
          <h3 className='font-bold text-2xl text-foreground mb-2'>
            ⚠️ Manual Company Configuration
          </h3>

          {/* Warning Alert */}
          <div className='bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded'>
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-red-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h4 className='text-sm font-bold text-red-800 mb-1'>
                  Danger: Advanced Users Only
                </h4>
                <p className='text-xs text-red-700'>
                  Manually setting company information can cause serious
                  malfunctions if not done properly. Only proceed if you know
                  the exact Company ID and Owner Email you need to set.
                  Incorrect values may break your access to company data or
                  cause authentication issues.
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-foreground/80 mb-1'>
                Company ID
              </label>
              <input
                type='text'
                value={manualCompanyId}
                onChange={(e) => setManualCompanyId(e.target.value)}
                placeholder='Enter company ID'
                className='w-full px-4 py-2 border border-border bg-card rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono text-sm text-foreground'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-foreground/80 mb-1'>
                Owner Email
              </label>
              <input
                type='email'
                value={manualOwnerEmail}
                onChange={(e) => setManualOwnerEmail(e.target.value)}
                placeholder='owner@example.com'
                className='w-full px-4 py-2 border border-border bg-card rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-foreground'
              />
            </div>
          </div>

          <div className='bg-amber-50 border border-amber-200 p-3 rounded-lg mt-4'>
            <p className='text-xs text-amber-800'>
              <strong>Note:</strong> After setting these values manually, the
              page will reload. Make sure you have valid credentials before
              proceeding.
            </p>
          </div>

          <div className='flex gap-3 mt-6'>
            <button
              onClick={() => setIsManualCompanyModalOpen(false)}
              className='flex-1 py-2 px-4 border border-border rounded-xl text-foreground/70 hover:bg-muted hover:text-foreground transition-all font-medium'
            >
              Cancel
            </button>
            <button
              onClick={handleSetManualCompany}
              className='flex-1 py-2 px-4 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium'
            >
              Set Company Info
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Settings;
