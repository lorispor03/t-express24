import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VerticalMarquee from '@/components/VerticalMarquee';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | T-EXPRESS24',
  description: 'Datenschutzerklärung von T-EXPRESS24 – wie wir deine Daten verarbeiten und schützen.',
};

export default function DatenschutzPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        {/* Vertikale Marken-Watermark-Karussells links und rechts auf breiten Bildschirmen. */}
        <VerticalMarquee side="left" />
        <VerticalMarquee side="right" />
        <div className="relative max-w-3xl mx-auto px-4 py-10 md:py-16">
          <h1 className="text-2xl md:text-4xl font-black mb-8">Datenschutzerklärung</h1>

          <div className="space-y-8 text-sm text-gray-300 leading-relaxed">

            <div>
              <p>
                T-EXPRESS24 nimmt den Schutz deiner persönlichen Daten ernst. In dieser Datenschutzerklärung
                informieren wir dich transparent darüber, welche Daten wir erheben, zu welchem Zweck sie
                verarbeitet werden und welche Rechte dir in Bezug auf deine Daten zustehen.
              </p>
              <p className="mt-2">
                Grundlage für die Datenverarbeitung ist das revidierte Schweizer Datenschutzgesetz (revDSG),
                in Anwendungsfällen mit EU-Bezug ergänzend die Datenschutz-Grundverordnung (DSGVO).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">1. Verantwortliche Stelle</h2>
              <p>
                Verantwortlich für die Datenverarbeitung im Sinne des revDSG ist der Betreiber des Online-Shops
                T-EXPRESS24. Bei Fragen zum Datenschutz, zur Ausübung deiner Rechte oder zur Löschung deiner
                Daten kannst du uns jederzeit kontaktieren:
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
              <h2 className="text-lg font-bold text-white mb-2">2. Welche Daten wir erheben</h2>
              <p>Wir erheben und verarbeiten folgende Kategorien personenbezogener Daten:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong className="text-white">Bestelldaten:</strong> Name, Lieferadresse, E-Mail-Adresse, Telefonnummer (optional), bestellte Artikel</li>
                <li><strong className="text-white">Zahlungsdaten:</strong> werden direkt beim Zahlungsdienstleister (Stripe, PayPal, TWINT) eingegeben und verarbeitet – wir speichern keine vollständigen Kartendaten</li>
                <li><strong className="text-white">Kommunikationsdaten:</strong> E-Mail- und Instagram-Nachrichten, Chatbot-Verlauf</li>
                <li><strong className="text-white">Technische Daten:</strong> IP-Adresse, Browser- und Gerätedaten, Zeitpunkt des Zugriffs (Server-Logs)</li>
                <li><strong className="text-white">Cookies:</strong> siehe Abschnitt 6</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">3. Zweck der Datenverarbeitung</h2>
              <p>
                Wir verarbeiten deine Daten ausschliesslich für folgende Zwecke:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Abwicklung deiner Bestellung (Bestätigung, Lieferung, Zahlung)</li>
                <li>Beantwortung deiner Anfragen über Kontaktkanäle (E-Mail, Instagram, Chatbot)</li>
                <li>Bearbeitung von Reklamationen und Ersatzlieferungen</li>
                <li>Technischer Betrieb und Sicherheit der Webseite</li>
                <li>Erfüllung gesetzlicher Aufbewahrungspflichten</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">4. Weitergabe an Dritte</h2>
              <p>
                Eine Weitergabe deiner personenbezogenen Daten an Dritte erfolgt ausschliesslich, soweit es für
                die Abwicklung deiner Bestellung erforderlich ist oder wir gesetzlich dazu verpflichtet sind.
                Wir nutzen folgende Dienstleister:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong className="text-white">Stripe (USA/Irland):</strong> Verarbeitung von Kreditkartenzahlungen</li>
                <li><strong className="text-white">PayPal (Luxemburg):</strong> Verarbeitung von PayPal-Zahlungen</li>
                <li><strong className="text-white">TWINT (Schweiz):</strong> Verarbeitung von TWINT-Zahlungen</li>
                <li><strong className="text-white">Vercel (USA):</strong> Hosting der Webseite</li>
                <li><strong className="text-white">Upstash (USA/EU):</strong> Speicherung von Bestelldaten</li>
                <li><strong className="text-white">Anthropic (USA):</strong> KI-gestützter Chatbot für Kundenfragen</li>
                <li><strong className="text-white">Logistikpartner:</strong> für den Versand der Ware</li>
              </ul>
              <p className="mt-2">
                Alle Dienstleister wurden sorgfältig ausgewählt und sind vertraglich zur Einhaltung des
                Datenschutzes verpflichtet. Bei Übermittlungen in Drittländer (insbesondere USA) stellen wir
                sicher, dass ein angemessenes Datenschutzniveau gewährleistet ist.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">5. KI-Chatbot</h2>
              <p>
                Unser Online-Shop bietet einen KI-basierten Chatbot an, der dir bei Fragen zu Produkten,
                Grössen, Lieferung und Bestellprozess hilft. Der Chatbot basiert auf Technologie von
                Anthropic (Claude) und verarbeitet deine Nachrichten, um passende Antworten zu generieren.
              </p>
              <p className="mt-2">
                Bitte gib im Chat keine sensiblen persönlichen Daten wie Kreditkartennummern, Passwörter oder
                Gesundheitsdaten ein. Die Chatverläufe werden temporär verarbeitet, aber nicht dauerhaft
                deinem Profil zugeordnet.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">6. Cookies & lokale Speicherung</h2>
              <p>
                Wir verwenden technisch notwendige Cookies und den Browser-Speicher (localStorage) für
                folgende Zwecke:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Warenkorb-Inhalt während deines Besuchs speichern</li>
                <li>Zustimmung zu den Geschäftsbedingungen merken</li>
                <li>Sichere Abwicklung des Checkouts</li>
              </ul>
              <p className="mt-2">
                Wir setzen <strong className="text-white">keine</strong> Tracking-Cookies, Analyse-Tools oder
                Werbe-Cookies ein. Es findet kein Profiling oder Retargeting statt.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">7. Aufbewahrungsdauer</h2>
              <p>
                Wir speichern deine Daten nur so lange, wie dies für die oben genannten Zwecke erforderlich ist
                oder wie es gesetzliche Aufbewahrungspflichten (insbesondere handels- und steuerrechtliche
                Pflichten von bis zu 10 Jahren) vorschreiben. Nach Ablauf dieser Fristen werden deine Daten
                gelöscht oder anonymisiert.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">8. Deine Rechte</h2>
              <p>
                Du hast jederzeit folgende Rechte in Bezug auf deine personenbezogenen Daten:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong className="text-white">Auskunft:</strong> welche Daten wir über dich gespeichert haben</li>
                <li><strong className="text-white">Berichtigung:</strong> Korrektur unrichtiger Daten</li>
                <li><strong className="text-white">Löschung:</strong> Löschung deiner Daten, soweit keine Aufbewahrungspflicht entgegensteht</li>
                <li><strong className="text-white">Einschränkung:</strong> Einschränkung der Verarbeitung</li>
                <li><strong className="text-white">Widerspruch:</strong> Widerspruch gegen die Verarbeitung</li>
                <li><strong className="text-white">Datenübertragbarkeit:</strong> Erhalt deiner Daten in einem strukturierten Format</li>
              </ul>
              <p className="mt-2">
                Zur Ausübung dieser Rechte genügt eine formlose Mitteilung an <a href="mailto:support@t-express24.shop" className="text-[var(--gold)] hover:underline">support@t-express24.shop</a>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">9. Datensicherheit</h2>
              <p>
                Wir setzen technische und organisatorische Sicherheitsmassnahmen ein, um deine Daten vor
                Verlust, Missbrauch und unbefugtem Zugriff zu schützen. Die Übertragung aller Daten erfolgt
                verschlüsselt via HTTPS/TLS.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">10. Änderungen dieser Datenschutzerklärung</h2>
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, etwa bei Änderungen
                unserer Dienste oder der rechtlichen Vorgaben. Die jeweils aktuelle Version findest du stets
                auf dieser Seite.
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
