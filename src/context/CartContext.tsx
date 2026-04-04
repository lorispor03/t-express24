'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/types';
import { PatchOption } from '@/lib/patches';

export type ExtraOption = 'none' | 'aufdruck' | 'patches' | 'komplett';
export type BundleType = null | '3plus' | '6plus';

export const EXTRA_PRICES: Record<ExtraOption, number> = {
  none: 0,
  aufdruck: 3,
  patches: 3,
  komplett: 4,
};

export const BUNDLE_CONFIG = {
  '3plus': { min: 3, discount: 0.15, label: '15%' },
  '6plus': { min: 6, discount: 0.20, label: '20%' },
} as const;

export interface CartItem {
  id: string;
  product: Product;
  teamName: string;
  size: string;
  flockingName: string;
  flockingNumber: string;
  patches: PatchOption[];
  extraOption: ExtraOption;
  extraPrice: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, teamName: string, size: string, flockingName: string, flockingNumber: string, patches?: PatchOption[], extraOption?: ExtraOption, extraPrice?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  bundleDiscount: number;
  finalPrice: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  activeBundle: BundleType;
  setActiveBundle: (bundle: BundleType) => void;
  bundleProgress: { current: number; target: number; remaining: number; active: boolean; reached: boolean };
  loaded: boolean;
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
  const [activeBundle, setActiveBundleState] = useState<BundleType>(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('t24_cart');
      if (saved) setItems(JSON.parse(saved));
      const savedBundle = localStorage.getItem('t24_bundle');
      if (savedBundle) setActiveBundleState(savedBundle as BundleType);
    } catch {}
    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('t24_cart', JSON.stringify(items));
    }
  }, [items, loaded]);

  useEffect(() => {
    if (loaded) {
      if (activeBundle) {
        localStorage.setItem('t24_bundle', activeBundle);
      } else {
        localStorage.removeItem('t24_bundle');
      }
    }
  }, [activeBundle, loaded]);

  // Punkt 4: Bundle automatisch deaktivieren wenn Warenkorb leer
  useEffect(() => {
    if (loaded && items.length === 0 && activeBundle) {
      setActiveBundleState(null);
    }
  }, [items.length, loaded, activeBundle]);

  const [confirmCancel, setConfirmCancel] = useState(false);
  const [pendingBundle, setPendingBundle] = useState<BundleType>(null);

  const setActiveBundle = (bundle: BundleType) => {
    // Bestätigung wenn Bundle aufgelöst wird und Artikel im Warenkorb sind
    if (bundle === null && activeBundle !== null && items.length > 0) {
      setConfirmCancel(true);
      return;
    }
    setActiveBundleState(bundle);
  };

  const confirmCancelBundle = () => {
    setActiveBundleState(null);
    setConfirmCancel(false);
  };

  const dismissCancelBundle = () => {
    setConfirmCancel(false);
  };

  const addItem = (product: Product, teamName: string, size: string, flockingName: string, flockingNumber: string, patches: PatchOption[] = [], extraOption: ExtraOption = 'none', extraPrice: number = 0) => {
    const patchKey = patches.map(p => p.id).sort().join('+');
    const flocking = [flockingName, flockingNumber].filter(Boolean).join(' ');
    const id = `${product.h}_${size}_${flocking}_${patchKey}_${extraOption}`;
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id, product, teamName, size, flockingName, flockingNumber, patches, extraOption, extraPrice, quantity: 1 }];
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

  const clearCart = () => {
    setItems([]);
    setActiveBundleState(null);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const extra = i.extraPrice || 0;
    return sum + (parseFloat(i.product.p) + extra) * i.quantity;
  }, 0);

  // Bundle calculations
  const config = activeBundle ? BUNDLE_CONFIG[activeBundle] : null;
  const bundleProgress = {
    current: totalItems,
    target: config?.min ?? 0,
    remaining: config ? Math.max(0, config.min - totalItems) : 0,
    active: activeBundle !== null,
    reached: config ? totalItems >= config.min : false,
  };

  // Only discount the jersey prices, not extras
  const jerseyTotal = items.reduce((sum, i) => sum + parseFloat(i.product.p) * i.quantity, 0);
  const bundleDiscount = bundleProgress.reached && config ? jerseyTotal * config.discount : 0;
  const finalPrice = totalPrice - bundleDiscount;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, bundleDiscount, finalPrice, isCartOpen, setCartOpen, activeBundle, setActiveBundle, bundleProgress, loaded }}>
      {children}

      {/* Bundle-Auflösen Bestätigung */}
      {confirmCancel && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[9998]" />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl px-6 py-8 max-w-sm w-full text-center shadow-2xl">
              <div className="w-14 h-14 bg-[var(--gold)]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-[var(--gold)]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {activeBundle === '3plus' ? '15%' : '20%'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Bundle auflösen?</h2>
              <p className="text-sm text-gray-300 mb-6">
                {bundleProgress.reached
                  ? `Du hast ${totalItems} Trikots im Warenkorb. Wenn du das Bundle auflöst, verlierst du den Rabatt.`
                  : `Du hast ${totalItems}/${bundleProgress.target} Trikots bis zum Rabatt. Bundle wirklich auflösen?`
                }
              </p>
              <div className="flex gap-3">
                <button
                  onClick={dismissCancelBundle}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-bold px-4 py-3 rounded-lg transition-colors border border-white/10"
                >
                  Behalten
                </button>
                <button
                  onClick={confirmCancelBundle}
                  className="flex-1 bg-[var(--red-main)] hover:bg-[var(--red-dark)] text-white text-sm font-bold px-4 py-3 rounded-lg transition-colors"
                >
                  Auflösen
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </CartContext.Provider>
  );
}
