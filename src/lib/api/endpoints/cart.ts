import { apiFetch } from '../client';
import type { CartView, CreateCartResponse } from '../types';

/**
 * Endpoints de carrinho — sempre chamam a API (não fazem sentido mockados,
 * pois precisam de estado persistente entre requests).
 */

export async function createCart(opts: { token?: string } = {}): Promise<CreateCartResponse> {
  return apiFetch<CreateCartResponse>('/b2c/carts', {
    method: 'POST',
    body: {},
    token: opts.token,
  });
}

export async function getCart(
  cartId: string,
  auth: { token?: string; cartToken?: string },
): Promise<CartView> {
  return apiFetch<CartView>(`/b2c/carts/${cartId}`, {
    method: 'GET',
    token: auth.token,
    cartToken: auth.cartToken,
  });
}

export async function addCartItem(
  cartId: string,
  body: { variantId: string; quantity: number },
  auth: { token?: string; cartToken?: string },
): Promise<void> {
  await apiFetch<void>(`/b2c/carts/${cartId}/items`, {
    method: 'POST',
    body,
    token: auth.token,
    cartToken: auth.cartToken,
  });
}

export async function updateCartItem(
  cartId: string,
  itemId: string,
  body: { quantity: number },
  auth: { token?: string; cartToken?: string },
): Promise<void> {
  await apiFetch<void>(`/b2c/carts/${cartId}/items/${itemId}`, {
    method: 'PATCH',
    body,
    token: auth.token,
    cartToken: auth.cartToken,
  });
}

export async function removeCartItem(
  cartId: string,
  itemId: string,
  auth: { token?: string; cartToken?: string },
): Promise<void> {
  await apiFetch<void>(`/b2c/carts/${cartId}/items/${itemId}`, {
    method: 'DELETE',
    token: auth.token,
    cartToken: auth.cartToken,
  });
}
