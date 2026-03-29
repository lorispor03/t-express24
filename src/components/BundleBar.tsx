'use client';

import { useCart, BUNDLE_CONFIG } from '@/context/CartContext';
import Link from 'next/link';

export default function BundleBar() {
  const { activeBundle, setActiveBundle, bundleProgress, setCartOpen } = useCart();

  if (!activeBundle) return null;

  const config = BUNDLE_CONFIG[activeBundle];
  const progressPercent = Math.min(100, (bundleProgress.current / bundleProgress.target) * 100);

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 safe-area-bottom ${bundleProgress.reached ? 'bg-gradient-to-r from-green-900/90 via-green-800/90 to-green-900/90 border-t-2 border-green-400/50' : 'bg-gradient-to-r from-[#1a1000]/95 via-[#1a1500]/95 to-[#1a1000]/95 border-t-2 border-[var(--gold)]/50'}`} style={{ backdropFilter: 'blur(12px)' }}>
      <div className="max-w-7xl mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Icon + Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${bundleProgress.reached ? 'bg-green-400/20' : 'bg-[var(--gold)]/20'}`}>
              {bundleProgress.reached ? (
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              ) : (
                <span className="text-lg font-black text-[var(--gold)]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{config.label}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {bundleProgress.reached ? 'Rabatt aktiv!' : `Bundle ${config.label}`}
                </span>
                {!bundleProgress.reached && (
                  <span className="text-xs text-[var(--gold)] font-semibold">
                    — noch {bundleProgress.remaining} {bundleProgress.remaining === 1 ? 'Trikot' : 'Trikots'}
                  </span>
                )}
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-1.5 relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 relative overflow-hidden ${bundleProgress.reached ? 'bg-green-400' : 'bg-[var(--gold)]'}`}
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bundle-shimmer" />
                </div>
                {progressPercent > 0 && progressPercent < 100 && (
                  <div className="absolute top-1/2 -translate-y-1/2 bundle-spark" style={{ left: `${progressPercent}%` }}>
                    <div className="w-3 h-3 -ml-1.5 rounded-full bg-[var(--gold)] bundle-spark-glow" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white" />
                  </div>
                )}
              </div>
              <span className="text-[11px] text-gray-400 mt-0.5 block">{bundleProgress.current} / {bundleProgress.target} Trikots</span>
            </div>
          </div>

          {/* Right: Action + Close */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {bundleProgress.reached ? (
              <button
                onClick={() => setCartOpen(true)}
                className="bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-green-400 transition-colors"
              >
                Warenkorb
              </button>
            ) : (
              <Link
                href="/#ligen"
                className="bg-[var(--gold)] text-black text-xs font-bold px-4 py-2 rounded-full hover:scale-105 transition-transform"
              >
                Trikots wählen
              </Link>
            )}
            <button
              onClick={() => setActiveBundle(null)}
              className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Bundle abbrechen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
