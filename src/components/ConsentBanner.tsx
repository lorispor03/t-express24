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
      {/* Overlay blockiert die Seite */}
      <div className="fixed inset-0 bg-black/60 z-[9998]" />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#111] border-t border-white/10 px-4 py-5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <p className="text-sm text-gray-300 text-center sm:text-left">
            Mit der Nutzung dieses Shops akzeptierst du unsere{' '}
            <Link href="/agb" className="text-[var(--gold)] underline hover:text-white">
              Geschäftsbedingungen
            </Link>.
          </p>
          <button
            onClick={handleAccept}
            className="flex-shrink-0 bg-[var(--red-main)] hover:bg-[var(--red-dark)] text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-colors"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </>
  );
}
