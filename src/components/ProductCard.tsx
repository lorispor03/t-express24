'use client';

import { Product, CATEGORIES } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  teamName: string;
}

export default function ProductCard({ product, teamName }: ProductCardProps) {
  const telegramUrl = `https://t.me/BOT_USERNAME?text=${encodeURIComponent(`Hallo, ich möchte bestellen:\n\n${product.t}\nPreis: CHF ${product.p}\n\nBitte um Infos zu Grössen und Verfügbarkeit.`)}`;
  const instagramUrl = 'https://instagram.com/t_express24';

  return (
    <div className="product-card group bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 hover:border-[var(--red-main)]/30 transition-all">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#222]">
        <img src={product.i} alt={product.t} className="main-img absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <img src={product.hi} alt={product.t} className="hover-img absolute inset-0 w-full h-full object-cover" loading="lazy" />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-xs font-medium text-gray-300 line-clamp-2 leading-tight mb-2 min-h-[2rem]">{product.t}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[var(--gold)] font-bold text-sm">CHF {product.p}</span>
        </div>
        {/* Order buttons */}
        <div className="flex gap-1.5">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 text-[10px] bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-2 py-1.5 rounded-md font-semibold transition-all"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            Instagram
          </a>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 text-[10px] bg-[#2AABEE] hover:bg-[#229ED9] text-white px-2 py-1.5 rounded-md font-semibold transition-colors"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Telegram
          </a>
        </div>
        {/* Category tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {product.c.map(cat => (
            <span key={cat} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{CATEGORIES[cat] || cat}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
