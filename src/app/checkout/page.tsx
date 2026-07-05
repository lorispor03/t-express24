'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, bundleDiscount, finalPrice, activeBundle, bundleProgress, loaded, clearCart } = useCart();

  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [instagram, setInstagram] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [strasse, setStrasse] = useState('');
  const [plz, setPlz] = useState('');
  const [plzValid, setPlzValid] = useState(false);
  const [plzSuggestions, setPlzSuggestions] = useState<{ plz: string; name: string }[]>([]);
  const [showPlzDropdown, setShowPlzDropdown] = useState(false);
  const [ort, setOrt] = useState('');
  const [land, setLand] = useState('Schweiz');
  const [nachricht, setNachricht] = useState('');
  const [kontaktweg, setKontaktweg] = useState<'instagram' | 'email' | ''>('');
  const [zahlungsart, setZahlungsart] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!loaded) {
    return (
      <>
        <Header />
        <section className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-500">Warenkorb wird geladen...</p>
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
          <p className="text-gray-500 mb-6">Füge zuerst Trikots hinzu, bevor du zur Kasse gehst.</p>
          <Link href="/" className="inline-block bg-[var(--red-main)] hover:bg-[#a81d27] text-white font-bold py-3 px-8 rounded-lg text-sm transition-colors">
            Weiter shoppen
          </Link>
        </section>
        <Footer />
      </>
    );
  }

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  const searchPlz = async (query: string) => {
    if (query.length < 2) { setPlzSuggestions([]); setShowPlzDropdown(false); return; }
    try {
      const isNum = /^\d+$/.test(query);
      let url: string;
      if (isNum && query.length === 4) {
        url = `https://openplzapi.org/ch/Localities?postalCode=${query}&page=1&pageSize=10`;
      } else if (isNum) {
        url = `https://openplzapi.org/ch/Localities?postalCode=${query}00&page=1&pageSize=50`;
      } else {
        url = `https://openplzapi.org/ch/Localities?name=${encodeURIComponent(query)}&page=1&pageSize=10`;
      }
      const res = await fetch(url);
      if (!res.ok) return;
      let data = await res.json();
      if (isNum && query.length < 4) {
        data = data.filter((d: any) => d.postalCode.startsWith(query));
      }
      const seen = new Set<string>();
      const results: { plz: string; name: string }[] = [];
      for (const d of data) {
        const key = `${d.postalCode}-${d.name}`;
        if (!seen.has(key) && results.length < 10) { seen.add(key); results.push({ plz: d.postalCode, name: d.name }); }
      }
      setPlzSuggestions(results);
      setShowPlzDropdown(results.length > 0);
      if (isNum && query.length === 4 && results.length === 1) {
        setPlz(results[0].plz); setOrt(results[0].name); setPlzValid(true); setShowPlzDropdown(false);
      }
    } catch { /* ignore */ }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vorname.trim() || !nachname.trim() || !instagram.trim() || !email.trim() || !strasse.trim() || !plz.trim() || !ort.trim() || !kontaktweg) return;

    if (!validateEmail(email.trim())) {
      setError('Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }
    if (!plzValid || !ort) {
      setError('Bitte wähle eine gültige PLZ/Ortschaft aus der Liste.');
      return;
    }

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
            instagram: instagram.trim(),
            email: email.trim(),
            telefon: telefon.trim() ? `+41 ${telefon.trim()}` : '',
          },
          lieferadresse: {
            strasse: strasse.trim(),
            plz: plz.trim(),
            ort: ort.trim(),
            land: land,
          },
          zahlungsart,
          kontaktweg,
          nachricht: nachricht.trim(),
          bundle: activeBundle,
          bundleDiscount,
          items: items.map(i => ({
            produkt_name: i.product.t,
            produkt_preis: i.product.p,
            produkt_bild: i.product.i,
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

      // Warenkorb leeren und zur Erfolgsseite (replace verhindert "Zurück")
      clearCart();
      router.replace(data.url);
    } catch (err: any) {
      setError(err.message || 'Zahlung konnte nicht gestartet werden. Bitte versuche es erneut.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        <div className="relative max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 py-5 md:py-8">
          <Link href="/" className="flex items-center gap-2 text-base md:text-sm text-gray-400 hover:text-white transition-colors mb-3 py-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Zurück zum Shop
          </Link>
          <div className="flex items-center gap-5 min-h-[128px] sm:min-h-[144px]">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-3 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full text-[var(--red-main)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
                <circle cx="5.5" cy="15" r="0.5" fill="currentColor"/>
                <line x1="8" y1="15" x2="12" y2="15" strokeWidth={1.2}/>
                <circle cx="18.5" cy="7" r="1.5" strokeWidth={0.6}/>
                <circle cx="20" cy="7" r="1.5" strokeWidth={0.6}/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-6xl font-black uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Bestellung aufgeben
              </h1>
              <p className="text-gray-400 mt-1 text-sm">{totalItems} {totalItems === 1 ? 'Artikel' : 'Artikel'} im Warenkorb</p>
            </div>
          </div>
        </div>
      </section>

      <section>
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 py-8 md:py-12">
        <form onSubmit={handleSubmit}>
          {/* Titles row */}
          <div className="hidden lg:grid grid-cols-5 gap-8 mb-6">
            <h2 className="col-span-3 text-4xl md:text-5xl uppercase tracking-wide text-gray-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Deine Angaben</h2>
            <h2 className="col-span-2 text-4xl md:text-5xl uppercase tracking-wide text-gray-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Deine Artikel</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Left: Form */}
            <div className="lg:col-span-3 space-y-6">
              <h2 className="lg:hidden text-4xl md:text-5xl uppercase tracking-wide text-gray-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Deine Angaben</h2>
              {/* Persönliche Daten */}
              <div className="bg-[#e8e8e8] rounded-xl p-5 border border-gray-200 space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Persönliche Daten</h2>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-600">Vorname *</label>
                    <input
                      type="text"
                      value={vorname}
                      onChange={e => setVorname(e.target.value)}
                      required
                      placeholder="Max"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[var(--red-main)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-600">Nachname *</label>
                    <input
                      type="text"
                      value={nachname}
                      onChange={e => setNachname(e.target.value)}
                      required
                      placeholder="Muster"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[var(--red-main)] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-600">Instagram *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">@</span>
                    <input
                      type="text"
                      value={instagram}
                      onChange={e => setInstagram(e.target.value.replace('@', ''))}
                      required
                      placeholder="dein_username"
                      className="w-full bg-white border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[var(--red-main)] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-600">E-Mail *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="deine@email.ch"
                      className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none transition-colors ${email && !validateEmail(email.trim()) ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-[var(--red-main)]'}`}
                    />
                    {email && !validateEmail(email.trim()) && (
                      <p className="text-red-500 text-xs mt-1">Ungültige E-Mail-Adresse</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-600">Telefon (optional)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">+41</span>
                      <input
                        type="tel"
                        value={telefon}
                        onChange={e => setTelefon(e.target.value.replace(/[^\d\s]/g, ''))}
                        placeholder="79 123 45 67"
                        inputMode="tel"
                        className="w-full bg-white border border-gray-300 rounded-lg pl-12 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[var(--red-main)] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Kontaktweg */}
              <div className="bg-[#e8e8e8] rounded-xl p-5 border border-gray-200 space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Wie möchtest du kontaktiert werden?</h2>
                <p className="text-xs text-gray-500">Wir melden uns bei dir zur Zahlungsabwicklung. <span className="text-[var(--gold)] font-medium">Instagram wird bevorzugt.</span></p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setKontaktweg('instagram')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${kontaktweg === 'instagram' ? 'border-[var(--red-main)] bg-white shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                    <span className="text-xs text-gray-700 font-medium">Instagram</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setKontaktweg('email')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${kontaktweg === 'email' ? 'border-[var(--red-main)] bg-white shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                    <span className="text-xs text-gray-700 font-medium">E-Mail</span>
                  </button>
                </div>
              </div>

              {/* Lieferadresse */}
              <div className="bg-[#e8e8e8] rounded-xl p-5 border border-gray-200 space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Lieferadresse</h2>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-600">Strasse & Nr. *</label>
                  <input
                    type="text"
                    value={strasse}
                    onChange={e => setStrasse(e.target.value)}
                    required
                    placeholder="Musterstrasse 12"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[var(--red-main)] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-[1fr_1fr] gap-3">
                  <div className="relative col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium mb-1.5 text-gray-600">PLZ / Ort *</label>
                    <input
                      type="text"
                      value={plzValid ? `${plz} ${ort}` : plz}
                      onChange={e => {
                        const v = e.target.value;
                        setPlzValid(false); setOrt(''); setPlz(v);
                        searchPlz(v.trim());
                      }}
                      onFocus={() => { if (plzSuggestions.length > 0) setShowPlzDropdown(true); }}
                      onBlur={() => setTimeout(() => setShowPlzDropdown(false), 200)}
                      required
                      placeholder="PLZ oder Ortschaft eingeben"
                      className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none transition-colors ${plzValid ? 'border-green-400 bg-green-50/50' : plz.length >= 4 && !plzValid ? 'border-red-400' : 'border-gray-300 focus:border-[var(--red-main)]'}`}
                    />
                    {plzValid && (
                      <svg className="absolute right-3 top-[38px] w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    )}
                    {showPlzDropdown && plzSuggestions.length > 0 && (
                      <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {plzSuggestions.map((s, i) => (
                          <button
                            key={`${s.plz}-${s.name}-${i}`}
                            type="button"
                            onMouseDown={() => { setPlz(s.plz); setOrt(s.name); setPlzValid(true); setShowPlzDropdown(false); setPlzSuggestions([]); }}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
                          >
                            <span className="font-medium text-gray-900">{s.plz}</span>
                            <span className="text-gray-500">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {plz.length >= 4 && !plzValid && !showPlzDropdown && (
                      <p className="text-red-500 text-xs mt-1">Bitte wähle eine gültige PLZ/Ortschaft aus der Liste</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-600">Land *</label>
                    <select
                      value={land}
                      onChange={e => setLand(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[var(--red-main)] transition-colors appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                    >
                      <option value="Schweiz">Schweiz</option>
                    </select>
                  </div>
                </div>
              </div>


              {/* Nachricht */}
              <div className="bg-[#e8e8e8] rounded-xl p-5 border border-gray-200 space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Anmerkungen</h2>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-600">Nachricht (optional)</label>
                  <textarea
                    value={nachricht}
                    onChange={e => setNachricht(e.target.value)}
                    placeholder="Spezielle Wünsche, Fragen..."
                    rows={3}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[var(--red-main)] resize-none transition-colors"
                  />
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#e8e8e8] rounded-xl p-4 border border-gray-200 text-center">
                  <svg className="w-6 h-6 mx-auto text-[var(--gold)] mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                  <p className="text-xs font-bold text-gray-700">Kostenloser Versand</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">In die ganze Schweiz</p>
                </div>
                <div className="bg-[#e8e8e8] rounded-xl p-4 border border-gray-200 text-center">
                  <svg className="w-6 h-6 mx-auto text-[var(--gold)] mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                  <p className="text-xs font-bold text-gray-700">Qualitätsgeprüft</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Jedes Trikot kontrolliert</p>
                </div>
              </div>
            </div>

            {/* Right: Order Summary (sticky) */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-8 space-y-4">
                <h2 className="lg:hidden text-4xl md:text-5xl uppercase tracking-wide text-gray-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Deine Artikel</h2>

                {bundleDiscount > 0 && (
                  <div className="bg-green-50 rounded-xl px-4 py-3 border border-green-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-green-600">Bundle-Rabatt {activeBundle === '3plus' ? '15%' : '20%'} aktiv</span>
                      <p className="text-xs text-gray-500">Du sparst CHF {bundleDiscount.toFixed(2)} auf diese Bestellung</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="bg-[#d0d0d0] rounded-xl p-4 border border-gray-300 flex gap-4">
                      <img src={item.product.i} alt={item.product.t} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0" loading="lazy" decoding="async" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">{item.product.t}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.teamName}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                          <span>Grösse: <span className="text-gray-900">{item.size}</span></span>
                          <span>Menge: <span className="text-gray-900">{item.quantity}</span></span>
                        </div>
                        {(item.flockingName || item.flockingNumber) && (
                          <p className="text-xs text-gray-500 mt-1">
                            Aufdruck: <span className="text-gray-900">{[item.flockingName, item.flockingNumber].filter(Boolean).join(' ')}</span>
                          </p>
                        )}
                        {item.patches && item.patches.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.patches.map(p => (
                              <span key={p.id} className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
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
                              <span className="text-sm font-bold text-green-600">CHF {discountedTotal.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-[var(--gold)]">CHF {itemTotal.toFixed(2)}</span>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="bg-[#d0d0d0] rounded-xl p-5 border border-gray-300 space-y-3">
                  <h2 className="text-lg font-bold uppercase tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Zusammenfassung</h2>

                  {activeBundle && !bundleProgress.reached && (
                    <div className="bg-[var(--gold)]/10 rounded-lg px-3 py-2 text-xs">
                      <div className="flex items-center justify-between text-[var(--gold)] font-semibold mb-1">
                        <span>Bundle {activeBundle === '3plus' ? '15%' : '20%'}</span>
                        <span>{bundleProgress.current}/{bundleProgress.target} Trikots</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--gold)] rounded-full transition-all" style={{ width: `${Math.min(100, (bundleProgress.current / bundleProgress.target) * 100)}%` }} />
                      </div>
                      <p className="text-gray-500 mt-1">Noch {bundleProgress.remaining} {bundleProgress.remaining === 1 ? 'Trikot' : 'Trikots'} bis zum Rabatt</p>
                    </div>
                  )}

                  {bundleDiscount > 0 && (
                    <div className="bg-green-50 rounded-lg px-3 py-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-semibold flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          Bundle-Rabatt aktiv
                        </span>
                        <span className="text-green-600 font-bold">-CHF {bundleDiscount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Zwischensumme ({totalItems} Artikel)</span>
                    <span>CHF {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Versand</span>
                    <span className="text-green-500 font-medium">Kostenlos</span>
                  </div>
                  {bundleDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Bundle-Rabatt</span>
                      <span>-CHF {bundleDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-[var(--gold)]">CHF {finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {error && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !vorname.trim() || !nachname.trim() || !instagram.trim() || !email.trim() || !validateEmail(email.trim()) || !strasse.trim() || !plzValid || !ort.trim() || !kontaktweg}
                  className="w-full bg-[var(--red-main)] hover:bg-[#a81d27] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg text-sm transition-colors"
                >
                  {submitting ? 'Bestellung wird gesendet...' : `Bestellung aufgeben — CHF ${finalPrice.toFixed(2)}`}
                </button>

                <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                  Mit der Bestellung akzeptierst du unsere <Link href="/agb" className="underline hover:text-gray-700">AGB</Link> und <Link href="/datenschutz" className="underline hover:text-gray-700">Datenschutzerklärung</Link>.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      </section>

      <Footer />
    </div>
  );
}
