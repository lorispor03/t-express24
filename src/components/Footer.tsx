import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand - full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="T-EXPRESS24" width={44} height={44} className="rounded-lg" />
              <span className="font-extrabold text-xl">T-EXPRESS<span className="text-[var(--gold)]">24</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium Fussball Trikots aus der Schweiz. Jedes Trikot wird von uns persönlich geprüft und versendet.
            </p>
          </div>

          {/* Ligen */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[var(--gold)]">Ligen</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <Link href="/league/premier-league" className="block hover:text-white transition-colors">Premier League</Link>
              <Link href="/league/la-liga" className="block hover:text-white transition-colors">La Liga</Link>
              <Link href="/league/bundesliga" className="block hover:text-white transition-colors">Bundesliga</Link>
              <Link href="/league/serie-a" className="block hover:text-white transition-colors">Serie A</Link>
              <Link href="/#ligen" className="block hover:text-white transition-colors">Alle Ligen &rarr;</Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[var(--gold)]">Info</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Lieferzeit: 2-3 Wochen</p>
              <p>Qualitätskontrolle in CH</p>
              <p>Preise in CHF</p>
              <p>Versand aus der Schweiz</p>
            </div>
          </div>

          {/* Kontakt - full width on mobile, centered */}
          <div className="col-span-2 md:col-span-1 text-center md:text-left">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[var(--gold)]">Kontakt</h3>
            <div className="flex justify-center md:justify-start">
              <a href="https://instagram.com/T_express247" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                @T_express247
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} T-EXPRESS24. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
