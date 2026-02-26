'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthProvider';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import PaymentForm from '@/Components/PaymentForm';
import PaymentSummary from '@/Components/PaymentSummary';
import { 
  Mail, 
  User, 
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import type { PaymentFormData, PaymentPlan } from '@/types/payment';

function PaymentContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState<PaymentFormData>({
    name: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    savePaymentInfo: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedPlan: PaymentPlan = {
    name: 'Monthly Plan',
    price: '30',
    period: '/month',
    features: ['Full access to all features', 'Monthly billing', 'Cancel anytime', 'Priority support'],
  };

  useEffect(() => {
    if (user === 'userNotFound') {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
    }
    
    if (user && user !== 'userNotFound') {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.name || '',
        email: user.email || ''
      }));
    }
  }, [user, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Invalid card number';
    }
    
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid format (MM/YY)';
    }
    
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }
    
    if (!formData.billingAddress.trim()) newErrors.billingAddress = 'Billing address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing for demo
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Demo payment successful! Redirecting...');
      setTimeout(() => {
        router.push('/payment/success');
      }, 1500);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('An error occurred during payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (user === null || user === 'userNotFound') {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='animate-pulse text-xl font-medium text-rose-600'>Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className='py-12 px-4'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
        <div
          className='absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className='max-w-6xl mx-auto relative'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-4 ubuntu-font bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent'>
            Secure Payment
          </h1>
          <p className='text-lg text-muted-foreground'>
            Complete your purchase with our secure payment system
          </p>
        </div>
        
        <div className='grid lg:grid-cols-3 gap-12'>
          {/* Order Summary - Right side on desktop, top on mobile */}
          <div className='lg:order-2 lg:col-span-1'>
            <PaymentSummary plan={selectedPlan} />
          </div>

          {/* Payment Form */}
          <div className='lg:order-1 lg:col-span-2 space-y-8'>
            {/* Contact Information */}
            <div className='bg-card rounded-3xl shadow-2xl overflow-hidden border border-border backdrop-blur-sm bg-opacity-95'>
              <div className='bg-gradient-to-r from-rose-500 to-rose-600 p-6 text-white'>
                <h2 className='text-xl font-bold flex items-center gap-2'>
                  <User className='w-5 h-5' />
                  Contact Information
                </h2>
              </div>
              
              <div className='p-6 space-y-6'>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground/80 flex items-center gap-2'>
                      <User className='w-4 h-4 text-rose-500' />
                      Full Name
                    </label>
                    <input 
                      type='text' 
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${errors.name ? 'border-red-500' : 'border-border'} bg-muted/30 text-foreground focus:border-rose-500 focus:outline-none transition-colors`}
                      placeholder='John Doe'
                    />
                    {errors.name && (
                      <p className='text-sm text-red-500 flex items-center gap-1'>
                        <AlertCircle className='w-4 h-4' />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground/80 flex items-center gap-2'>
                      <Mail className='w-4 h-4 text-rose-500' />
                      Email Address
                    </label>
                    <input 
                      type='email' 
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      className='w-full px-4 py-3 rounded-xl border-2 border-border bg-muted/30 text-muted-foreground'
                    />
                  </div>
                </div>
                
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-foreground/80 flex items-center gap-2'>
                    <Smartphone className='w-4 h-4 text-rose-500' />
                    Phone Number (Optional)
                  </label>
                  <input 
                    type='tel' 
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 rounded-xl border-2 border-border bg-muted/30 text-foreground focus:border-rose-500 focus:outline-none transition-colors'
                    placeholder='+1 (555) 123-4567'
                  />
                </div>
              </div>
            </div>

            {/* Payment Form Component */}
            <div className='bg-card rounded-3xl shadow-2xl overflow-hidden border border-border backdrop-blur-sm bg-opacity-95'>
              <div className='bg-gradient-to-r from-rose-500 to-rose-600 p-6 text-white'>
                <h2 className='text-xl font-bold'>Payment Information</h2>
              </div>
              
              <div className='p-6'>
                <PaymentForm
                  formData={formData}
                  errors={errors}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                  isProcessing={isProcessing}
                  amount={selectedPlan.price}
                  showCardNumber={showCardNumber}
                  showCVV={showCVV}
                  onToggleCardNumber={() => setShowCardNumber(!showCardNumber)}
                  onToggleCVV={() => setShowCVV(!showCVV)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className='bg-background text-foreground min-h-screen'>
      <div className='mx-auto container'>
        <Navbar />
        <Suspense fallback={
          <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='animate-pulse text-xl font-medium text-rose-600'>Loading payment page...</div>
          </div>
        }>
          <PaymentContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
