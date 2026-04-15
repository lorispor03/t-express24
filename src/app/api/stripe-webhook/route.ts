import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Redis } from '@upstash/redis';
import { sendOrderConfirmationToCustomer, sendOrderNotificationToAdmin } from '@/lib/email';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const redis = getRedis();
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      // Fallback for testing without webhook secret
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    try {
      // Items aus aufgeteilten Metadata-Keys zusammensetzen
      const itemChunkCount = parseInt(metadata.items_count || '0');
      let compactItems: any[] = [];
      for (let i = 0; i < itemChunkCount; i++) {
        const chunk = metadata[`items_${i}`];
        if (chunk) compactItems.push(...JSON.parse(chunk));
      }

      const lieferadresse = metadata.lieferadresse ? JSON.parse(metadata.lieferadresse) : null;

      const id = await redis.incr('order_id_counter');
      const bestell_nr = 'B-' + String(id).padStart(4, '0');

      const orderData = {
        id,
        bestell_nr,
        datum: new Date().toISOString(),
        kunde_name: metadata.kunde_name || '',
        kunde_telefon: metadata.kunde_telefon || '',
        kunde_kontakt: metadata.kunde_email || '',
        lieferadresse,
        nachricht: metadata.nachricht || '',
        zahlungsart: metadata.zahlungsart || '',
        stripe_session_id: session.id,
        stripe_payment_status: session.payment_status,
        quelle: 'website',
        status: 'neu',
        bezahlt: true,
        lieferant_bestellt: false,
        items: compactItems.map((item: any) => ({
          produkt_name: item.n,
          produkt_preis: item.p,
          team: item.t || '',
          groesse: item.g || '',
          beflockung_name: item.bn || '',
          beflockung_nummer: item.bx || '',
          patches: (item.pa || []).map((name: string) => ({ name })),
          extras: item.e || 'none',
          extras_preis: item.ep || 0,
          menge: item.m || 1,
        })),
        gesamtpreis: (session.amount_total || 0) / 100,
      };

      await redis.lpush('orders', JSON.stringify(orderData));
      console.log(`Order ${bestell_nr} created from Stripe payment`);

      // E-Mails versenden (blockiert den Webhook nicht bei Fehler)
      await Promise.allSettled([
        sendOrderConfirmationToCustomer(orderData),
        sendOrderNotificationToAdmin(orderData),
      ]);
    } catch (err) {
      console.error('Error creating order from webhook:', err);
    }
  }

  return NextResponse.json({ received: true });
}
