import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VerticalMarquee from '@/components/VerticalMarquee';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Geschäftsbedingungen | T-EXPRESS24',
  description: 'Geschäftsbedingungen von T-EXPRESS24 – Lieferung, Zahlung, Rückgabe und mehr.',
};

export default function AGBPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        {/* Vertikale Marken-Watermark-Karussells links und rechts auf breiten Bildschirmen. */}
        <VerticalMarquee side="left" />
        <VerticalMarquee side="right" />
        <div className="relative max-w-3xl mx-auto px-4 py-10 md:py-16">
          <h1 className="text-2xl md:text-4xl font-black mb-8">Geschäftsbedingungen</h1>

          <div className="space-y-8 text-sm text-gray-300 leading-relaxed">

            <div>
              <h2 className="text-lg font-bold text-white mb-2">1. Geltungsbereich</h2>
              <p>
                Diese Allgemeinen Geschäftsbedingungen (AGB) regeln das Vertragsverhältnis zwischen T-EXPRESS24
                (nachfolgend «wir», «uns») und dem Kunden (nachfolgend «du») bei sämtlichen Bestellungen
                über unseren Online-Shop. Mit der Aufgabe einer Bestellung erklärst du dich mit diesen
                Bedingungen vollumfänglich einverstanden.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">2. Sortiment & Produktbeschreibung</h2>
              <p>
                T-EXPRESS24 bietet Fan-Trikots und verwandte Artikel aus den grössten Fussballligen der Welt an.
                Unsere Artikel sind Fan-Ware und stammen aus internationalen Bezugsquellen. Produktnamen,
                Vereins- und Ligabezeichnungen dienen ausschliesslich der Beschreibung des dargestellten Artikels
                und stellen keine Angaben zu Hersteller, Lizenz oder Herkunft dar.
              </p>
              <p className="mt-2">
                Jeder Artikel wird vor dem Versand bei uns in der Schweiz auf Material, Verarbeitung und
                Bedruckung geprüft. Farbabweichungen zu den Produktbildern durch Bildschirmdarstellung oder
                Lichtverhältnisse sind möglich und stellen keinen Mangel dar.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">3. Vertragsschluss</h2>
              <p>
                Die Darstellung unserer Artikel im Online-Shop stellt kein rechtlich verbindliches Angebot,
                sondern eine Aufforderung zur Bestellung dar. Mit dem Abschluss des Bestellvorgangs gibst du ein
                verbindliches Angebot ab. Der Kaufvertrag kommt mit dem Versand unserer Bestellbestätigung
                per E-Mail zustande.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">4. Preise & Währung</h2>
              <p>
                Alle Preise sind in Schweizer Franken (CHF) angegeben und verstehen sich inklusive sämtlicher
                Gebühren. T-EXPRESS24 ist nicht mehrwertsteuerpflichtig, weshalb keine Mehrwertsteuer
                ausgewiesen wird. Der Versand innerhalb der Schweiz ist kostenlos.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">5. Zahlung</h2>
              <p>
                Folgende Zahlungsmethoden stehen zur Verfügung:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Kreditkarte (Visa, Mastercard – abgewickelt via Stripe)</li>
                <li>TWINT</li>
                <li>PayPal</li>
              </ul>
              <p className="mt-2">
                Die Zahlung erfolgt ausschliesslich im Voraus, vor dem Versand der Ware. Bei Zahlungsausfall
                oder Rückbuchung sind wir berechtigt, die Bestellung nicht auszuliefern und den Vertrag aufzulösen.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">6. Lieferung & Versand</h2>
              <p>
                Der Versand innerhalb der Schweiz sowie in angrenzende Länder ist kostenlos. Die
                voraussichtliche Lieferzeit beträgt in der Regel 2–3 Wochen ab Zahlungseingang. Die Ware wird
                aus einem internationalen Lager zu uns in die Schweiz geliefert, einer Qualitätskontrolle
                unterzogen und anschliessend an dich versendet.
              </p>
              <p className="mt-2">
                Lieferverzögerungen durch externe Faktoren (Zoll, Logistikpartner, höhere Gewalt, Lieferengpässe)
                sind möglich und liegen ausserhalb unseres Einflussbereichs. Daraus ergeben sich keine
                Schadenersatzansprüche gegenüber T-EXPRESS24.
              </p>
              <p className="mt-2">
                Die Gefahrtragung geht mit Übergabe der Ware an den Logistikpartner auf den Kunden über.
                Bei Fernbleiben der Lieferung ist zunächst der Logistikpartner zur Nachforschung zu kontaktieren.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">7. Rückgabe, Umtausch & Mängelrüge</h2>
              <p>
                Ein Rückgabe- oder Umtauschrecht ohne Angabe von Gründen besteht nicht. In der Schweiz gibt es
                keine gesetzliche Widerrufsfrist für Online-Bestellungen. Ein Widerruf aus persönlichen Gründen
                (z. B. falsche Grösse, falsche Farbe, Geschmacksentscheid) ist ausgeschlossen.
              </p>
              <p className="mt-2">
                Offensichtliche Mängel oder Transportschäden sind uns innerhalb von 48 Stunden nach Erhalt der
                Ware schriftlich (per E-Mail oder Instagram-Direktnachricht) mit aussagekräftigen Fotos zu
                melden. Bei berechtigter, nachweislicher Reklamation liefern wir kostenlosen Ersatz. Nach Ablauf
                dieser Frist gilt die Ware als vorbehaltlos angenommen.
              </p>
              <p className="mt-2">
                Ein individuell bedrucktes Trikot (Name, Nummer, Patches) ist vom Umtausch in jedem Fall
                ausgeschlossen, sofern kein Produktionsfehler unsererseits vorliegt.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">8. Haftung</h2>
              <p>
                T-EXPRESS24 haftet nur für Schäden, die durch vorsätzliches oder grobfahrlässiges Verhalten
                entstanden sind. Die Haftung für leichte Fahrlässigkeit sowie für mittelbare Schäden,
                entgangenen Gewinn oder Folgeschäden ist – soweit gesetzlich zulässig – ausgeschlossen.
              </p>
              <p className="mt-2">
                Für Verzögerungen oder Ausfälle durch Dritte (Zahlungsdienstleister, Logistikpartner,
                Internetanbieter) sowie für höhere Gewalt übernehmen wir keine Haftung.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">9. Eigentumsvorbehalt</h2>
              <p>
                Die gelieferte Ware bleibt bis zur vollständigen Bezahlung des Kaufpreises unser Eigentum.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">10. Datenschutz</h2>
              <p>
                Wir verarbeiten deine personenbezogenen Daten ausschliesslich zur Abwicklung deiner Bestellung
                sowie zur Erfüllung unserer gesetzlichen Pflichten. Für Details zur Datenverarbeitung,
                den eingesetzten Diensten und deinen Rechten nach dem revidierten Schweizer Datenschutzgesetz
                (revDSG) verweisen wir auf unsere <a href="/datenschutz" className="text-[var(--gold)] hover:underline">Datenschutzerklärung</a>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">11. Anwendbares Recht & Gerichtsstand</h2>
              <p>
                Auf das Vertragsverhältnis zwischen T-EXPRESS24 und dem Kunden findet ausschliesslich
                Schweizer Recht unter Ausschluss des UN-Kaufrechts (CISG) Anwendung.
              </p>
              <p className="mt-2">
                Ausschliesslicher Gerichtsstand für sämtliche Streitigkeiten aus oder im Zusammenhang mit
                dem Vertragsverhältnis ist der Sitz von T-EXPRESS24 in der Schweiz, soweit gesetzlich zulässig.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">12. Salvatorische Klausel</h2>
              <p>
                Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein oder werden,
                berührt dies die Wirksamkeit der übrigen Bestimmungen nicht. Anstelle der unwirksamen
                Bestimmung gilt die gesetzlich zulässige Regelung, die dem wirtschaftlichen Zweck am nächsten kommt.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">13. Kontakt</h2>
              <p>
                Bei Fragen, Reklamationen oder Anliegen erreichst du uns über folgende Kanäle:
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3">
                <a href="https://instagram.com/T_express247" target="_blank" rel="noopener noreferrer" className="text-[var(--gold)] hover:underline">
                  Instagram: @T_express247
                </a>
                <a href="mailto:support@t-express24.shop" className="text-[var(--gold)] hover:underline">
                  E-Mail: support@t-express24.shop
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">14. Änderungen der AGB</h2>
              <p>
                T-EXPRESS24 behält sich das Recht vor, diese Geschäftsbedingungen jederzeit anzupassen.
                Es gelten jeweils die zum Zeitpunkt der Bestellung gültigen Bedingungen.
              </p>
            </div>

            <p className="text-xs text-gray-500 pt-4 border-t border-white/10">
              Stand: {new Date().toLocaleDateString('de-CH', { year: 'numeric', month: 'long' })}
            </p>

          </div>
        </div>
      </section>
      <Footer dark />
    </>
  );
}
