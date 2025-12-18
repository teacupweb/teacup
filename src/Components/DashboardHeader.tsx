import { useAuth } from '@/AuthProvider';

function DashboardHeader() {
  const { user } = useAuth();
  // console.log(user);
  return (
    <>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='flex justify-between items-center pt-5 pb-2 flex-col md:flex-row gap-4'>
          <h2 className='text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight text-center md:text-left'>
            👋 Welcome back,{' '}
            <span className='text-rose-600 uppercase'>
              {typeof user === 'object' && user && user.user_metadata?.name}
            </span>
            !
          </h2>
        </div>
      </div>
    </>
  );
}

export default DashboardHeader;
