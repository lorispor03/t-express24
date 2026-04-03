'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

const DEALS = [
  // Retro zuerst — Ligen durchmischt
  { title: 'Retro Real Madrid 11/12 Away', team: 'Real Madrid', handle: 'retro-real-madrid-11-12-away-s-xxl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20241225/5A1A70E0-1E05-322D-6889-46F420004B1A.jpg' },
  { title: 'Retro Bayern 14/15 Home', team: 'Bayern München', handle: '1415-baiyun-home', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250519/aa014cc34e9ab021876bd62e059b27f0.png' },
  { title: 'Retro AC Milan 06/07 Home', team: 'AC Milan', handle: 'retro-camisa-ac-milan-2006-07-home-long-sleeve', price: 59.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250103/615648b458576cd9cd576cb6cd46a235.jpg' },
  { title: 'Retro Brazil 2002 Home', team: 'Brasilien', handle: 'retro-camisa-brazil-2002-world-cup-home-masculina-yellow', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20241225/7C9EFFFC-7838-3187-57E8-E9B2947CC105.jpg' },
  { title: 'Retro Barcelona 14/15 Home', team: 'FC Barcelona', handle: 'retro-14-15-barcelona-home-s-xxl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250502/EE9F57DE-454A-A6DF-ED08-333BD091929D.jpg' },
  { title: 'Retro Juventus 15/16 Away Pink', team: 'Juventus Turin', handle: 'retro-camisa-juventus-2015-16-away-pink', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250103/f517d6c574c20d18715c0177915ef7f1.jpg' },
  { title: 'Retro Portugal 2006 Away', team: 'Portugal', handle: 'portugal-2006-away', price: 59.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20260203/d1c444d9731d0170789631bcc578c418.png' },
  // 25/26 danach
  { title: 'Arsenal 25/26 Home', team: 'Arsenal', handle: 'arsenal-25-26-home-s-4xl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250524/60236145aba5045a7b5af2359d72bde2.png' },
  { title: 'Barcelona 25/26 Home', team: 'FC Barcelona', handle: 'barcelona-x-ed-sheeran-25-26-home-s-4xl-fan-verison8', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251029/c0b88cb03ad9c3c984cee2f5d48fe37b.png' },
  { title: 'Bayern München 25/26 Home', team: 'Bayern München', handle: 'bayern-muenchen-25-26-home-s-4xl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250507/39105d8bb9f7990605218538d6c11426.png' },
  { title: 'Liverpool 25/26 Home', team: 'Liverpool', handle: 'lvp-25-26-home-red-s-4xl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250811/a0b4b860a99ad452798cbedb6fb3554c.png' },
  { title: 'PSG 25/26 Home', team: 'Paris Saint-Germain', handle: 'psg-25-26-home-special-s-4xl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250708/ca5d433b503f20fd0655b36fcc52197b.png' },
  { title: 'Napoli 25/26 Home', team: 'SSC Neapel', handle: 'ssc-napoli-25-26-home-s-4xl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250814/48fc415af683dac16a59ead0489d6e0a.png' },
  { title: 'Real Madrid Marvel', team: 'Real Madrid', handle: 'real-madrid-marvel-jersey-s-xxl_2c3e2a34', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251206/bb76c42d8815bea2c24092411620aa07.png' },
];

function DealCard({ deal }: { deal: typeof DEALS[number] }) {
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

export default function DealsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Infinite scroll loop: when reaching end, jump back seamlessly
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

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId: number;
    const speed = 0.5; // px per frame

    const step = () => {
      if (!paused) {
        el.scrollLeft += speed;
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafId);
  }, [paused]);

  // Duplicate items for seamless loop
  const items = [...DEALS, ...DEALS];

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl md:text-5xl uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Top Seller
          </h2>
          <p className="text-gray-400 text-sm mt-1">Die beliebtesten Trikots unserer Kunden</p>
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
