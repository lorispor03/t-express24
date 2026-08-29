'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

const DEALS = [
  // WM 2026 Player Version Trikots — bekannteste Nationalmannschaften
  { title: 'Deutschland Auswärtstrikot WM 2026 Player Version', team: 'Deutschland', handle: 'player-version-2026-world-cup-germany-away-jersey-s-4xl', price: 54.90, image: 'https://img.wpassets-gamma.com/images/bd487d45facdd832ffa3b518bdc14b44.jpg' },
  { title: 'Argentinien Heimtrikot WM 2026 Player Version', team: 'Argentinien', handle: 'player-version-2026-world-cup-argentina-home-jersey-s-4xl', price: 54.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251108/390a8bcdd58eddcaef2742498eaca55f.jpg' },
  { title: 'Brasilien Heimtrikot WM 2026 Player Version', team: 'Brasilien', handle: 'player-version-2026-world-cup-brazil-home-jersey-s-4xl', price: 54.90, image: 'https://img.wpassets-gamma.com/images/95465043725f45f23ac2d55ffb41d8d5.jpg' },
  { title: 'Frankreich Heimtrikot WM 2026 Player Version', team: 'Frankreich', handle: 'player-version-2026-world-cup-france-home-jersey-s-xxl', price: 54.90, image: 'https://img.wpassets-gamma.com/images/5318230d42c45baf9a902cf734c0beb5.webp' },
  { title: 'England Heimtrikot WM 2026 Player Version', team: 'England', handle: 'player-version-england-2026-home-jersey-s-4xl', price: 54.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251025/920593c5b41732c537e03bc2b0ffcad0.jpg' },
  { title: 'Spanien Heimtrikot WM 2026 Player Version', team: 'Spanien', handle: 'player-version-2026-world-cup-spain-home-jersey-s-4xl', price: 54.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251125/585d03b206c4aee8af8fd386575d206f.jpg' },
  { title: 'Portugal Heimtrikot WM 2026 Player Version', team: 'Portugal', handle: 'player-version-portugal-2026-home-red-jersey-s-4xl', price: 54.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251025/3875350df9b02ea5e624290ed5a06d8c.jpg' },
  { title: 'Niederlande Heimtrikot WM 2026 Player Version', team: 'Niederlande', handle: 'pl-netherlands-2026-world-cup-home-jersey', price: 54.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20260203/72cc222141598d3e86a48430f28451cb.webp' },
  { title: 'Kroatien Heimtrikot WM 2026 Player Version', team: 'Kroatien', handle: 'player-version-2026-world-cup-croatia-home-jersey-s-xxl', price: 54.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251203/9b367870329d48948d9fb6cdda99f381.jpg' },
  { title: 'Japan Heimtrikot WM 2026 Player Version', team: 'Japan', handle: 'player-version-germany-2026-white-s-3xl_8dd3ea12', price: 54.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251025/ac3c95dd301e672536815831d896b59c.jpg' },
  { title: 'Belgien Heimtrikot WM 2026 Player Version', team: 'Belgien', handle: 'player-version-belgium-2026-home-jersey-red-s-xxl', price: 54.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251025/beb798bfb3114a62a7261e1c18a5f271.jpg' },
  { title: 'USA Heimtrikot WM 2026 Player Version', team: 'USA', handle: 'player-version-usa-2026-world-cup-home-jersey', price: 54.90, image: 'https://img.wpassets-gamma.com/images/85366cd66a8bd36d9e1c3e814a18f208.jpg' },
  { title: 'Schweiz Heimtrikot WM 2026 Player Version', team: 'Schweiz', handle: 'player-version-2026-world-cup-switzerland-home-jersey-s-xxl', price: 54.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20260105/7593c2958e54862d48eb8c0bc597a179.jpg' },
  { title: 'Kolumbien Heimtrikot WM 2026 Player Version', team: 'Kolumbien', handle: 'player-version-2026-world-cup-colombia-home-jersey-s-4xl', price: 54.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251025/a07db019f96640ab9010c20dbc4daaf2.jpg' },
  { title: 'Mexiko Heimtrikot WM 2026 Player Version', team: 'Mexiko', handle: 'player-version-2026-world-cup-mexico-home-jersey-s-4xl', price: 54.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251103/5a57421118b3141112e2a579c0ad20b2.jpg' },
  { title: 'Portugal Trikot WM 2026 Player Version Schwarz', team: 'Portugal', handle: 'player-version-portugal-puma-2026-black-jersey-s-4xl', price: 54.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20251207/c38e551aa7d0bb16184fb965497a5d44.jpg' },
];

function DealCard({ deal }: { deal: typeof DEALS[number] }) {
  return (
    <Link
      href={`/product/${deal.handle}`}
      className="flex-shrink-0 w-[180px] sm:w-[200px] group"
    >
      <div className="relative bg-[#e8e8e8] rounded-xl border border-gray-300 overflow-hidden transition-all group-hover:border-[var(--red-main)]/30 group-hover:shadow-lg group-hover:shadow-[var(--red-main)]/10 h-full flex flex-col">
        <div className="absolute top-2 left-2 z-10 bg-[var(--red-main)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          -21%
        </div>
        <div className="aspect-square bg-[#e8e8e8]">
          <img src={deal.image} alt={deal.title} className="w-full h-full object-contain p-2" loading="lazy" decoding="async" />
        </div>
        <div className="p-3 flex flex-col flex-1">
          <p className="text-[11px] text-gray-500">{deal.team}</p>
          <p className="text-xs font-medium text-gray-800 leading-tight mt-0.5 line-clamp-1">{deal.title}</p>
          <div className="flex items-center gap-2 mt-auto pt-2">
            <span className="text-sm font-bold text-[var(--gold)]">CHF {deal.price.toFixed(2)}</span>
            <span className="text-sm text-gray-400 line-through">CHF {(Math.floor(deal.price / 0.79) + 0.90).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DealsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Start centered so first card appears in the middle of viewport
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const third = el.scrollWidth / 3;
    // Center: start of second copy + offset to center first card in viewport
    const viewportCenter = el.clientWidth / 2;
    const cardWidth = 200; // approximate card width
    el.scrollLeft = third - viewportCenter + cardWidth / 2;
  }, []);

  // Infinite scroll loop: when reaching end, jump back seamlessly
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const third = el.scrollWidth / 3;
      if (el.scrollLeft >= third * 2) {
        el.scrollLeft -= third;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += third;
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

  // Triplicate items for seamless bidirectional loop
  const items = [...DEALS, ...DEALS, ...DEALS];

  return (
    <section className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 py-4 md:py-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-4xl md:text-5xl uppercase tracking-wide text-gray-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Top Seller
          </h2>
          <p className="text-gray-500 text-sm mt-1">Die WM 2026 Trikots der grössten Nationen</p>
        </div>
        <span className="text-xs font-bold bg-[var(--gold)]/20 text-[var(--gold)] px-3 py-1.5 rounded-full uppercase tracking-wider">
          WM 2026
        </span>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => { setTimeout(() => setPaused(false), 2000); }}
        className="flex gap-3 overflow-x-auto hide-sb pb-2 -mx-4 px-4 md:-mx-8 md:px-8 xl:-mx-12 xl:px-12 2xl:-mx-16 2xl:px-16"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {items.map((deal, i) => (
          <DealCard key={`${deal.handle}-${i}`} deal={deal} />
        ))}
      </div>
    </section>
  );
}
