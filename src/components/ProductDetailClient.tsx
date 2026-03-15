'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, CATEGORIES } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { getPatchesForTeam, PatchOption } from '@/lib/patches';

interface Props {
  product: Product;
  teamId: string;
  teamName: string;
  leagueName: string;
  leagueSlug: string;
  subLeague?: string;
}

const SIZES_ADULT = ['S', 'M', 'L', 'XL', 'XXL'];
const SIZES_KIDS = ['116', '128', '140', '152', '164'];

export default function ProductDetailClient({ product, teamId, teamName, leagueName, leagueSlug, subLeague }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const [size, setSize] = useState('');
  const [flocking, setFlocking] = useState('');
  const [selectedPatches, setSelectedPatches] = useState<Set<string>>(new Set());
  const [added, setAdded] = useState(false);

  const isKids = product.c.includes('kids') || product.c.includes('kids-retro');
  const sizes = isKids ? SIZES_KIDS : SIZES_ADULT;

  const availablePatches = useMemo(
    () => getPatchesForTeam(leagueSlug, subLeague),
    [leagueSlug, subLeague]
  );

  const togglePatch = (patchId: string) => {
    setSelectedPatches(prev => {
      const next = new Set(prev);
      if (next.has(patchId)) next.delete(patchId);
      else next.add(patchId);
      return next;
    });
  };

  const patchTotal = useMemo(() => {
    return availablePatches
      .filter(p => selectedPatches.has(p.id))
      .reduce((sum, p) => sum + p.price, 0);
  }, [availablePatches, selectedPatches]);

  const totalPrice = parseFloat(product.p) + patchTotal;

  const handleAdd = () => {
    if (!size) return;
    const patches = availablePatches.filter(p => selectedPatches.has(p.id));
    addItem(product, teamName, size, flocking.trim(), patches);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8 group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Zurück
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5">
          <img
            src={product.i}
            alt={product.t}
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* Category tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {product.c.map(cat => (
              <span key={cat} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-400 uppercase tracking-wide">
                {CATEGORIES[cat] || cat}
              </span>
            ))}
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] text-gray-600 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/league/${leagueSlug}`} className="hover:text-white transition-colors">{leagueName}</Link>
            <span>/</span>
            <Link href={`/team/${teamId}`} className="hover:text-white transition-colors">{teamName}</Link>
          </nav>

          <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-2">{product.t}</h1>
          <p className="text-sm text-gray-500 mb-4">{teamName}</p>
          <p className="text-2xl font-bold text-[var(--gold)] mb-6">
            CHF {totalPrice.toFixed(2)}
            {patchTotal > 0 && (
              <span className="text-sm text-gray-500 font-normal ml-2">
                (inkl. {selectedPatches.size} {selectedPatches.size === 1 ? 'Patch' : 'Patches'})
              </span>
            )}
          </p>

          {/* Size Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-3">
              Grösse wählen {isKids && <span className="text-gray-500">(Kinder)</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    size === s
                      ? 'bg-[var(--red-main)] border-[var(--red-main)] text-white'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Patches */}
          {availablePatches.length > 0 && (
            <div className="mb-5">
              <label className="block text-sm font-medium mb-3">
                Patches <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availablePatches.map(patch => {
                  const isSelected = selectedPatches.has(patch.id);
                  return (
                    <button
                      key={patch.id}
                      onClick={() => togglePatch(patch.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                        isSelected
                          ? 'bg-[var(--red-main)]/10 border-[var(--red-main)]/50'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={patch.image}
                          alt={patch.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                          {patch.name}
                        </p>
                        <p className="text-[10px] text-gray-500">+CHF {patch.price.toFixed(2)}</p>
                      </div>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-[var(--red-main)] border-[var(--red-main)]'
                          : 'border-white/20'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Flocking */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Aufdruck (optional)</label>
            <input
              type="text"
              value={flocking}
              onChange={e => setFlocking(e.target.value)}
              placeholder="z.B. Ronaldo 7"
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)] transition-colors"
            />
            <p className="text-[11px] text-gray-600 mt-1">Name und/oder Nummer für den Aufdruck</p>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            disabled={!size}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-[var(--red-main)] hover:bg-[#a81d27] text-white disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {added ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Hinzugefügt!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                In den Warenkorb — CHF {totalPrice.toFixed(2)}
              </>
            )}
          </button>

          {!size && (
            <p className="text-xs text-gray-500 mt-2 text-center">Bitte wähle zuerst eine Grösse</p>
          )}

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded-lg p-3">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Wird qualitätsgeprüft
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded-lg p-3">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Gratis Ersatzversand
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
