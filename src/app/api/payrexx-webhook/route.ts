import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { sendOrderConfirmationToCustomer, sendOrderNotificationToAdmin } from '@/lib/email';

function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

export async function POST(req: NextRequest) {
  const redis = getRedis();

  let payload: any;

  try {
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else {
      const text = await req.text();
      try {
        payload = JSON.parse(text);
      } catch {
        const params = new URLSearchParams(text);
        payload = Object.fromEntries(params);
      }
    }
  } catch (err) {
    console.error('Failed to parse webhook payload:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const transaction = payload.transaction;
  if (!transaction) {
    return NextResponse.json({ received: true });
  }

  // Nur bestätigte Zahlungen verarbeiten
  if (transaction.status !== 'confirmed') {
    console.log(`Payrexx webhook: transaction ${transaction.id} status=${transaction.status}, skipping`);
    return NextResponse.json({ received: true });
  }

  const referenceId = transaction.referenceId || transaction.invoice?.referenceId;
  if (!referenceId || !referenceId.startsWith('pending-')) {
    console.log(`Payrexx webhook: no valid referenceId, skipping`);
    return NextResponse.json({ received: true });
  }

  try {
    // Pending-Bestellung aus Redis holen
    const pendingRaw = await redis.get(referenceId);
    if (!pendingRaw) {
      console.error(`Pending order ${referenceId} not found in Redis`);
      return NextResponse.json({ received: true });
    }

    const pending: any = typeof pendingRaw === 'string' ? JSON.parse(pendingRaw) : pendingRaw;

    // Bestellung erstellen
    const id = await redis.incr('order_id_counter');
    const bestell_nr = 'B-' + String(id).padStart(4, '0');

    const orderData = {
      id,
      bestell_nr,
      datum: new Date().toISOString(),
      kunde_name: `${pending.kunde.vorname} ${pending.kunde.nachname}`,
      kunde_telefon: pending.kunde.telefon || '',
      kunde_kontakt: pending.kunde.email || '',
      lieferadresse: pending.lieferadresse || null,
      nachricht: pending.nachricht || '',
      zahlungsart: pending.zahlungsart || '',
      payrexx_transaction_id: transaction.id,
      payrexx_status: transaction.status,
      quelle: 'website',
      status: 'neu',
      bezahlt: true,
      lieferant_bestellt: false,
      items: pending.items.map((item: any) => ({
        produkt_name: item.produkt_name,
        produkt_preis: item.produkt_preis,
        team: item.team || '',
        groesse: item.groesse || '',
        beflockung_name: item.beflockung_name || '',
        beflockung_nummer: item.beflockung_nummer || '',
        patches: (item.patches || []).map((p: any) => ({ name: p.name })),
        extras: item.extras || 'none',
        extras_preis: item.extras_preis || 0,
        menge: item.menge || 1,
      })),
      gesamtpreis: (transaction.amount || pending.totalCents) / 100,
    };

    await redis.lpush('orders', JSON.stringify(orderData));
    console.log(`Order ${bestell_nr} created from Payrexx payment`);

    // Pending-Daten löschen
    await redis.del(referenceId);

    // E-Mails versenden
    await Promise.allSettled([
      sendOrderConfirmationToCustomer(orderData),
      sendOrderNotificationToAdmin(orderData),
    ]);
  } catch (err) {
    console.error('Error creating order from Payrexx webhook:', err);
  }

  return NextResponse.json({ received: true });
}
