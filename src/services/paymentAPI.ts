import apiClient from './apiClient';

export interface CreatePaymentRequest {
  plan?: string;
  returnUrl?: string;
  amount?: number;
}

export interface CreatePaymentResponse {
  success?: boolean;
  // Some payment providers return the checkout/payment url at the top level
  checkoutUrl?: string;
  paymentUrl?: string;
  url?: string;

  // or they return it inside `data` object
  data?: {
    checkoutUrl?: string;
    paymentUrl?: string;
    url?: string;
    [key: string]: any;
  } | any;

  message?: string;
}

export const paymentsAPI = {
  createPayment: async (payload: CreatePaymentRequest = {}): Promise<CreatePaymentResponse> => {
    const body = { amount: 29000, ...payload };
    const response = await apiClient.post('/api/payments/create', body);
    return response.data;
  },

  // Expose callback endpoint to forward payment provider callbacks if needed from app
  // Typically callbacks are webhooks handled by backend, but we include for completeness
  callback: async (payload: any) => {
    const response = await apiClient.post('/api/payments/callback', payload);
    return response.data;
  },
};


