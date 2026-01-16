// import iconBeside from '@/assets/icon-beside.png';
function Logo({ className }: { className?: string }) {
  return (
    <div className='bg-white p-1.5 rounded-xl inline-flex items-center justify-center shrink-0'>
      <img
        // src={iconBeside}
        src='/Assets/icon-beside.png'
        alt='Teacup'
        className={`${className} object-contain`}
      />
    </div>
  );
}

export default Logo;
