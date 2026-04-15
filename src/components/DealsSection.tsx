'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

const DEALS = [
  // Legendäre Trikots — durchmischt, keine Mannschaft doppelt hintereinander
  { title: 'Man United 98/99 – Treble', team: 'Manchester United', handle: 'retro-camisa-manchester-united-1998-99-home-red', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20241225/6B70A3B2-5CDC-B368-67E8-C3352719EAC6.jpg' },
  { title: 'Brasilien 2002 – WM Sieger', team: 'Brasilien', handle: 'retro-camisa-brazil-2002-world-cup-home-masculina-yellow', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20241225/7C9EFFFC-7838-3187-57E8-E9B2947CC105.jpg' },
  { title: 'Barcelona 08/09 – Sextuple', team: 'FC Barcelona', handle: 'retro-08-09-barcelona-ucl-final-home-size-s-xxl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20240104/42615987-C07A-648C-B8E8-010DD3F03D62.jpeg' },
  { title: 'Italien 2006 – WM Sieger', team: 'Italien', handle: 'retro-camisa-italy-2006-home-blue', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20241225/A5F1472C-9EDC-7DBD-64BF-513DD30619DA.jpg' },
  { title: 'AC Milan 06/07 – CL Sieger', team: 'AC Milan', handle: 'retro-camisa-ac-milan-2006-07-home-long-sleeve', price: 59.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250103/615648b458576cd9cd576cb6cd46a235.jpg' },
  { title: 'Argentinien 1986 – Maradona', team: 'Argentinien', handle: 'argentina-1986-home-jersey-s-xxl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250511/dfcb25c0544f11ed9bab7674b1da10fc.png' },
  { title: 'Real Madrid 13/14 – La Décima', team: 'Real Madrid', handle: 'retro-camisa-real-madrid-13-14-home-white', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20241225/8270347B-3E84-6D42-53F2-7B97FDD2776D.jpg' },
  { title: 'Frankreich 1998 – WM Sieger', team: 'Frankreich', handle: '1998-france-home-jersey-size-s-xxl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20241226/aefde889a987d6a133f4f1c4bc880820.png' },
  { title: 'Inter Mailand 09/10 – Treble', team: 'Inter Mailand', handle: 'retro-inter-milan-09-10-home-s-xxl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250808/01c78857e0a4549fd0a1ac9685565836.png' },
  { title: 'Deutschland 2014 – WM Sieger', team: 'Deutschland', handle: 'retro-germany-2014-home-s-xxl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250510/837ccf9c3e353b935860966ae4089d10.jpg' },
  { title: 'Bayern 12/13 – Treble', team: 'Bayern München', handle: 'retro-bayern-munich-12-13-home-s-xxl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250519/81f69d61b0a5d8d5659fc96631fd47e1.png' },
  { title: 'Spanien 2010 – WM Sieger', team: 'Spanien', handle: 'retro-camisa-spain-2010-home-red', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20241225/7373C3A4-308E-3EC1-208F-21481E50AA14.jpg' },
  { title: 'Liverpool 04/05 – Istanbul', team: 'Liverpool', handle: 'retro-04-05-liverpool-home-final-kit-size-s-xxl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20241225/F8784069-41B7-395A-D305-8D81E7C5548F.jpg' },
  { title: 'Man United 07/08 – CL Sieger', team: 'Manchester United', handle: 'retro-camisa-manchester-united-07-08-home-red', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20241225/0B191980-B650-7ECE-C21C-BE85DB9D0339.jpg' },
  { title: 'Chelsea 11/12 – CL Sieger', team: 'Chelsea', handle: 'retro-chelsea-2011-12-home-champions-league-long-sleeves', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250515/c24ca94be624294bd6cdde1889f20e52.jpg' },
  { title: 'Arsenal 03/04 – Invincibles', team: 'Arsenal', handle: 'retro-2002-04-arsenal-home-s-xxl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250504/2F722E61-3592-AAF7-1F9B-CFD408F8F7CE.jpg' },
  { title: 'Juventus 95/96 – CL Sieger', team: 'Juventus Turin', handle: 'retro-juventus-1995-97-home-s-xxl', price: 49.90, image: 'https://img.wpassets-gamma.com/uploads/71478/cart/resources/20250518/13db2286c2c06a1fbea82e589f1e4a5b.jpg' },
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
    <section className="max-w-[1440px] mx-auto px-4 py-4 md:py-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-4xl md:text-5xl uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
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
