'use client';

import Link from 'next/link';
import { useRef, useState, useCallback } from 'react';
import { RecentProduct } from '@/hooks/useRecentlyViewed';

interface Props {
  items: RecentProduct[];
}

export default function RecentlyViewed({ items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <div className="relative mt-12 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-[calc((100vw-72rem)/2+1rem)]">
      <div className="bg-gradient-to-b from-[#f0f0f0] to-[#e4e4e4] py-8 md:py-10">
        {/* Titel — zentriert wie Produktbereich */}
        <div className="max-w-6xl mx-auto px-4 mb-5 md:mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-5xl uppercase tracking-wide text-gray-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Zuletzt angesehen
              </h2>
              <p className="text-gray-500 text-sm mt-1">Deine zuletzt besuchten Artikel</p>
            </div>
            <span className="text-xs font-bold bg-[var(--red-main)]/15 text-[var(--red-main)] px-3 py-1.5 rounded-full uppercase tracking-wider">
              Verlauf
            </span>
          </div>
        </div>

        {/* Karten — volle Breite, laufen rechts raus */}
        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-3 overflow-x-auto hide-sb pb-2 px-4 md:px-8 xl:px-12 2xl:px-16"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {items.map(product => (
              <Link
                key={product.handle}
                href={`/product/${product.handle}`}
                className="flex-shrink-0 w-[170px] sm:w-[195px] group"
              >
                <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden transition-all group-hover:border-[var(--red-main)]/30 group-hover:shadow-lg group-hover:shadow-[var(--red-main)]/10 h-full flex flex-col">
                  <div className="aspect-square bg-white">
                    <img src={product.image} alt={product.title} className="w-full h-full object-contain p-2" loading="lazy" decoding="async" />
                  </div>
                  <div className="p-3 flex flex-col flex-1 bg-[#fafafa] border-t border-gray-100">
                    <p className="text-[11px] text-gray-500">{product.teamName}</p>
                    <p className="text-xs font-medium text-gray-700 leading-tight mt-0.5 line-clamp-1">{product.title}</p>
                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <span className="text-sm font-bold text-[var(--gold)]">CHF {parseFloat(product.price).toFixed(2)}</span>
                      <span className="text-sm text-gray-400 line-through">CHF {(Math.floor(parseFloat(product.price) / 0.79) + 0.90).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
