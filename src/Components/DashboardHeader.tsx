import { useAuth } from '@/AuthProvider';

function DashboardHeader() {
  const { user } = useAuth();
  // console.log(user);
  return (
    <>
      <div className='flex justify-center  md:justify-between items-center py-2 md:px-5 flex-col lg:flex-row my-5 bg-rose-50 border border-rose-200 rounded-2xl '>
        <h2>
          👋 Welcome back,{' '}
          <span className='font-bold uppercase'>
            {typeof user === 'object' && user && user.user_metadata?.name}
          </span>
          !
        </h2>
        {/* <button className='bg-rose-600 cursor-pointer text-white px-5 py-1 rounded-2xl text-lg hover:bg-rose-700 transition'>
          New Project
        </button> */}
      </div>
    </>
  );
}

export default DashboardHeader;
