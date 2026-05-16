import { apiFetch } from '../client';
import type {
  CheckoutCustomerPayload,
  CreateOrderResult,
  ShippingAddressPayload,
  ShippingQuoteResult,
} from '../types';

export async function quoteShipping(
  body: { cartId: string; zipCode: string },
  auth: { token?: string; cartToken?: string } = {},
): Promise<ShippingQuoteResult> {
  return apiFetch<ShippingQuoteResult>('/b2c/shipping/quote', {
    method: 'POST',
    body,
    token: auth.token,
    cartToken: auth.cartToken,
  });
}

export async function createOrderFromCart(
  body: {
    cartId: string;
    customer: CheckoutCustomerPayload;
    shippingAddress: ShippingAddressPayload;
    shippingChoice: { service: string; carrier: string };
    notes?: string;
  },
  auth: { token?: string; cartToken?: string } = {},
): Promise<CreateOrderResult> {
  return apiFetch<CreateOrderResult>('/b2c/checkout', {
    method: 'POST',
    body,
    token: auth.token,
    cartToken: auth.cartToken,
  });
}
