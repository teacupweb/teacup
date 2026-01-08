import { BsFillCupHotFill } from 'react-icons/bs';
import { useState } from 'react';
import Modal, { openModal, closeModal } from '@/Components/Modal';
import { toast } from 'react-toastify';
import AILoadingSpinner from '@/Components/AILoadingSpinner';
import { useAuth } from '@/AuthProvider';
import { useHoldMyTea } from '@/backendProvider';
// import { useMutation } from '@tanstack/react-query';

// const API_URL = import.meta.env.VITE_BACKEND;

export default function HoldMyTea() {
  const { user } = useAuth();
  const [isAILoading, setIsAILoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Get owner email from user metadata
  const ownerEmail =
    user && typeof user !== 'string'
      ? user.user_metadata?.owner_email || user.email
      : null;

  // Mutation for Hold My Tea API

  function handleClick() {
    openModal('magic-tea-modal');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || !ownerEmail) return;

    // Close modal and show AI loading
    closeModal('magic-tea-modal');
    setIsAILoading(true);

    try {
      // Call the API
      const res = await useHoldMyTea(ownerEmail, prompt);
      console.log(res);
      // Success - show success modal
      setIsAILoading(false);
      setPrompt('');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Hold My Tea error:', error);
      setIsAILoading(false);
      // You could add error handling UI here
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <>
      {/* AI Loading Spinner Overlay */}
      <AILoadingSpinner isVisible={isAILoading} />

      {/* EPIC MAGIC CTA BANNER */}
      <div className='col-span-1 md:col-span-2 lg:col-span-2'>
        <div className='w-full rounded-2xl bg-gradient-to-br from-rose-600 to-rose-900 p-4 sm:p-6 md:p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6'>
            <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full'>
              <div className='p-3 sm:p-4 text-4xl sm:text-5xl bg-card/20 rounded-2xl backdrop-blur-sm'>
                <BsFillCupHotFill className='text-3xl sm:text-4xl text-white' />
              </div>
              <div className='max-w-md text-center sm:text-left'>
                <h3 className='text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r ubuntu-font from-white to-rose-100 bg-clip-text text-transparent'>
                  Hold My Tea
                </h3>
                <p className='text-base sm:text-lg text-white/90 mb-4 sm:mb-6 leading-relaxed'>
                  Experience the magic of seamless workflow. Just try it and it
                  will be worth it we promise.
                </p>
                <button
                  onClick={handleClick}
                  className='px-8 py-3 cursor-pointer bg-card text-rose-600 rounded-xl font-bold hover:bg-muted transition-all duration-300 transform hover:scale-105 shadow-lg'
                >
                  Just Do It!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Magic Modal */}
      <Modal id='magic-tea-modal' className='max-w-2xl'>
        <div className='p-8'>
          {/* Header with gradient */}
          <div className='mb-6'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl'>
                <BsFillCupHotFill className='text-3xl text-white' />
              </div>
              <div>
                <h2 className='text-3xl font-bold bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent ubuntu-font'>
                  Hold My Tea ☕
                </h2>
                <p className='text-muted-foreground text-sm mt-1'>
                  AI-powered magic at your fingertips
                </p>
              </div>
            </div>
            <div className='h-1 w-20 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full' />
          </div>

          {/* Description */}
          <div className='mb-6 p-4 bg-muted/40 rounded-xl border border-border'>
            <p className='text-foreground/80 leading-relaxed'>
              ✨ Just type a prompt and watch the AI work its magic. Our
              intelligent system will process your request and deliver amazing
              results in seconds!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='ai-prompt'
                className='block text-sm font-semibold text-foreground/80 mb-2'
              >
                Your Prompt
              </label>
              <textarea
                id='ai-prompt'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g., Create a blog post for my coffee shop...'
                rows={4}
                className='w-full px-4 py-3 text-base text-foreground bg-card border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 resize-none'
              />
            </div>

            <button
              type='submit'
              disabled={!prompt.trim()}
              className='w-full px-6 py-4 text-lg font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 rounded-xl hover:from-rose-700 hover:to-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl'
            >
              ✨ Let the Magic Begin
            </button>
          </form>

          {/* Footer hint */}
          <p className='text-xs text-muted-foreground text-center mt-4'>
            Press Enter or click the button to submit
          </p>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        id='success-modal'
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        className='max-w-md'
      >
        <div className='p-8 text-center'>
          {/* Animated success icon */}
          <div className='mb-6 relative'>
            <div className='w-24 h-24 mx-auto bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center animate-bounce-once'>
              <svg
                className='w-12 h-12 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={3}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            {/* Confetti effect */}
            <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
              <div className='absolute w-2 h-2 bg-rose-400 rounded-full animate-confetti-1' />
              <div className='absolute w-2 h-2 bg-pink-400 rounded-full animate-confetti-2' />
              <div className='absolute w-2 h-2 bg-rose-500 rounded-full animate-confetti-3' />
              <div className='absolute w-2 h-2 bg-pink-500 rounded-full animate-confetti-4' />
              <div className='absolute w-2 h-2 bg-rose-300 rounded-full animate-confetti-5' />
              <div className='absolute w-2 h-2 bg-pink-300 rounded-full animate-confetti-6' />
            </div>
          </div>

          {/* Success message */}
          <h3 className='text-3xl font-bold bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent mb-3 ubuntu-font'>
            Magic Complete! ✨
          </h3>
          <p className='text-muted-foreground text-lg mb-6'>
            Your request has been processed successfully. The AI has worked its
            magic!
          </p>

          {/* Action button */}
          <button
            onClick={() => setShowSuccessModal(false)}
            className='px-8 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl font-bold hover:from-rose-700 hover:to-rose-800 transition-all duration-300 transform hover:scale-105 shadow-lg'
          >
            Awesome!
          </button>
        </div>

        <style>{`
          @keyframes bounce-once {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-20px) scale(1.1);
            }
          }

          @keyframes confetti-1 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(-60px, -80px) rotate(180deg);
              opacity: 0;
            }
          }

          @keyframes confetti-2 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(60px, -70px) rotate(-180deg);
              opacity: 0;
            }
          }

          @keyframes confetti-3 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(-40px, -100px) rotate(90deg);
              opacity: 0;
            }
          }

          @keyframes confetti-4 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(70px, -90px) rotate(-90deg);
              opacity: 0;
            }
          }

          @keyframes confetti-5 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(-80px, -60px) rotate(270deg);
              opacity: 0;
            }
          }

          @keyframes confetti-6 {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(50px, -110px) rotate(-270deg);
              opacity: 0;
            }
          }

          .animate-bounce-once {
            animation: bounce-once 0.6s ease-out;
          }

          .animate-confetti-1 {
            animation: confetti-1 1s ease-out forwards;
          }

          .animate-confetti-2 {
            animation: confetti-2 1.1s ease-out forwards;
          }

          .animate-confetti-3 {
            animation: confetti-3 0.9s ease-out forwards;
          }

          .animate-confetti-4 {
            animation: confetti-4 1.2s ease-out forwards;
          }

          .animate-confetti-5 {
            animation: confetti-5 1s ease-out forwards;
          }

          .animate-confetti-6 {
            animation: confetti-6 1.1s ease-out forwards;
          }
        `}</style>
      </Modal>
    </>
  );
}
