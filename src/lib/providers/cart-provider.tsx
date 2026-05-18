'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addCartItem,
  createCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from '@/lib/api/endpoints/cart';
import type { CartLine, CartView } from '@/lib/api/types';

/**
 * CartProvider — chama a API real via React Query.
 *
 * - `cartId` + `guestToken` persistidos em localStorage (mantém entre reloads)
 * - useQuery faz fetch do cart; mutations invalidam pra refresh
 * - Cart é criado on-demand no primeiro add
 */

const CART_KEY = 'mabruk-cart-id-v2';
const TOKEN_KEY = 'mabruk-cart-token-v2';

interface CartIdentity {
  cartId: string | null;
  guestToken: string | null;
}

const EMPTY_CART: CartView = {
  cartId: '',
  lines: [],
  subtotalCents: 0,
  totalItems: 0,
};

interface CartContextValue {
  /** Linhas do cart (vazio até existir). */
  items: CartLine[];
  subtotalCents: number;
  totalItems: number;
  isLoading: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (input: { variantId: string; quantity?: number }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => void;
  identity: CartIdentity;
}

const CartContext = createContext<CartContextValue | null>(null);

function readIdentity(): CartIdentity {
  if (typeof window === 'undefined') return { cartId: null, guestToken: null };
  return {
    cartId: localStorage.getItem(CART_KEY),
    guestToken: localStorage.getItem(TOKEN_KEY),
  };
}

function writeIdentity(id: CartIdentity) {
  if (typeof window === 'undefined') return;
  if (id.cartId) localStorage.setItem(CART_KEY, id.cartId);
  else localStorage.removeItem(CART_KEY);
  if (id.guestToken) localStorage.setItem(TOKEN_KEY, id.guestToken);
  else localStorage.removeItem(TOKEN_KEY);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [identity, setIdentity] = useState<CartIdentity>({ cartId: null, guestToken: null });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIdentity(readIdentity());
  }, []);

  const cartKey = ['cart', identity.cartId] as const;

  const { data: view, isLoading } = useQuery({
    queryKey: cartKey,
    queryFn: () =>
      getCart(identity.cartId!, {
        cartToken: identity.guestToken ?? undefined,
      }),
    enabled: Boolean(identity.cartId),
  });

  async function ensureCart(): Promise<CartIdentity> {
    if (identity.cartId) return identity;
    const res = await createCart({});
    const next: CartIdentity = {
      cartId: res.cartId,
      guestToken: res.guestToken,
    };
    writeIdentity(next);
    setIdentity(next);
    return next;
  }

  const addMutation = useMutation({
    mutationFn: async (input: { variantId: string; quantity: number }) => {
      const id = await ensureCart();
      await addCartItem(
        id.cartId!,
        { variantId: input.variantId, quantity: input.quantity },
        { cartToken: id.guestToken ?? undefined },
      );
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['cart', id.cartId] });
      setIsOpen(true);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (!identity.cartId) return;
      await updateCartItem(
        identity.cartId,
        itemId,
        { quantity },
        { cartToken: identity.guestToken ?? undefined },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (!identity.cartId) return;
      await removeCartItem(identity.cartId, itemId, {
        cartToken: identity.guestToken ?? undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
  });

  const addItem = useCallback(
    async (input: { variantId: string; quantity?: number }) => {
      await addMutation.mutateAsync({
        variantId: input.variantId,
        quantity: input.quantity ?? 1,
      });
    },
    [addMutation],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity < 1) return;
      await updateMutation.mutateAsync({ itemId, quantity });
    },
    [updateMutation],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      await removeMutation.mutateAsync(itemId);
    },
    [removeMutation],
  );

  const clear = useCallback(() => {
    writeIdentity({ cartId: null, guestToken: null });
    setIdentity({ cartId: null, guestToken: null });
    queryClient.removeQueries({ queryKey: ['cart'] });
  }, [queryClient]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const safe = view ?? EMPTY_CART;
  const value = useMemo<CartContextValue>(
    () => ({
      items: safe.lines,
      subtotalCents: safe.subtotalCents,
      totalItems: safe.totalItems,
      isLoading,
      isOpen,
      open,
      close,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      identity,
    }),
    [
      safe.lines,
      safe.subtotalCents,
      safe.totalItems,
      isLoading,
      isOpen,
      open,
      close,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      identity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart() precisa estar dentro de <CartProvider>');
  return ctx;
}
