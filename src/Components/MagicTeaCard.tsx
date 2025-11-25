import { BsFillCupHotFill } from 'react-icons/bs';

function MagicTeaCard() {
  return (
    <div className='w-full rounded-2xl bg-gradient-to-br from-rose-600 to-purple-600  p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-6'>
          <div className='p-4 text-5xl bg-white/20 rounded-2xl backdrop-blur-sm'>
            <BsFillCupHotFill className='text-4xl text-white' />
          </div>
          <div className='max-w-md'>
            <h3 className='text-3xl font-bold mb-3 bg-gradient-to-r ubuntu-font from-white to-rose-100 bg-clip-text text-transparent'>
              Hold My Tea
            </h3>
            <p className='text-lg text-white/90 mb-6 leading-relaxed'>
              Experience the magic of seamless workflow. Just try it and it will
              be worth it we promise.
            </p>
            <button className='px-8 py-3 cursor-pointer bg-white text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-all duration-300 transform hover:scale-105 shadow-lg'>
              Just Do It!
            </button>
          </div>
        </div>
      </div>
      {/* Floating elements for visual interest */}
      <div className='absolute top-4 right-4 w-3 h-3 bg-yellow-300 rounded-full animate-pulse'></div>
      <div className='absolute bottom-4 left-4 w-2 h-2 bg-cyan-300 rounded-full animate-pulse delay-1000'></div>
    </div>
  );
}

export default MagicTeaCard;
