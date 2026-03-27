'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('agb-accepted');
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('agb-accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[9998]" />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl px-6 py-8 max-w-sm w-full text-center shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-3">Willkommen bei T-EXPRESS24</h2>
          <p className="text-sm text-gray-300 mb-6">
            Mit der Nutzung dieses Shops akzeptierst du unsere{' '}
            <Link href="/agb" className="text-[var(--gold)] underline hover:text-white">
              Geschäftsbedingungen
            </Link>.
          </p>
          <button
            onClick={handleAccept}
            className="w-full bg-[var(--red-main)] hover:bg-[var(--red-dark)] text-white text-sm font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </>
  );
}
