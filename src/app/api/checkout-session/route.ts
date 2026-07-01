import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Redis } from '@upstash/redis';
import { sendOrderConfirmationToCustomer, sendOrderNotificationToAdmin } from '@/lib/email';

function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, kunde, lieferadresse, nachricht, zahlungsart, kontaktweg, bundle, bundleDiscount } = body;

    if (!items?.length || !kunde?.vorname || !kunde?.nachname || !kunde?.email) {
      return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 });
    }

    // Gesamtbetrag berechnen
    let totalCents = 0;
    for (const item of items) {
      const basePrice = parseFloat(item.produkt_preis);
      const extraPrice = item.extras_preis || 0;
      const unitPrice = basePrice + extraPrice;
      totalCents += Math.round(unitPrice * 100) * (item.menge || 1);
    }

    // Bundle-Rabatt abziehen
    if (bundleDiscount && bundleDiscount > 0) {
      totalCents -= Math.round(bundleDiscount * 100);
    }

    const gesamtpreis = totalCents / 100;

    // Bestellnummer generieren
    const bestell_nr = `TE-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const datum = new Date().toISOString();

    // Bestellung in Redis speichern
    const redis = getRedis();
    const orderData = {
      bestell_nr,
      datum,
      items,
      kunde,
      lieferadresse,
      nachricht,
      zahlungsart,
      kontaktweg,
      bundle,
      bundleDiscount,
      totalCents,
      gesamtpreis,
      status: 'neu',
    };
    await redis.set(`order:${bestell_nr}`, JSON.stringify(orderData));
    await redis.lpush('orders', JSON.stringify(orderData));

    // E-Mails senden (Kunde + Admin)
    const emailOrder = {
      bestell_nr,
      datum,
      kunde_name: `${kunde.vorname} ${kunde.nachname}`,
      kunde_instagram: kunde.instagram,
      kunde_telefon: kunde.telefon,
      kunde_kontakt: kunde.email,
      lieferadresse,
      nachricht,
      zahlungsart: zahlungsart || 'Wird noch vereinbart',
      kontaktweg: kontaktweg || 'instagram',
      items,
      gesamtpreis,
    };

    // E-Mails im Hintergrund senden (nicht blockierend)
    Promise.all([
      sendOrderConfirmationToCustomer(emailOrder),
      sendOrderNotificationToAdmin(emailOrder),
    ]).catch(err => console.error('Email send error:', err));

    return NextResponse.json({ url: `/checkout/success?nr=${encodeURIComponent(bestell_nr)}&kontakt=${kontaktweg || 'instagram'}` });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message || 'Bestellfehler' }, { status: 500 });
  }
}
