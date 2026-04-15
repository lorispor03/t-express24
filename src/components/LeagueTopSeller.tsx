'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

interface Deal {
  title: string;
  handle: string;
  image: string;
  price: number;
  team: string;
}

function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link
      href={`/product/${deal.handle}`}
      className="flex-shrink-0 w-[180px] sm:w-[200px] group"
    >
      <div className="relative bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden transition-all group-hover:border-[var(--red-main)]/30 group-hover:shadow-lg group-hover:shadow-[var(--red-main)]/10 h-full flex flex-col">
        <div className="absolute top-2 left-2 z-10 bg-[var(--red-main)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          -21%
        </div>
        <div className="aspect-square bg-white">
          <img src={deal.image} alt={deal.title} className="w-full h-full object-contain p-2" />
        </div>
        <div className="p-3 flex flex-col flex-1">
          <p className="text-[11px] text-gray-500">{deal.team}</p>
          <p className="text-xs font-medium text-gray-200 leading-tight mt-0.5 line-clamp-1">{deal.title}</p>
          <div className="flex items-center gap-2 mt-auto pt-2">
            <span className="text-sm font-bold text-[var(--gold)]">CHF {deal.price.toFixed(2)}</span>
            <span className="text-sm text-gray-300 line-through">CHF {(Math.floor(deal.price / 0.79) + 0.90).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function LeagueTopSeller({ deals }: { deals: Deal[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) {
        el.scrollLeft -= half;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += half;
      }
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let rafId: number;
    const speed = 0.5;
    const step = () => {
      if (!paused) {
        el.scrollLeft += speed;
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [paused]);

  if (deals.length === 0) return null;

  const items = [...deals, ...deals];

  return (
    <section className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 py-4 md:py-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-4xl md:text-5xl uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Top Seller
          </h2>
          <p className="text-gray-400 text-sm mt-1">Die beliebtesten Trikots dieser Liga</p>
        </div>
        <span className="text-xs font-bold bg-[var(--red-main)]/20 text-[var(--red-main)] px-3 py-1.5 rounded-full uppercase tracking-wider">
          Hot
        </span>
      </div>
      <div
        ref={scrollRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => { setTimeout(() => setPaused(false), 2000); }}
        className="flex gap-3 overflow-x-auto hide-sb pb-2"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {items.map((deal, i) => (
          <DealCard key={`${deal.handle}-${i}`} deal={deal} />
        ))}
      </div>
    </section>
  );
}
