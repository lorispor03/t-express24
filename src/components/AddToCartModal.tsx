'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface AddToCartModalProps {
  product: Product;
  teamName: string;
  onClose: () => void;
}

const SIZES_ADULT = ['S', 'M', 'L', 'XL', 'XXL'];
const SIZES_KIDS = ['116', '128', '140', '152', '164'];

export default function AddToCartModal({ product, teamName, onClose }: AddToCartModalProps) {
  const { addItem } = useCart();
  const [size, setSize] = useState('');
  const [flockingName, setFlockingName] = useState('');
  const [flockingNumber, setFlockingNumber] = useState('');
  const [showFlocking, setShowFlocking] = useState(false);

  const isKids = product.c.includes('kids') || product.c.includes('kids-retro');
  const sizes = isKids ? SIZES_KIDS : SIZES_ADULT;

  const handleAdd = () => {
    if (!size) return;
    addItem(product, teamName, size, flockingName.trim(), flockingNumber.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-gray-200 w-full max-w-sm overflow-hidden">
        {/* Product Preview */}
        <div className="flex gap-3 p-4 border-b border-gray-200">
          <img src={product.i} alt={product.t} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">{product.t}</p>
            <p className="text-xs text-gray-500 mt-1">{teamName}</p>
            <p className="text-sm font-bold text-[var(--gold)] mt-1">CHF {product.p}</p>
          </div>
        </div>

        {/* Size Selection */}
        <div className="p-4">
          <label className="block text-sm font-medium mb-2">
            Grösse wählen
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  size === s
                    ? 'bg-[var(--red-main)] border-[var(--red-main)] text-white'
                    : 'bg-gray-100 border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {isKids ? s : s}
              </button>
            ))}
          </div>

          {/* Flocking Toggle */}
          <div className="mt-4">
            <button
              onClick={() => setShowFlocking(!showFlocking)}
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors"
            >
              <svg className={`w-4 h-4 transition-transform ${showFlocking ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Aufdruck (Name/Nummer)
            </button>
            {showFlocking && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={flockingName}
                  onChange={e => setFlockingName(e.target.value)}
                  placeholder="z.B. Ronaldo"
                  className="flex-1 bg-[#f0f0f0] border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-[var(--red-main)]"
                />
                <input
                  type="text"
                  value={flockingNumber}
                  onChange={e => setFlockingNumber(e.target.value)}
                  placeholder="z.B. 7"
                  className="w-20 bg-[#f0f0f0] border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-[var(--red-main)] text-center"
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 pt-0 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleAdd}
            disabled={!size}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-[var(--red-main)] hover:bg-[#a81d27] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            In den Warenkorb
          </button>
        </div>
      </div>
    </div>
  );
}
