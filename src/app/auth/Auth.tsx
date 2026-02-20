import { useEffect, useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AuthPage({ isLogin }: { isLogin: boolean }) {
  const { signUpUser, loginUser, user, signInWithGoogle } = useAuth();
  // const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  // const { user } = useAuth();
  const navigate = useRouter();
  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;
  const redirectPath = searchParams?.get('redirect') || '/';

  useEffect(() => {
    if (user !== 'userNotFound' && user !== null) {
      navigate.push(redirectPath);
    }
  }, [user, navigate, redirectPath]);

  const handleSubmit = async () => {
    try {
      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        await signUpUser(formData.email, formData.password, formData.name);
        toast.success('Account created successfully!');
      } else {
        await loginUser(formData.email, formData.password);
        toast.success('Welcome back!');
      }
      // The useEffect will handle the redirection once user state updates
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4 transition-colors'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
        <div
          className='absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className='w-full max-w-md relative'>
        <div className='bg-card rounded-3xl shadow-2xl overflow-hidden border border-border backdrop-blur-sm bg-opacity-95'>
          <div className='bg-gradient-to-r from-rose-500 to-rose-600 p-8 text-white'>
            <h1 className='text-3xl font-bold mb-2'>
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h1>
            <p className='text-rose-50/90 font-medium'>
              {isLogin
                ? 'Sign in to continue your journey'
                : 'Join us and get started today'}{' '}
              or{' '}
              <span className='font-bold hover:underline transition-all'>
                <Link href='/'>Go back</Link>
              </span>
            </p>
          </div>

          <div className='p-8 space-y-6'>
            {!isLogin && (
              <div className='space-y-2'>
                <label className='text-sm font-medium text-foreground/80 flex items-center gap-2'>
                  <User className='w-4 h-4 text-rose-500' />
                  Full Name
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className='w-full px-4 py-3 rounded-xl border-2 border-border bg-muted/30 text-foreground focus:border-rose-500 focus:outline-none transition-colors'
                  placeholder='John Doe'
                />
              </div>
            )}

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                <Mail className='w-4 h-4 text-rose-500' />
                Email Address
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-colors'
                placeholder='you@example.com'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                <Lock className='w-4 h-4 text-rose-500' />
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  className='w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-colors pr-12'
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-rose-500 transition-colors'
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className='space-y-2'>
                <label className='text-sm font-medium text-foreground/80 flex items-center gap-2'>
                  <Lock className='w-4 h-4 text-rose-500' />
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='w-full px-4 py-3 rounded-xl border-2 border-border bg-muted/30 text-foreground focus:border-rose-500 focus:outline-none transition-colors'
                  placeholder='••••••••'
                />
              </div>
            )}

            {isLogin && (
              <div className='flex items-center justify-between text-sm'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    className='w-4 h-4 text-rose-500 rounded border-border bg-muted focus:ring-rose-500'
                  />
                  <span className='text-muted-foreground font-medium'>
                    Remember me
                  </span>
                </label>
                <button
                  type='button'
                  className='text-rose-500 hover:text-rose-600 font-medium'
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className='w-full bg-linear-to-r from-rose-500 to-rose-600 text-white py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-rose-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 group'
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </button>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-200'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-card text-muted-foreground font-medium'>
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type='button'
              onClick={signInWithGoogle}
              className='w-full flex items-center justify-center cursor-pointer gap-3 px-4 py-3 border-2 border-border rounded-xl hover:border-rose-500 hover:bg-rose-500/10 transition-all group'
            >
              <svg className='w-5 h-5' viewBox='0 0 24 24'>
                <path
                  fill='#4285F4'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='#34A853'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='#FBBC05'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='#EA4335'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                />
              </svg>
              <span className='font-medium text-foreground/80 group-hover:text-foreground transition-colors'>
                Continue with Google
              </span>
            </button>

            <p className='text-center text-sm text-muted-foreground'>
              {isLogin
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                type='button'
                onClick={() =>
                  navigate.push(isLogin ? '/auth/signup' : '/auth/login')
                }
                className='text-rose-500 hover:text-rose-600 font-semibold'
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        <p className='text-center mt-6 text-sm text-muted-foreground'>
          By continuing, you agree to our{' '}
          <button className='text-rose-500 hover:text-rose-600'>
            Terms of Service
          </button>{' '}
          and{' '}
          <button className='text-rose-500 hover:text-rose-600'>
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
}
