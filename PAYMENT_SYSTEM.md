# Payment System Documentation (Demo)

## Overview

This is a **demo payment system** built with consistency in mind, following the existing UI patterns and design system of the TeacupNet application. It provides a secure, user-friendly payment experience with **Paddle** as the payment processor for **demonstration purposes only**.

> **Note**: This is a demo system. No actual payments are processed. All payment data is simulated.

## Features

### Payment Methods
- **Paddle**: Full integration with Paddle for payment processing
- **PayPal**: Available through Paddle
- **Credit/Debit Cards**: Available through Paddle

### Security Features
- PCI DSS compliant processing via Paddle
- Secure checkout hosted by Paddle
- Webhook signature verification
- Form validation with error handling

### User Experience
- Responsive design (mobile-first)
- Loading states during processing
- Success page with order details
- Invoice download functionality
- Progress indicators
- Toast notifications for feedback

## File Structure

```
src/
├── app/
│   ├── payment/
│   │   ├── page.tsx              # Main payment page
│   │   └── success/
│   │       └── page.tsx          # Payment success page
├── components/
│   ├── payment/
│   │   ├── paddle-provider.tsx   # Paddle.js provider component
│   │   ├── payment-form.tsx      # Reusable payment form component
│   │   ├── checkout-form.tsx     # Checkout form component
│   │   ├── paddle-checkout-wrapper.tsx  # Paddle checkout wrapper
│   │   └── index.ts              # Payment components export
│   └── PaymentSummary.tsx        # Order summary component
└── types/
    └── payment.ts                # TypeScript type definitions
```

## UI Design Patterns

### Color Scheme
- **Primary**: Rose gradient (`from-rose-500 to-rose-600`)
- **Success**: Green accents for success states
- **Error**: Red for validation errors
- **Background**: Consistent with app theme

### Component Structure
- **Cards**: Rounded-3xl with shadow-2xl
- **Headers**: Gradient backgrounds with white text
- **Inputs**: Rounded-xl with border-2 and focus states
- **Buttons**: Gradient backgrounds with hover effects

### Typography
- **Headers**: Ubuntu font for headings
- **Body**: Outfit font for content
- **Consistent spacing and sizing**

## Usage

### Payment Page
Access: `/payment?plan=monthly|yearly|lifetime`

```tsx
// Example navigation
router.push('/payment?plan=monthly');
```

### Using Payment Components

```tsx
import { PaymentElementWrapper, PaddleCheckoutWrapper } from '@/components/payment';

// Simple payment form
<PaymentElementWrapper
  amount={99.00}
  metadata={{ plan: 'Premium' }}
  onSuccess={(data) => console.log('Payment success:', data)}
/>

// Checkout with multiple items
<PaddleCheckoutWrapper
  items={[
    { priceId: 'price_123', quantity: 1, name: 'Product', price: 49.00 }
  ]}
  onSuccess={(checkoutId) => console.log('Checkout:', checkoutId)}
/>
```

### API Integration
The payment API endpoint is ready for integration with Paddle:

```typescript
// POST /payment/create-checkout-session
{
  items: Array<{
    priceId: string;
    quantity: number;
  }>;
  customerEmail: string;
  customerName: string;
  successUrl: string;
  cancelUrl: string;
}
```

## Type Safety

All payment-related components use TypeScript interfaces:

```typescript
interface PaddleCheckoutItem {
  priceId: string;
  quantity?: number;
  name?: string;
  price?: number;
}

interface PaymentFormProps {
  customerEmail?: string;
  customerName?: string;
  plan?: string;
  amount?: number;
  priceId?: string;
  onSuccess?: (checkoutData: any) => void;
  onError?: (error: any) => void;
}
```

## Validation

### Client-side Validation
- Required field validation (email, name)
- Email format validation
- Item validation for checkout

### Server-side Validation
- Input sanitization
- Items array validation
- Price ID verification
- Webhook signature verification

## Security Considerations

1. **Use Paddle's hosted checkout** - Never handle raw card details
2. **Always use HTTPS** in production
3. **Implement webhook signature verification** on backend
4. **Validate all inputs** on both client and server
5. **Use environment variables** for API keys and tokens
6. **Implement rate limiting** for payment attempts

## Paddle Integration

