import { useAuth } from '@/AuthProvider';

function DashboardHeader() {
  const { user } = useAuth();
  // console.log(user);
  return (
    <>
      <div className='flex justify-center md:justify-between items-center pt-5 pb-2 flex-col lg:flex-row '>
        <h2 className='text-xl font-bold text-slate-800 tracking-tight'>
          👋 Welcome back,{' '}
          <span className='text-rose-600 uppercase'>
            {typeof user === 'object' && user && user.user_metadata?.name}
          </span>
          !
        </h2>
      </div>
    </>
  );
}

export default DashboardHeader;
