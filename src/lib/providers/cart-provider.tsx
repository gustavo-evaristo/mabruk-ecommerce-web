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
import type { Banho } from '@/lib/api/types';

/**
 * CartProvider client-side mockado para a Etapa 5.
 * Estado em localStorage; sem chamada à API ainda.
 * Quando integrar (Etapa 7), trocar implementação para chamar
 * /b2c/carts e armazenar cartId + guestToken em cookie HTTP-only.
 */

export interface CartItem {
  itemId: string;
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  banho: Banho;
  size: string;
  sku: string;
  unitPriceCents: number;
  quantity: number;
  imageUrl: string | null;
}

interface CartState {
  items: CartItem[];
  subtotalCents: number;
  totalItems: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (item: Omit<CartItem, 'itemId' | 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartState | null>(null);

const STORAGE_KEY = 'mabruk-cart-v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const addItem = useCallback<CartState['addItem']>(
    (input) => {
      const quantity = input.quantity ?? 1;
      setItems((prev) => {
        const existing = prev.find((i) => i.variantId === input.variantId);
        if (existing) {
          return prev.map((i) =>
            i.itemId === existing.itemId ? { ...i, quantity: i.quantity + quantity } : i,
          );
        }
        return [
          ...prev,
          {
            ...input,
            quantity,
            itemId: `it-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          },
        ];
      });
      setIsOpen(true);
    },
    [],
  );

  const updateQuantity = useCallback<CartState['updateQuantity']>((itemId, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.itemId === itemId ? { ...i, quantity } : i)));
  }, []);

  const removeItem = useCallback<CartState['removeItem']>((itemId) => {
    setItems((prev) => prev.filter((i) => i.itemId !== itemId));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const subtotalCents = useMemo(
    () => items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0),
    [items],
  );
  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  const value: CartState = {
    items,
    subtotalCents,
    totalItems,
    isOpen,
    open,
    close,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart() precisa estar dentro de <CartProvider>');
  return ctx;
}