### Setup Paddle.js

```typescript
// In paddle-provider.tsx
import { useEffect, useState } from 'react';

export function PaddleProvider({ children }: PaddleProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
      
      if (typeof window !== 'undefined' && (window as any).Paddle) {
        (window as any).Paddle.Environment.set(process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox');
        (window as any).Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_SIDE_VERIFICATION_TOKEN || '',
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <>{children}</>;
}
```

### Creating a Checkout

```typescript
// In component
const handleCheckout = async () => {
  const response = await fetch('/payment/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ priceId: 'price_123', quantity: 1 }],
      customerEmail: 'customer@example.com',
    }),
  });

  const data = await response.json();
  
  // Open Paddle checkout
  (window as any).Paddle.Checkout.open({
    checkout: data.checkoutId,
    successCallback: (checkoutData: any) => {
      console.log('Success:', checkoutData);
    },
  });
};
```

### Handling Webhooks (Backend)

```typescript
// In payment.controller.ts
const handleWebhook = async (req, res) => {
  const webhookSignature = req.headers['paddle-signature'];
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

  try {
    const event = paddle.webhooks.unmarshal(
      JSON.stringify(req.body),
      webhookSignature,
      webhookSecret
    );

    switch (event.eventType) {
      case 'checkout.completed':
        // Handle completed checkout
        break;
      case 'payment.succeeded':
        // Handle successful payment
        break;
      case 'payment.failed':
        // Handle failed payment
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).send('Webhook verification failed');
  }
};
```

## Environment Variables

### Backend (.env)
```env
# Paddle Payment Configuration
PADDLE_API_KEY=pk_test_placeholder_key_replace_with_real_key
PADDLE_WEBHOOK_SECRET=whsec_placeholder_secret_replace_with_real_webhook_secret
PADDLE_DEFAULT_PRICE_ID=price_id_placeholder_replace_with_real_price_id
PADDLE_ENVIRONMENT=sandbox
```

### Frontend (.env.local)
```env
# Paddle Payment Configuration
NEXT_PUBLIC_PADDLE_CLIENT_SIDE_VERIFICATION_TOKEN=placeholder_token_replace_with_real_token
NEXT_PUBLIC_PADDLE_DEFAULT_PRICE_ID=price_id_placeholder_replace_with_real_price_id
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
```

## Testing

### Build Test
```bash
npm run build
```

### Development Test
```bash
npm run dev
# Navigate to http://localhost:3000/payment?plan=monthly
```

### Paddle Sandbox Testing
1. Set `PADDLE_ENVIRONMENT=sandbox`
2. Use Paddle sandbox test cards
3. Test various scenarios (success, failure, cancellation)

## Future Enhancements

1. **Payment Analytics**: Track conversion rates and payment methods
2. **Subscription Management**: Handle recurring payments via Paddle
3. **Multi-currency Support**: Support different currencies
4. **Payment History**: User dashboard with payment history
5. **Refund System**: Automated refund processing via Paddle
6. **Webhook Handling**: Real-time payment status updates

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

### Frontend
- `lucide-react`: Icons
- `sonner`: Toast notifications
- `next/navigation`: Routing
- `react`: Component framework
- `typescript`: Type safety

### Backend
- `@paddle/paddle-node-sdk`: Paddle Node.js SDK
- `express`: Web framework
- `prisma`: Database ORM

## Contributing

When modifying the payment system:

1. **Maintain UI consistency** with existing design patterns
2. **Test all payment scenarios** thoroughly
3. **Update type definitions** if adding new fields
4. **Follow accessibility guidelines**
5. **Test on mobile devices** for responsive behavior
6. **Update documentation** for any breaking changes

## Support

For issues or questions about the payment system:
1. Check the browser console for errors
2. Verify Paddle.js is loaded correctly
3. Check network requests in browser dev tools
4. Review webhook logs in Paddle dashboard
5. Test with Paddle sandbox mode first

## Paddle Resources

- [Paddle Documentation](https://developer.paddle.com/)
- [Paddle.js Reference](https://developer.paddle.com/paddlejs/initialize-paddle)
- [Paddle Node SDK](https://github.com/PaddleHQ/paddle-node-sdk)
- [Paddle Webhooks](https://developer.paddle.com/webhooks/overview)
