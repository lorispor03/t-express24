'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, bundleDiscount, finalPrice, activeBundle, bundleProgress, loaded } = useCart();

  const [vorname, setVorname] = useState('Max');
  const [nachname, setNachname] = useState('Muster');
  const [email, setEmail] = useState('max@test.ch');
  const [telefon, setTelefon] = useState('+41 79 123 45 67');
  const [strasse, setStrasse] = useState('Bahnhofstrasse 10');
  const [plz, setPlz] = useState('8001');
  const [ort, setOrt] = useState('Zürich');
  const [land, setLand] = useState('Schweiz');
  const [nachricht, setNachricht] = useState('');
  const [zahlungsart, setZahlungsart] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!loaded) {
    return (
      <>
        <Header />
        <section className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-400">Warenkorb wird geladen...</p>
        </section>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <section className="max-w-3xl mx-auto px-4 py-20 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <h1 className="text-2xl font-bold mb-2">Dein Warenkorb ist leer</h1>
          <p className="text-gray-400 mb-6">Füge zuerst Trikots hinzu, bevor du zur Kasse gehst.</p>
          <Link href="/" className="inline-block bg-[var(--red-main)] hover:bg-[#a81d27] text-white font-bold py-3 px-8 rounded-lg text-sm transition-colors">
            Weiter shoppen
          </Link>
        </section>
        <Footer />
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vorname.trim() || !nachname.trim() || !email.trim() || !telefon.trim() || !strasse.trim() || !plz.trim() || !ort.trim() || !zahlungsart) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kunde: {
            vorname: vorname.trim(),
            nachname: nachname.trim(),
            email: email.trim(),
            telefon: telefon.trim(),
          },
          lieferadresse: {
            strasse: strasse.trim(),
            plz: plz.trim(),
            ort: ort.trim(),
            land: land,
          },
          zahlungsart,
          nachricht: nachricht.trim(),
          bundle: activeBundle,
          bundleDiscount,
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

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fehler beim Erstellen der Zahlung');

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'Zahlung konnte nicht gestartet werden. Bitte versuche es erneut.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        <div className="relative max-w-7xl mx-auto px-4 py-6 md:py-8">
          <Link href="/" className="flex items-center gap-2 text-base md:text-sm text-gray-400 hover:text-white transition-colors mb-3 py-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Zurück zum Shop
          </Link>
          <h1 className="text-2xl md:text-6xl font-black uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Bestellung abschliessen
          </h1>
          <p className="text-gray-400 mt-1 text-sm">{totalItems} {totalItems === 1 ? 'Artikel' : 'Artikel'} im Warenkorb</p>
          <img src="/logo.png" alt="T-EXPRESS24" className="absolute right-4 md:right-8 top-1/2 -translate-y-[45%] h-[50%] md:h-[110%] object-contain" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Items */}
          <div className="lg:col-span-2 space-y-3">
            {bundleDiscount > 0 && (
              <div className="bg-green-500/10 rounded-xl px-4 py-3 border border-green-500/20 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <div>
                  <span className="text-sm font-bold text-green-400">Bundle-Rabatt {activeBundle === '3plus' ? '15%' : '20%'} aktiv</span>
                  <p className="text-xs text-gray-400">Du sparst CHF {bundleDiscount.toFixed(2)} auf diese Bestellung</p>
                </div>
              </div>
            )}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Deine Artikel</h2>
            {items.map(item => (
              <div key={item.id} className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 flex gap-4">
                <img src={item.product.i} alt={item.product.t} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 line-clamp-2 leading-tight">{item.product.t}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.teamName}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
                    <span>Grösse: <span className="text-white">{item.size}</span></span>
                    <span>Menge: <span className="text-white">{item.quantity}</span></span>
                  </div>
                  {(item.flockingName || item.flockingNumber) && (
                    <p className="text-xs text-gray-400 mt-1">
                      Aufdruck: <span className="text-white">{[item.flockingName, item.flockingNumber].filter(Boolean).join(' ')}</span>
                    </p>
                  )}
                  {item.patches && item.patches.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.patches.map(p => (
                        <span key={p.id} className="inline-flex items-center gap-1 text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded">
                          <img src={p.image} alt={p.name} className="w-3.5 h-3.5 object-contain" />
                          {p.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.extraOption && item.extraOption !== 'none' && (
                    <p className="text-[10px] text-[var(--gold)] mt-1.5">
                      {item.extraOption === 'komplett' ? 'Komplett-Paket' : item.extraOption === 'aufdruck' ? 'Aufdruck' : 'Patches'} (+CHF {(item.extraPrice || 0).toFixed(2)})
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  {(() => {
                    const itemTotal = (parseFloat(item.product.p) + (item.extraPrice || 0)) * item.quantity;
                    const discount = bundleDiscount > 0 && activeBundle ? (activeBundle === '3plus' ? 0.15 : 0.20) : 0;
                    const jerseyDisc = parseFloat(item.product.p) * item.quantity * discount;
                    const discountedTotal = itemTotal - jerseyDisc;
                    return discount > 0 ? (
                      <>
                        <span className="text-sm text-gray-500 line-through block">CHF {itemTotal.toFixed(2)}</span>
                        <span className="text-sm font-bold text-green-400">CHF {discountedTotal.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-[var(--gold)]">CHF {itemTotal.toFixed(2)}</span>
                    );
                  })()}
                </div>
              </div>
            ))}

          </div>

          {/* Right: Form + Summary */}
          <div className="space-y-6">
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Persönliche Daten */}
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5 space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Persönliche Daten</h2>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-300">Vorname *</label>
                    <input
                      type="text"
                      value={vorname}
                      onChange={e => setVorname(e.target.value)}
                      required
                      placeholder="Max"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-300">Nachname *</label>
                    <input
                      type="text"
                      value={nachname}
                      onChange={e => setNachname(e.target.value)}
                      required
                      placeholder="Muster"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">E-Mail *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="deine@email.ch"
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">Telefon *</label>
                  <input
                    type="tel"
                    value={telefon}
                    onChange={e => setTelefon(e.target.value)}
                    required
                    placeholder="+41 00 000 00 00"
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)] transition-colors"
                  />
                </div>
              </div>

              {/* Lieferadresse */}
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5 space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Lieferadresse</h2>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">Strasse & Nr. *</label>
                  <input
                    type="text"
                    value={strasse}
                    onChange={e => setStrasse(e.target.value)}
                    required
                    placeholder="Musterstrasse 12"
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr] gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-300">PLZ *</label>
                    <input
                      type="text"
                      value={plz}
                      onChange={e => setPlz(e.target.value)}
                      required
                      placeholder="8000"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-300">Ort *</label>
                    <input
                      type="text"
                      value={ort}
                      onChange={e => setOrt(e.target.value)}
                      required
                      placeholder="Zürich"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">Land *</label>
                  <select
                    value={land}
                    onChange={e => setLand(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)] transition-colors appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                  >
                    <option value="Schweiz">Schweiz</option>
                  </select>
                </div>
              </div>

              {/* Zahlungsart */}
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5 space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Zahlungsart</h2>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setZahlungsart('kreditkarte')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all ${zahlungsart === 'kreditkarte' ? 'border-[var(--red-main)] bg-[var(--red-main)]/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  >
                    <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                    <span className="text-xs text-gray-300 font-medium">Kreditkarte</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setZahlungsart('twint')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all ${zahlungsart === 'twint' ? 'border-[var(--red-main)] bg-[var(--red-main)]/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  >
                    <img src="/twint-logo.png" alt="TWINT" className="h-7 w-auto" />
                    <span className="text-xs text-gray-300 font-medium">TWINT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setZahlungsart('paypal')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all ${zahlungsart === 'paypal' ? 'border-[var(--red-main)] bg-[var(--red-main)]/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  >
                    <img src="/paypal-logo.png" alt="PayPal" className="h-7 w-7 rounded" />
                    <span className="text-xs text-gray-300 font-medium">PayPal</span>
                  </button>
                </div>
              </div>

              {/* Nachricht */}
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5 space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Anmerkungen</h2>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-300">Nachricht (optional)</label>
                  <textarea
                    value={nachricht}
                    onChange={e => setNachricht(e.target.value)}
                    placeholder="Spezielle Wünsche, Fragen..."
                    rows={3}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red-main)] resize-none transition-colors"
                  />
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5 space-y-3">
                <h2 className="text-lg font-bold uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Zusammenfassung</h2>

                {activeBundle && !bundleProgress.reached && (
                  <div className="bg-[var(--gold)]/10 rounded-lg px-3 py-2 text-xs">
                    <div className="flex items-center justify-between text-[var(--gold)] font-semibold mb-1">
                      <span>Bundle {activeBundle === '3plus' ? '15%' : '20%'}</span>
                      <span>{bundleProgress.current}/{bundleProgress.target} Trikots</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--gold)] rounded-full transition-all" style={{ width: `${Math.min(100, (bundleProgress.current / bundleProgress.target) * 100)}%` }} />
                    </div>
                    <p className="text-gray-400 mt-1">Noch {bundleProgress.remaining} {bundleProgress.remaining === 1 ? 'Trikot' : 'Trikots'} bis zum Rabatt</p>
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

                <div className="flex justify-between text-sm text-gray-400">
                  <span>Zwischensumme ({totalItems} Artikel)</span>
                  <span>CHF {totalPrice.toFixed(2)}</span>
                </div>
                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Bundle-Rabatt</span>
                    <span>-CHF {bundleDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-[var(--gold)]">CHF {finalPrice.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-4 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !vorname.trim() || !nachname.trim() || !email.trim() || !telefon.trim() || !strasse.trim() || !plz.trim() || !ort.trim() || !zahlungsart}
                className="w-full bg-[var(--red-main)] hover:bg-[#a81d27] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg text-sm transition-colors"
              >
                {submitting ? 'Weiterleitung zur Zahlung...' : `Jetzt bezahlen — CHF ${finalPrice.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
