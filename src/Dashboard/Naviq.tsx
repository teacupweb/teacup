import DashboardHeader from '@/Components/DashboardHeader';

function Naviq() {
  return (
    <div className='flex flex-col h-full'>
      <DashboardHeader />
      <div className='flex flex-col'>
        <div className='p-6 border min-h-[80vh] border-slate-100 rounded-2xl bg-white shadow-sm'>
          <div className=''>
            <h3 className='font-bold mb-2 ubuntu-font text-2xl text-slate-800'>
              Project Title
            </h3>
            <p className='text-slate-500'>
              This is a brief description of the project. It gives an overview
              of what the project is about.
            </p>
          </div>
        </div>
        <div className='flex justify-center md:justify-between items-center py-4 md:px-6 flex-col lg:flex-row my-5 bg-white border border-slate-100 rounded-2xl shadow-sm'>
          <h2 className='text-slate-700 font-medium'>Write your prompt here.</h2>
          <button className='bg-rose-600 cursor-pointer text-white px-6 py-2 rounded-xl text-lg hover:bg-rose-700 transition shadow-sm hover:shadow-md'>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Naviq;
