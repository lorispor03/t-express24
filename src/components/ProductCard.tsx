'use client';

import Link from 'next/link';
import { Product, CATEGORIES } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  teamName: string;
}

export default function ProductCard({ product, teamName }: ProductCardProps) {
  return (
    <Link href={`/product/${product.h}`} className="product-card group bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 transition-all block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
        <img src={product.i} alt={product.t} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-xs font-medium text-gray-300 line-clamp-2 leading-tight mb-2 min-h-[2rem]">{product.t}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[var(--gold)] font-bold text-sm">CHF {product.p}</span>
        </div>
        {/* Category tags */}
        <div className="flex flex-wrap gap-1">
          {product.c.map(cat => (
            <span key={cat} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{CATEGORIES[cat] || cat}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
