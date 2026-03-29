'use client';

import Link from 'next/link';
import { useRef, useState, useCallback } from 'react';

const DEALS = [
  { title: 'Arsenal 25/26 Home', team: 'Arsenal', handle: 'arsenal-25-26-home-s-4xl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250524/60236145aba5045a7b5af2359d72bde2.png' },
  { title: 'Barcelona 25/26 Home', team: 'FC Barcelona', handle: 'barcelona-x-ed-sheeran-25-26-home-s-4xl-fan-verison8', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251029/c0b88cb03ad9c3c984cee2f5d48fe37b.png' },
  { title: 'Bayern München 25/26 Home', team: 'Bayern München', handle: 'bayern-muenchen-25-26-home-s-4xl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250507/39105d8bb9f7990605218538d6c11426.png' },
  { title: 'Liverpool 25/26 Home', team: 'Liverpool', handle: 'lvp-25-26-home-red-s-4xl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250811/a0b4b860a99ad452798cbedb6fb3554c.png' },
  { title: 'PSG 25/26 Home', team: 'Paris Saint-Germain', handle: 'psg-25-26-home-special-s-4xl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250708/ca5d433b503f20fd0655b36fcc52197b.png' },
  { title: 'Man City EA Sports 25/26', team: 'Manchester City', handle: 'manchester-city-ea-sports-fc-jersey-2025-26-s-4xl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251103/b0a1ec3770e133b77004d43536f12067.png' },
  { title: 'Dortmund 25/26 Special', team: 'Borussia Dortmund', handle: 'borussia-dortmund-25-26-special-shirt-s-xxl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251109/6ad8118e1e4f2bfc552ebebcb964bdb1.png' },
];

export default function DealsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const [scrollInfo, setScrollInfo] = useState({ ratio: 1, left: 0 });
  const [isScrolling, setIsScrolling] = useState(false);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = el.clientWidth / el.scrollWidth;
    setScrollInfo({ ratio, left: max > 0 ? el.scrollLeft / el.scrollWidth : 0 });
    setIsScrolling(true);
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setIsScrolling(false), 1200);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl md:text-5xl uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Angebote
          </h2>
          <p className="text-gray-400 text-sm mt-1">Ausgewählte Trikots zum Sonderpreis</p>
        </div>
        <span className="text-xs font-bold bg-[var(--red-main)]/20 text-[var(--red-main)] px-3 py-1.5 rounded-full uppercase tracking-wider">
          Sale
        </span>
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex gap-3 overflow-x-auto hide-sb pb-2"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {DEALS.map((deal) => (
          <Link
            key={deal.handle}
            href={`/product/${deal.handle}`}
            className="flex-shrink-0 w-[160px] sm:w-[200px] group"
          >
            <div className="relative bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden transition-all group-hover:border-[var(--red-main)]/30 group-hover:shadow-lg group-hover:shadow-[var(--red-main)]/10">
              {/* Sale Badge */}
              <div className="absolute top-2 left-2 z-10 bg-[var(--red-main)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                -21%
              </div>

              {/* Image */}
              <div className="aspect-square bg-white">
                <img src={deal.image} alt={deal.title} className="w-full h-full object-contain p-2" />
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-[11px] text-gray-500">{deal.team}</p>
                <p className="text-xs font-medium text-gray-200 leading-tight mt-0.5 line-clamp-2">{deal.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-bold text-[var(--gold)]">CHF {deal.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500 line-through">CHF {(Math.floor(deal.price / 0.79) + 0.90).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Scrollbar */}
      {scrollInfo.ratio < 1 && (
        <div className={`mt-3 h-[3px] bg-white/10 rounded-full relative transition-opacity duration-300 ${isScrolling ? 'opacity-100' : 'opacity-0'}`}>
          <div
            className="absolute top-0 h-full bg-[var(--red-main)] rounded-full"
            style={{ width: `${scrollInfo.ratio * 100}%`, left: `${scrollInfo.left * 100}%` }}
          />
        </div>
      )}
    </section>
  );
}
