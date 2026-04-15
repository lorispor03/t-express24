import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const alt = 'T-EXPRESS24 – Premium Fussball Trikots aus der Schweiz';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  const [logoData, bebasFont] = await Promise.all([
    readFile(join(process.cwd(), 'public/logo-og.png')),
    readFile(join(process.cwd(), 'public/fonts/BebasNeue-Regular.ttf')),
  ]);

  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #111111 0%, #1a0507 40%, #6b1018 100%)',
          position: 'relative',
          fontFamily: 'Bebas Neue',
        }}
      >
        {/* Radial glow top-right (matches hero-bg) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 900,
            height: 900,
            background:
              'radial-gradient(circle, rgba(196,34,46,0.45) 0%, transparent 65%)',
            display: 'flex',
          }}
        />

        {/* Logo — rendered 1:1 with source for pixel-perfect sharpness */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt="T-EXPRESS24"
          width={600}
          height={400}
          style={{
            objectFit: 'contain',
            marginTop: -20,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            marginTop: 10,
            fontSize: 54,
            fontWeight: 400,
            color: '#ffffff',
            letterSpacing: 2,
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          Premium Fussball Trikots aus der Schweiz
        </div>

        {/* Bottom row – USPs */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 36,
            fontSize: 34,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <div style={{ display: 'flex' }}>4&apos;700+ Trikots</div>
          <div style={{ display: 'flex', color: '#F0A73E' }}>·</div>
          <div style={{ display: 'flex' }}>10 Top-Ligen</div>
          <div style={{ display: 'flex', color: '#F0A73E' }}>·</div>
          <div style={{ display: 'flex' }}>Versand aus CH</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Bebas Neue',
          data: bebasFont,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}
