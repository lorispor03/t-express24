interface Props {
  side: 'left' | 'right';
}

// Vertical marquee watermark used on legal pages (AGB / Datenschutz).
// Displays an endlessly repeating "T-EXPRESS24 •" wordmark, rotated 90° so it
// runs vertically in the empty space next to the centred text column.
export default function VerticalMarquee({ side }: Props) {
  const isLeft = side === 'left';
  // Container läuft vom Seitenrand exakt bis zum Anfang der Textspalte
  // (max-w-3xl = 48rem → halbe Breite 24rem), damit das rotierte Karussell
  // mittig zwischen Rand und Text sitzt.
  const positionClasses = isLeft
    ? 'left-0 right-[calc(50%+24rem)]'
    : 'right-0 left-[calc(50%+24rem)]';
  const rotation = isLeft ? '-90deg' : '90deg';

  // One "unit" of content that gets duplicated for a seamless loop.
  const unit = (
    <span className="flex items-center shrink-0">
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="flex items-center shrink-0">
          <span>T-EXPRESS24</span>
          <span className="mx-[0.45em] text-white/[0.08]">•</span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      aria-hidden
      className={`hidden lg:block absolute inset-y-0 ${positionClasses} pointer-events-none overflow-hidden`}
    >
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          transform: `translate(-50%, -50%) rotate(${rotation})`,
          transformOrigin: 'center',
        }}
      >
        <div
          className="vmarquee-track text-white/[0.05] select-none"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(7rem, 13vw, 15rem)',
            letterSpacing: '0.1em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {unit}
          {unit}
        </div>
      </div>
    </div>
  );
}
