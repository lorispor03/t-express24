import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--red-main)] rounded-lg flex items-center justify-center font-black text-white text-lg">T</div>
              <span className="font-extrabold text-xl">T-EXPRESS<span className="text-[var(--gold)]">24</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium Fussball Trikots aus der Schweiz. Jedes Trikot wird von uns persönlich geprüft und versendet.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[var(--gold)]">Ligen</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <Link href="/league/premier-league" className="block hover:text-white transition-colors">Premier League</Link>
              <Link href="/league/la-liga" className="block hover:text-white transition-colors">La Liga</Link>
              <Link href="/league/bundesliga" className="block hover:text-white transition-colors">Bundesliga</Link>
              <Link href="/league/serie-a" className="block hover:text-white transition-colors">Serie A</Link>
              <Link href="/leagues" className="block hover:text-white transition-colors">Alle Ligen →</Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[var(--gold)]">Info</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📦 Lieferzeit: 2-3 Wochen</p>
              <p>✅ Qualitätskontrolle in CH</p>
              <p>💰 Preise in CHF</p>
              <p>🏠 Versand aus der Schweiz</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[var(--gold)]">Kontakt</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="https://wa.me/41XXXXXXXXX" className="block hover:text-white transition-colors">WhatsApp</a>
              <a href="https://t.me/BOT_USERNAME" className="block hover:text-white transition-colors">Telegram</a>
              <a href="mailto:info@t-express24.ch" className="block hover:text-white transition-colors">E-Mail</a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} T-EXPRESS24. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
