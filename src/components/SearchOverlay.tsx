'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { searchProducts, searchTeams } from '@/lib/data';
import { Product } from '@/lib/types';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [teams, setTeams] = useState<Array<{ id: string; name: string; leagueName: string; productCount: number }>>([]);
  const [products, setProducts] = useState<Array<{ teamId: string; teamName: string; product: Product }>>([]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTeams([]);
      setProducts([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (q.trim().length < 2) {
      setTeams([]);
      setProducts([]);
      return;
    }
    setTeams(searchTeams(q.trim(), 5));
    setProducts(searchProducts(q.trim(), 12));
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="max-w-2xl mx-auto px-4 pt-20" onClick={e => e.stopPropagation()}>
        {/* Search input */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Team oder Trikot suchen..."
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-12 py-4 text-base focus:outline-none focus:border-[var(--red-main)] transition-colors"
          />
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Results */}
        {query.trim().length >= 2 && (
          <div className="mt-4 bg-[#1a1a1a] border border-white/10 rounded-xl max-h-[60vh] overflow-y-auto">
            {teams.length === 0 && products.length === 0 && (
              <p className="p-6 text-center text-gray-500 text-sm">Keine Ergebnisse für &quot;{query}&quot;</p>
            )}

            {/* Teams */}
            {teams.length > 0 && (
              <div className="p-3">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium px-2 mb-2">Teams</p>
                {teams.map(team => (
                  <Link
                    key={team.id}
                    href={`/team/${team.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div>
                      <span className="text-sm font-medium text-white">{team.name}</span>
                      <span className="text-xs text-gray-500 ml-2">{team.leagueName}</span>
                    </div>
                    <span className="text-xs text-gray-500">{team.productCount} Artikel</span>
                  </Link>
                ))}
              </div>
            )}

            {teams.length > 0 && products.length > 0 && (
              <div className="border-t border-white/5" />
            )}

            {/* Products */}
            {products.length > 0 && (
              <div className="p-3">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium px-2 mb-2">Produkte</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {products.map(({ product, teamName }) => (
                    <Link
                      key={product.h}
                      href={`/product/${product.h}`}
                      onClick={onClose}
                      className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img src={product.i} alt={product.t} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] text-gray-300 line-clamp-1">{product.t}</p>
                        <p className="text-xs font-bold text-[var(--gold)] mt-0.5">CHF {product.p}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
