'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart, BUNDLE_CONFIG } from '@/context/CartContext';

export default function CartDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const isCheckout = pathname.startsWith('/checkout');
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, bundleDiscount, finalPrice, isCartOpen, setCartOpen, activeBundle, setActiveBundle, bundleProgress } = useCart();

  // Block cart drawer on checkout page
  useEffect(() => {
    if (isCheckout && isCartOpen) setCartOpen(false);
  }, [isCheckout, isCartOpen, setCartOpen]);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [hintType, setHintType] = useState<null | 'no-bundle' | 'upgrade' | 'downgrade' | 'not-reached'>(null);

  useEffect(() => {
    if (isCartOpen) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
    } else {
      setAnimating(false);
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isCartOpen]);

  if (!visible) return null;

  const handleClose = () => setCartOpen(false);

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${animating ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white border-l border-gray-200 flex flex-col transition-transform duration-300 ease-out ${animating ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">Warenkorb ({totalItems})</h2>
          <button onClick={handleClose} className="p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <p className="text-sm">Dein Warenkorb ist leer</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-[#d0d0d0] rounded-lg p-3 border border-gray-300">
                  <div className="flex gap-3">
                    <img src={item.product.i} alt={item.product.t} className="w-16 h-16 object-cover rounded-md flex-shrink-0" loading="lazy" decoding="async" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-tight">{item.product.t}</p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Grösse: {item.size}{(item.flockingName || item.flockingNumber) && ` · Aufdruck: ${[item.flockingName, item.flockingNumber].filter(Boolean).join(' ')}`}
                      </p>
                      <p className="text-[10px] text-gray-500">{item.teamName}</p>
                      {item.extraOption && item.extraOption !== 'none' && (
                        <p className="text-[10px] text-[var(--gold)] mt-0.5">
                          {item.extraOption === 'komplett' ? 'Komplett-Paket' : item.extraOption === 'aufdruck' ? 'Aufdruck' : 'Patches'} +CHF {(item.extraPrice || 0).toFixed(2)}
                        </p>
                      )}
                      {item.patches && item.patches.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.patches.map(p => (
                            <span key={p.id} className="inline-flex items-center gap-1 text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                              <img src={p.image} alt={p.name} className="w-3 h-3 object-contain" />
                              {p.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-400 p-1 self-start">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-400">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-[var(--red-main)]/20 hover:bg-[var(--red-main)]/30 text-[var(--red-main)] flex items-center justify-center text-xs font-medium"
                      >-</button>
                      <span className="text-sm font-medium w-6 text-center text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-[var(--red-main)]/20 hover:bg-[var(--red-main)]/30 text-[var(--red-main)] flex items-center justify-center text-xs font-medium"
                      >+</button>
                    </div>
                    {(() => {
                      const itemTotal = (parseFloat(item.product.p) + (item.extraPrice || 0)) * item.quantity;
                      const discount = bundleProgress.reached && activeBundle ? BUNDLE_CONFIG[activeBundle].discount : 0;
                      const jerseyDiscount = parseFloat(item.product.p) * item.quantity * discount;
                      const discountedTotal = itemTotal - jerseyDiscount;
                      return discount > 0 ? (
                        <span className="text-right">
                          <span className="text-sm text-gray-500 line-through block">CHF {itemTotal.toFixed(2)}</span>
                          <span className="text-sm font-bold text-green-400">CHF {discountedTotal.toFixed(2)}</span>
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-[var(--gold)]">CHF {itemTotal.toFixed(2)}</span>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-200 space-y-3">
            {/* Bundle progress */}
            {activeBundle && !bundleProgress.reached && (
              <div className="bg-[var(--gold)]/10 rounded-lg px-3 py-2 text-xs">
                <div className="flex items-center justify-between text-[var(--gold)] font-semibold mb-1">
                  <span>Bundle {activeBundle === '3plus' ? '15%' : activeBundle === '6plus' ? '20%' : '30%'}</span>
                  <span>{bundleProgress.current}/{bundleProgress.target} Trikots</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--gold)] rounded-full transition-all" style={{ width: `${Math.min(100, (bundleProgress.current / bundleProgress.target) * 100)}%` }} />
                </div>
                <p className="text-gray-500 mt-1">Noch {bundleProgress.remaining} {bundleProgress.remaining === 1 ? 'Trikot' : 'Trikots'} bis zum Rabatt</p>
              </div>
            )}
            {bundleDiscount > 0 && (
              <div className="bg-green-500/10 rounded-lg px-3 py-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-semibold flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    Bundle-Rabatt aktiv
                  </span>
                  <span className="text-green-400 font-bold">-CHF {bundleDiscount.toFixed(2)}</span>
                </div>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-500">
              <span>Zwischensumme</span>
              <span>CHF {totalPrice.toFixed(2)}</span>
            </div>
            {bundleDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Bundle-Rabatt</span>
                <span>-CHF {bundleDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold pt-1 border-t border-gray-200">
              <span>Total</span>
              <span className="text-[var(--gold)]">CHF {finalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                // Kein Bundle aktiv, aber genug Trikots → Bundle vorschlagen
                if (!activeBundle && totalItems >= 3) {
                  setHintType('no-bundle');
                  return;
                }
                // 3plus aktiv, aber 6+ Trikots → Upgrade-Hinweis
                if (activeBundle === '3plus' && totalItems >= 6) {
                  setHintType('upgrade');
                  return;
                }
                // 6plus aktiv, aber nur 3-5 Trikots → Downgrade auf 3plus vorschlagen
                if (activeBundle === '6plus' && totalItems >= 3 && totalItems < 6) {
                  setHintType('downgrade');
                  return;
                }
                // Bundle aktiv, aber Mindestanzahl nicht erreicht → Warnung
                if (activeBundle && !bundleProgress.reached) {
                  setHintType('not-reached');
                  return;
                }
                setCartOpen(false);
                router.push('/checkout');
              }}
              className="w-full bg-[var(--red-main)] hover:bg-[#a81d27] text-white font-bold py-3 rounded-lg text-sm transition-colors"
            >
              Zur Kasse
            </button>
            <button
              onClick={clearCart}
              className="w-full text-gray-500 hover:text-gray-700 text-xs py-1 transition-colors"
            >
              Warenkorb leeren
            </button>
          </div>
        )}
      </div>

      {/* Bundle-Hinweis Dialoge */}
      {hintType && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[9998]" />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <div className="bg-white border border-gray-200 rounded-2xl px-6 py-8 max-w-sm w-full text-center shadow-2xl">
              {(() => {
                const jerseyTotal = items.reduce((sum, i) => sum + parseFloat(i.product.p) * i.quantity, 0);

                // Kein Bundle aktiv → Bundle vorschlagen
                if (hintType === 'no-bundle') {
                  const bestBundle = totalItems >= 6 ? '6plus' : '3plus';
                  const discount = totalItems >= 6 ? '20%' : '15%';
                  const saving = jerseyTotal * (totalItems >= 6 ? 0.20 : 0.15);
                  return (
                    <>
                      <div className="w-14 h-14 bg-[var(--gold)]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-black text-[var(--gold)]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{discount}</span>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-2">Bundle-Rabatt verfügbar!</h2>
                      <p className="text-sm text-gray-600 mb-6">
                        Du hast {totalItems} Trikots im Warenkorb. Mit dem Bundle sparst du <span className="text-[var(--gold)] font-bold">{discount}</span> auf jedes Trikot — das sind <span className="text-[var(--gold)] font-bold">CHF {saving.toFixed(2)}</span> Ersparnis!
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setHintType(null); setCartOpen(false); router.push('/checkout'); }}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold px-4 py-3 rounded-lg transition-colors border border-gray-200"
                        >
                          Ohne fortfahren
                        </button>
                        <button
                          onClick={() => { setHintType(null); setActiveBundle(bestBundle); setCartOpen(false); router.push('/checkout'); }}
                          className="flex-1 bg-[#3a3020] text-[var(--gold)] text-sm font-bold px-4 py-3 rounded-lg transition-colors border border-[var(--gold)]/30 hover:border-[var(--gold)]/60 shadow-[0_0_15px_rgba(184,154,80,0.15)]"
                        >
                          {discount} sparen & zur Kasse
                        </button>
                      </div>
                    </>
                  );
                }

                // 3plus aktiv, 6+ Trikots → Upgrade auf 6plus
                if (hintType === 'upgrade') {
                  const currentSaving = jerseyTotal * 0.15;
                  const upgradeSaving = jerseyTotal * 0.20;
                  const extraSaving = upgradeSaving - currentSaving;
                  return (
                    <>
                      <div className="w-14 h-14 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-2">Upgrade auf 20%!</h2>
                      <p className="text-sm text-gray-600 mb-6">
                        Du hast {totalItems} Trikots — dein Bundle wird automatisch auf <span className="text-[var(--gold)] font-bold">20% statt 15%</span> angehoben. Das sind <span className="text-[var(--gold)] font-bold">CHF {extraSaving.toFixed(2)}</span> extra Ersparnis!
                      </p>
                      <button
                        onClick={() => { setHintType(null); setActiveBundle('6plus'); setCartOpen(false); router.push('/checkout'); }}
                        className="w-full bg-[#3a3020] text-[var(--gold)] text-sm font-bold px-4 py-3 rounded-lg transition-colors border border-[var(--gold)]/30 hover:border-[var(--gold)]/60 shadow-[0_0_15px_rgba(184,154,80,0.15)]"
                      >
                        Mit 20% zur Kasse
                      </button>
                    </>
                  );
                }

                // 6plus aktiv, 3-5 Trikots → Downgrade auf 3plus
                if (hintType === 'downgrade') {
                  const saving3plus = jerseyTotal * 0.15;
                  return (
                    <>
                      <div className="w-14 h-14 bg-[var(--gold)]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-black text-[var(--gold)]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>15%</span>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-2">6er Bundle nicht erreicht</h2>
                      <p className="text-sm text-gray-600 mb-6">
                        Du hast {totalItems} von 6 Trikots. Der 20%-Rabatt greift noch nicht. Wechsle zum <span className="text-[var(--gold)] font-bold">3er Bundle</span> und spare trotzdem <span className="text-[var(--gold)] font-bold">CHF {saving3plus.toFixed(2)}</span>!
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setHintType(null); setCartOpen(false); router.push('/checkout'); }}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold px-4 py-3 rounded-lg transition-colors border border-gray-200"
                        >
                          Ohne Rabatt fortfahren
                        </button>
                        <button
                          onClick={() => { setHintType(null); setActiveBundle('3plus'); setCartOpen(false); router.push('/checkout'); }}
                          className="flex-1 bg-[#3a3020] text-[var(--gold)] text-sm font-bold px-4 py-3 rounded-lg transition-colors border border-[var(--gold)]/30 hover:border-[var(--gold)]/60 shadow-[0_0_15px_rgba(184,154,80,0.15)]"
                        >
                          15% sparen & zur Kasse
                        </button>
                      </div>
                    </>
                  );
                }

                // Bundle aktiv, Mindestanzahl nicht erreicht (< 3 Trikots)
                if (hintType === 'not-reached') {
                  const config = BUNDLE_CONFIG[activeBundle!];
                  return (
                    <>
                      <div className="w-14 h-14 bg-[var(--red-main)]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-[var(--red-main)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-2">Rabatt noch nicht aktiv</h2>
                      <p className="text-sm text-gray-600 mb-6">
                        Du hast {totalItems} von {config.min} Trikots. Noch <span className="text-[var(--gold)] font-bold">{bundleProgress.remaining} {bundleProgress.remaining === 1 ? 'Trikot' : 'Trikots'}</span> bis zum {config.label}-Rabatt. Ohne Rabatt bestellen?
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setHintType(null); setCartOpen(false); router.push('/checkout'); }}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold px-4 py-3 rounded-lg transition-colors border border-gray-200"
                        >
                          Ohne Rabatt bestellen
                        </button>
                        <button
                          onClick={() => { setHintType(null); setCartOpen(false); router.push('/#ligen'); }}
                          className="flex-1 bg-[#3a3020] text-[var(--gold)] text-sm font-bold px-4 py-3 rounded-lg transition-colors border border-[var(--gold)]/30 hover:border-[var(--gold)]/60 shadow-[0_0_15px_rgba(184,154,80,0.15)]"
                        >
                          Weiter shoppen
                        </button>
                      </div>
                    </>
                  );
                }

                return null;
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
