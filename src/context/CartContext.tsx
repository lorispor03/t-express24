'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/types';
import { PatchOption } from '@/lib/patches';

export interface CartItem {
  id: string;
  product: Product;
  teamName: string;
  size: string;
  flocking: string;
  patches: PatchOption[];
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, teamName: string, size: string, flocking: string, patches?: PatchOption[]) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('t24_cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('t24_cart', JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = (product: Product, teamName: string, size: string, flocking: string, patches: PatchOption[] = []) => {
    const patchKey = patches.map(p => p.id).sort().join('+');
    const id = `${product.h}_${size}_${flocking}_${patchKey}`;
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id, product, teamName, size, flocking, patches, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeItem(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const patchTotal = (i.patches || []).reduce((ps, p) => ps + p.price, 0);
    return sum + (parseFloat(i.product.p) + patchTotal) * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}
