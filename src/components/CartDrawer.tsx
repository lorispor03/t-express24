'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setCartOpen } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [nachricht, setNachricht] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isCartOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kunde_name: name.trim(),
          kunde_kontakt: contact.trim(),
          nachricht: nachricht.trim(),
          items: items.map(i => ({
            produkt_name: i.product.t,
            produkt_preis: i.product.p,
            team: i.teamName,
            groesse: i.size,
            beflockung_name: i.flockingName,
            beflockung_nummer: i.flockingNumber,
            patches: (i.patches || []).map(p => ({ name: p.name, preis: p.price })),
            extras: i.extraOption || 'none',
            extras_preis: i.extraPrice || 0,
            menge: i.quantity,
          })),
        }),
      });

      if (!res.ok) throw new Error('Fehler beim Senden');

      setSuccess(true);
      clearCart();
      setName('');
      setContact('');
      setNachricht('');
      setTimeout(() => {
        setSuccess(false);
        setShowCheckout(false);
        setCartOpen(false);
      }, 3000);
    } catch {
      setError('Bestellung konnte nicht gesendet werden. Bitte versuche es erneut.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={() => { setCartOpen(false); setShowCheckout(false); }} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#111] border-l border-white/10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="font-bold text-lg">
            {showCheckout ? 'Bestellung abschliessen' : `Warenkorb (${totalItems})`}
          </h2>
          <button onClick={() => { setCartOpen(false); setShowCheckout(false); }} className="p-2 hover:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Bestellung eingegangen!</h3>
              <p className="text-gray-400 text-sm">Wir melden uns in Kürze bei dir.</p>
            </div>
          </div>
        ) : showCheckout ? (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Order Summary */}
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-300">Zusammenfassung</h3>
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-xs text-gray-300 truncate">{item.product.t}</p>
                      <p className="text-[10px] text-gray-500">
                        {item.size}{(item.flockingName || item.flockingNumber) && ` · ${[item.flockingName, item.flockingNumber].filter(Boolean).join(' ')}`} · {item.quantity}x
                      </p>
                      {item.extraOption && item.extraOption !== 'none' && (
                        <p className="text-[10px] text-[var(--gold)]">
                          {item.extraOption === 'komplett' ? 'Komplett-Paket' : item.extraOption === 'aufdruck' ? 'Aufdruck' : 'Patches'}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-[var(--gold)] whitespace-nowrap">
                      CHF {((parseFloat(item.product.p) + (item.extraPrice || 0)) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-sm mt-3 pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-[var(--gold)]">CHF {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Dein Name"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Instagram / Telefon *</label>
                <input
                  type="text"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  required
                  placeholder="@dein_instagram oder Telefonnummer"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Nachricht (optional)</label>
                <textarea
                  value={nachricht}
                  onChange={e => setNachricht(e.target.value)}
                  placeholder="Spezielle Wünsche, Fragen..."
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)] resize-none"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-4 py-2">{error}</p>
              )}
            </div>

            {/* Submit */}
            <div className="p-5 border-t border-white/10 space-y-2">
              <button
                type="submit"
                disabled={submitting || !name.trim() || !contact.trim()}
                className="w-full bg-[var(--red-main)] hover:bg-[#a81d27] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-sm transition-colors"
              >
                {submitting ? 'Wird gesendet...' : `Bestellung absenden (CHF ${totalPrice.toFixed(2)})`}
              </button>
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors"
              >
                Zurück zum Warenkorb
              </button>
            </div>
          </form>
        ) : (
          /* Cart Items */
          <>
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
                    <div key={item.id} className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                      <div className="flex gap-3">
                        <img src={item.product.i} alt={item.product.t} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-300 line-clamp-2 leading-tight">{item.product.t}</p>
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
                                <span key={p.id} className="inline-flex items-center gap-1 text-[9px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded">
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
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs"
                          >-</button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs"
                          >+</button>
                        </div>
                        <span className="text-sm font-bold text-[var(--gold)]">
                          CHF {((parseFloat(item.product.p) + (item.extraPrice || 0)) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-white/10 space-y-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-[var(--gold)]">CHF {totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-[var(--red-main)] hover:bg-[#a81d27] text-white font-bold py-3 rounded-lg text-sm transition-colors"
                >
                  Zur Kasse
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-gray-500 hover:text-gray-300 text-xs py-1 transition-colors"
                >
                  Warenkorb leeren
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
