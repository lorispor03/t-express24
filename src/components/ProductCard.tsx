'use client';

import Image from 'next/image';
import { Product, CATEGORIES } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  teamName: string;
}

export default function ProductCard({ product, teamName }: ProductCardProps) {
  const orderUrl = `https://wa.me/41XXXXXXXXX?text=${encodeURIComponent(`Hallo, ich möchte bestellen:\n\n${product.t}\nPreis: CHF ${product.p}\n\nBitte um Infos zu Grössen und Verfügbarkeit.`)}`;

  return (
    <div className="product-card group bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 hover:border-[var(--red-main)]/30 transition-all">
      {/* Image container */}
      <a href={orderUrl} target="_blank" rel="noopener noreferrer" className="block relative aspect-square overflow-hidden bg-[#222]">
        <img
          src={product.i}
          alt={product.t}
          className="main-img absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <img
          src={product.hi}
          alt={product.t}
          className="hover-img absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </a>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-xs font-medium text-gray-300 line-clamp-2 leading-tight mb-2 min-h-[2rem]">
          {product.t}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-[var(--gold)] font-bold text-sm">CHF {product.p}</span>
          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] bg-[var(--red-main)] hover:bg-[var(--red-dark)] text-white px-2.5 py-1 rounded-md font-semibold transition-colors"
          >
            Bestellen
          </a>
        </div>
        {/* Category tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {product.c.map(cat => (
            <span key={cat} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
              {CATEGORIES[cat] || cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
