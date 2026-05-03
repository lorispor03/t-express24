'use client';

import { useState, useEffect, useCallback } from 'react';

export interface RecentProduct {
  handle: string;
  title: string;
  image: string;
  price: string;
  teamName: string;
}

const STORAGE_KEY = 'recently_viewed';
const MAX_ITEMS = 12;

function loadFromStorage(): RecentProduct[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: RecentProduct[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function useRecentlyViewed(currentHandle?: string) {
  const [items, setItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    setItems(loadFromStorage());
  }, []);

  const addProduct = useCallback((product: RecentProduct) => {
    setItems(prev => {
      const filtered = prev.filter(p => p.handle !== product.handle);
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const visible = currentHandle
    ? items.filter(p => p.handle !== currentHandle)
    : items;

  return { items: visible, addProduct };
}
