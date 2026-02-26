export interface PaymentFormData {
  name: string;
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  savePaymentInfo: boolean;
}

export interface PaymentPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
}

export interface PaymentMethod {
  id: 'card';
  name: string;
  icon: string;
  description?: string;
}

export interface OrderDetails {
  id: string;
  plan: PaymentPlan;
  date: string;
  email: string;
  amount: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: PaymentMethod['id'];
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  order?: {
    id: string;
    plan: string;
    amount: string;
    status: string;
  };
  error?: string;
}

export interface PaymentError {
  field: string;
  message: string;
}

export interface BillingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface PaymentRequest {
  customer: CustomerInfo;
  billing: BillingAddress;
  plan: string;
  amount: string;
  paymentMethod: PaymentMethod['id'];
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
  };
  savePaymentInfo?: boolean;
}
