import Image from 'next/image';

export default function Footer({ dark }: { dark?: boolean }) {
  return (
    <footer className={`relative overflow-hidden ${dark ? 'bg-[#0d0d0d]' : 'mt-10'}`}>
      {!dark && <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />}
      {!dark && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,34,46,0.3),transparent_70%)]" />}
      <div className="relative max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 py-12">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center gap-3 mb-3 justify-center">
            <Image src="/logo.png" alt="T-EXPRESS24" width={44} height={44} className="rounded-lg" />
            <span className="font-extrabold text-xl">T-EXPRESS<span className="text-[var(--gold)]">24</span></span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
            Premium Fussball Trikots aus der Schweiz. Jedes Trikot wird von uns persönlich geprüft und versendet.
          </p>
        </div>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid grid-cols-3 gap-6 text-center">
          {/* Zahlungsarten */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[var(--gold)]">Zahlungsarten</h3>
            <div className="flex items-center justify-center gap-4">
              <img src="/twint-logo.png" alt="TWINT" className="h-8 w-auto" />
              <img src="/visa-logo.svg" alt="Visa" className="h-8 w-auto" />
              <img src="/mastercard-logo.svg" alt="Mastercard" className="h-8 w-auto" />
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[var(--gold)]">Info</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Qualitätskontrolle in CH</p>
              <p>Preise in CHF</p>
              <p>Versand aus der Schweiz</p>
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[var(--gold)]">Kontakt</h3>
            <div className="flex flex-col gap-3 items-center">
              <a href="https://instagram.com/T_express247" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                <span>@T_express247</span>
              </a>
              <a href="mailto:kontakt@t-express24.shop" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <span>E-Mail</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile: stacked layout */}
        <div className="md:hidden space-y-6">
          {/* Zahlungsarten - horizontal */}
          <div className="text-center">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-[var(--gold)]">Zahlungsarten</h3>
            <div className="flex items-center justify-center gap-4">
              <img src="/twint-logo.png" alt="TWINT" className="h-7 w-auto" />
              <img src="/visa-logo.svg" alt="Visa" className="h-7 w-auto" />
              <img src="/mastercard-logo.svg" alt="Mastercard" className="h-7 w-auto" />
            </div>
          </div>

          {/* Info - horizontal pills */}
          <div className="text-center">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-[var(--gold)]">Info</h3>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
              <span className="bg-white/10 px-3 py-1.5 rounded-full">Qualitätskontrolle in CH</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-full">Preise in CHF</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-full">Versand aus der Schweiz</span>
            </div>
          </div>

          {/* Kontakt - horizontal */}
          <div className="text-center">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-[var(--gold)]">Kontakt</h3>
            <div className="flex items-center justify-center gap-5">
              <a href="https://instagram.com/T_express247" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                <span className="text-xs">Instagram</span>
              </a>
              <a href="mailto:kontakt@t-express24.shop" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <span className="text-xs">E-Mail</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/20 text-center text-xs text-gray-400">
          <a href="/agb" className="hover:text-white transition-colors">AGB</a>
          <span className="mx-2">·</span>
          <a href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</a>
          <span className="mx-2">·</span>
          <a href="/lieferung" className="hover:text-white transition-colors">Lieferung</a>
          <span className="mx-2">·</span>
          &copy; {new Date().getFullYear()} T-EXPRESS24. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
