import { useAuth } from '@/AuthProvider';
import { useRouter } from 'next/navigation';
import { useCompany, useCompanyUsers, useRemoveUser, useChangeUserRole, type SharingUser } from '@/backendProvider';
import { authClient } from '@/lib/auth-client';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useState } from 'react';
import Spinner from '@/Components/Spinner';
import Modal from '@/Components/Modal';
import { useTheme } from 'next-themes';
import type { User } from '@/types/schema';

function Settings() {
  const { logout, user, updateUserCompanyInfo } = useAuth();
  const navigate = useRouter();

  // Derive user info directly from Better Auth user object
  const companyId = user.companyId;
  console.log(user);
  const { data: company, isLoading: loading } = useCompany(companyId);
  const { data: companyUsers, isLoading: usersLoading, refetch: refetchUsers } = useCompanyUsers(companyId);
  const { mutateAsync: removeUser, isLoading: removingUser } = useRemoveUser();
  const { mutateAsync: changeUserRole, isLoading: changingRole } = useChangeUserRole();
  
  const companySecret = company?.key || 'No company secret found';
  
  // Check if current user is admin
  const currentUserRole = companyUsers?.find(u => u.id === user.id)?.role || 'user';
  const isAdmin = currentUserRole === 'admin';

  // State for toggles
  const [emailNotifications, setEmailNotifications] = useState(true);
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
  const [editImage, setEditImage] = useState('');
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');
  const [manualCompanyId, setManualCompanyId] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingCompany, setIsUpdatingCompany] = useState(false);

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
        navigate.push('/auth/login');
      }
    });
  };

  const handleInviteClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setIsInviteModalOpen(true);
  };

  const handleGenerateInviteLink = () => {
    const link = `${window.location.origin}/welcome?company=${companyId}&user=${inviteEmail}&referral=true`;
    setGeneratedInviteLink(link);
    setIsInviteModalOpen(false);
    setIsInviteLinkModalOpen(true);
    setInviteEmail('');
  };

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedInviteLink);
      toast.success('Invite link copied to clipboard');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleEditProfile = () => {
    const name = user.name;
    const image = user.image || '';
    setEditName(name);
    setEditImage(image);
    setIsEditProfileModalOpen(true);
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await authClient.updateUser({ name: editName, image: editImage });
      toast.success('Profile updated successfully');
      setIsEditProfileModalOpen(false);
      // Better-Auth automatically updates the session, no need for manual reload
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLeaveCompany = async () => {
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
        setIsUpdatingCompany(true);
        try {
          await updateUserCompanyInfo({
            id: '',
            name: '',
            ownerId: user.id,
            createdAt: new Date(),
            domain: '',
            key: '',
          });
          toast.success('You have successfully left company.');
          setTimeout(() => {
            window.location.href = '/welcome';
          }, 1500);
        } catch (error: any) {
          toast.error(error.message || 'Failed to leave company');
        } finally {
          setIsUpdatingCompany(false);
        }
      }
    });
  };

  const handleSetManualCompany = async () => {
    if (!manualCompanyId.trim()) {
      toast.error('Please enter a valid Company ID');
      return;
    }
    setIsUpdatingCompany(true);
    try {
      await updateUserCompanyInfo({
        id: manualCompanyId,
        name: '',
        ownerId: user.id,
        createdAt: new Date(),
        domain: '',
        key: '',
      });
      toast.success('Company information has been set manually');
      setIsManualCompanyModalOpen(false);
      setManualCompanyId('');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to set company information');
    } finally {
      setIsUpdatingCompany(false);
    }
  };

  const handleOpenManualCompanyModal = () => {
    setManualCompanyId(companyId || '');
    setIsManualCompanyModalOpen(true);
  };

  const handleRemoveUser = async (userId: string, userEmail: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Remove ${userEmail} from the company?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await removeUser({ companyId: companyId!, userId });
          toast.success('User removed successfully');
          refetchUsers();
        } catch (error: any) {
          toast.error(error.message || 'Failed to remove user');
        }
      }
    });
  };

  const handleChangeRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await changeUserRole({ companyId: companyId!, userId, role: newRole });
      toast.success(`User role changed to ${newRole}`);
      refetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to change user role');
    }
  };

  // Get user info from Better Auth session
  const userName = user.name;
  const userEmail = user.email;
  const userInitials = userName
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  if (loading || usersLoading) {
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
            <div className='relative z-0'>
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
                      type='email'
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder='colleague@example.com'
                      className='flex-1 px-4 py-2 border border-border bg-card rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-foreground'
                    />
                    <button
                      type='submit'
                      className='bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors font-medium '
                    >
                      Invite
                    </button>
                  </form>
                </div>
                <div className='pt-2'>
                  <h4 className='text-xs font-semibold text-rose-500 uppercase tracking-wider mb-3'>
                    Members ({companyUsers?.length || 0})
                  </h4>
                  {companyUsers && companyUsers.length > 0 ? (
                    <div className='space-y-3'>
                      {companyUsers.map((member: SharingUser, index: number) => (
                        <div
                          className='flex items-center justify-between bg-muted/50 p-3 rounded-lg'
                          key={member.id + index}
                        >
                          <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-xs font-bold'>
                              {member.email
                                .split(' ')
                                .map((word: string) =>
                                  word.charAt(0).toUpperCase(),
                                )
                                .join('')
                                .slice(0, 2)}
                            </div>
                            <div>
                              <p className='text-sm font-medium text-foreground/90'>
                                {member.email}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                {member.role}
                              </p>
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                member.role === 'admin'
                                  ? 'bg-rose-100 text-rose-600'
                                  : 'bg-blue-100 text-blue-600'
                              }`}
                            >
                              {member.role}
                            </span>
                            {isAdmin && member.id !== user.id && (
                              <>
                                <button
                                  onClick={() => handleChangeRole(member.id, member.role === 'admin' ? 'user' : 'admin')}
                                  disabled={changingRole}
                                  className='text-xs bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded-lg transition-colors disabled:opacity-60'
                                >
                                  {member.role === 'admin' ? 'Demote' : 'Promote'}
                                </button>
                                <button
                                  onClick={() => handleRemoveUser(member.id, member.email)}
                                  disabled={removingUser}
                                  className='text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg transition-colors disabled:opacity-60'
                                >
                                  Remove
                                </button>
                              </>
                            )}
                          </div>
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
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={userName}
                  className='w-20 h-20 rounded-full object-cover mb-3'
                />
              ) : (
                <div className='w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-2xl mb-3'>
                  {userInitials}
                </div>
              )}
              <h4 className='font-bold text-lg text-foreground'>{userName}</h4>
              <p className='text-muted-foreground text-sm mb-1'>{userEmail}</p>
              <p className='text-muted-foreground/60 text-xs mb-4'>
                {currentUserRole || 'user'}
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
              Your company identifier
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
                disabled={isUpdatingCompany}
                className='w-full py-2 px-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-60'
              >
                {isUpdatingCompany ? 'Leaving...' : 'Leave Company'}
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
            Update your display name and profile picture
          </p>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-foreground/80 mb-1'>
                Profile Image URL
              </label>
              <input
                type='url'
                value={editImage}
                onChange={(e) => setEditImage(e.target.value)}
                placeholder='https://example.com/image.jpg'
                className='w-full px-4 py-2 border border-border bg-card rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-foreground'
              />
              <p className='text-xs text-muted-foreground mt-1'>
                Enter a URL to your profile picture
              </p>
            </div>
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
              disabled={isSavingProfile}
              className='flex-1 py-2 px-4 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-medium disabled:opacity-60'
            >
              {isSavingProfile ? 'Saving...' : 'Save Changes'}
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
                  the exact Company ID you need to set. Incorrect values may
                  break your access to company data.
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
              disabled={isUpdatingCompany}
              className='flex-1 py-2 px-4 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium disabled:opacity-60'
            >
              {isUpdatingCompany ? 'Saving...' : 'Set Company Info'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Settings;
