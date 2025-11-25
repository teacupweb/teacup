import { useEffect, useState } from 'react';

interface AILoadingSpinnerProps {
  isVisible: boolean;
  message?: string;
}

function AILoadingSpinner({
  isVisible,
  message = 'Doing its magic...',
}: AILoadingSpinnerProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    } else {
      // Delay hiding to allow fade-out animation
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Animated AI Gradient Background - Rose themed */}
      <div className='absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-600 to-rose-800 animate-gradient-shift'>
        {/* Overlay pattern */}
        <div className='absolute inset-0 opacity-30'>
          <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse' />
        </div>

        {/* Animated gradient orbs */}
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/30 rounded-full blur-3xl animate-float' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-float-delayed' />
        <div className='absolute top-1/2 left-1/2 w-96 h-96 bg-rose-400/30 rounded-full blur-3xl animate-float-slow' />
      </div>

      {/* Content */}
      <div className='relative z-10 flex flex-col items-center gap-8'>
        {/* Spinner */}
        <div className='relative'>
          {/* Outer ring */}
          <div className='w-32 h-32 rounded-full border-4 border-white/20 border-t-white border-r-white animate-spin' />

          {/* Inner pulsing circle */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm animate-pulse' />
          </div>

          {/* Center dot */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-8 h-8 rounded-full bg-white shadow-lg shadow-white/50 animate-ping' />
            <div className='absolute w-8 h-8 rounded-full bg-white' />
          </div>
        </div>

        {/* Text */}
        <div className='text-center'>
          <h3 className='text-3xl font-bold text-white mb-2 animate-pulse'>
            {message}
          </h3>
          <p className='text-white/80 text-lg'>
            AI is processing your request...
          </p>
        </div>

        {/* Loading dots */}
        <div className='flex gap-2'>
          <div className='w-3 h-3 bg-white rounded-full animate-bounce' />
          <div
            className='w-3 h-3 bg-white rounded-full animate-bounce'
            style={{ animationDelay: '0.1s' }}
          />
          <div
            className='w-3 h-3 bg-white rounded-full animate-bounce'
            style={{ animationDelay: '0.2s' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 30px) scale(0.9);
          }
          66% {
            transform: translate(20px, -20px) scale(1.1);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(15px, 15px) scale(1.05);
          }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default AILoadingSpinner;
