import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const orders = await redis.lrange('orders', 0, -1);
    return NextResponse.json(orders, { headers: corsHeaders });
  } catch {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { kunde_name, kunde_kontakt, nachricht, items } = body;

    if (!kunde_name || !kunde_kontakt || !items?.length) {
      return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400, headers: corsHeaders });
    }

    // Determine if contact is phone or Instagram
    const isPhone = /^[\d\s+()-]+$/.test(kunde_kontakt);
    const kunde_telefon = isPhone ? kunde_kontakt : '';
    const kontaktInfo = isPhone ? '' : `Instagram: ${kunde_kontakt}`;

    // Generate one order ID and bestell_nr per checkout
    const id = await redis.incr('order_id_counter');
    const bestell_nr = 'B-' + String(id).padStart(4, '0');

    const orderData = {
      id,
      bestell_nr,
      datum: new Date().toISOString(),
      kunde_name,
      kunde_telefon,
      kunde_kontakt: kunde_kontakt,
      nachricht: [kontaktInfo, nachricht].filter(Boolean).join(' | '),
      quelle: 'website',
      status: 'neu',
      lieferant_bestellt: false,
      items: items.map((item: any) => ({
        produkt_name: item.produkt_name,
        produkt_preis: item.produkt_preis,
        team: item.team || '',
        groesse: item.groesse || '',
        beflockung: item.beflockung || '',
        menge: item.menge || 1,
      })),
      gesamtpreis: items.reduce((sum: number, item: any) => sum + (parseFloat(item.produkt_preis) * (item.menge || 1)), 0),
    };

    await redis.lpush('orders', JSON.stringify(orderData));

    return NextResponse.json(
      { status: 'ok', message: 'Bestellung eingegangen', bestell_nr, id },
      { headers: corsHeaders }
    );
  } catch {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, lieferant_bestellt } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID fehlt' }, { status: 400, headers: corsHeaders });
    }

    const rawOrders = await redis.lrange('orders', 0, -1);
    const orders = rawOrders.map((o) =>
      typeof o === 'string' ? JSON.parse(o) : o
    );

    const index = orders.findIndex((o: { id: number }) => o.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Bestellung nicht gefunden' }, { status: 404, headers: corsHeaders });
    }

    if (status !== undefined) {
      orders[index].status = status;
    }
    if (lieferant_bestellt !== undefined) {
      orders[index].lieferant_bestellt = lieferant_bestellt;
    }

    // Rewrite the entire list atomically
    const pipeline = redis.pipeline();
    pipeline.del('orders');
    for (let i = orders.length - 1; i >= 0; i--) {
      pipeline.lpush('orders', JSON.stringify(orders[i]));
    }
    await pipeline.exec();

    return NextResponse.json(
      { status: 'ok', message: 'Bestellung aktualisiert', order: orders[index] },
      { headers: corsHeaders }
    );
  } catch {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID fehlt' }, { status: 400, headers: corsHeaders });
    }

    const rawOrders = await redis.lrange('orders', 0, -1);
    const orders = rawOrders.map((o) =>
      typeof o === 'string' ? JSON.parse(o) : o
    );

    const filtered = orders.filter((o: { id: number }) => o.id !== id);

    if (filtered.length === orders.length) {
      return NextResponse.json({ error: 'Bestellung nicht gefunden' }, { status: 404, headers: corsHeaders });
    }

    // Rewrite the list without the deleted order
    const pipeline = redis.pipeline();
    pipeline.del('orders');
    for (let i = filtered.length - 1; i >= 0; i--) {
      pipeline.lpush('orders', JSON.stringify(filtered[i]));
    }
    await pipeline.exec();

    return NextResponse.json(
      { status: 'ok', message: 'Bestellung gelöscht' },
      { headers: corsHeaders }
    );
  } catch {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500, headers: corsHeaders });
  }
}
