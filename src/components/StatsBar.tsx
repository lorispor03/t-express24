'use client';

import { useEffect, useRef, useState } from 'react';

const STATS = [
  { num: 4800, suffix: '+', label: 'Artikel', delay: 0, icon: (
    <svg className="w-5 h-5 sm:w-10 sm:h-10 md:w-12 md:h-12 xl:w-14 xl:h-14" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  )},
  { num: 250, suffix: '+', label: 'Teams', delay: 150, icon: (
    <svg className="w-5 h-5 sm:w-10 sm:h-10 md:w-12 md:h-12 xl:w-14 xl:h-14" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  )},
  { num: 20, suffix: '+', label: 'Ligen', delay: 300, icon: (
    <svg className="w-5 h-5 sm:w-10 sm:h-10 md:w-12 md:h-12 xl:w-14 xl:h-14" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12v1c0 3.5-1.5 6.5-4 8h-4C7.5 10.5 6 7.5 6 4V3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 4H4a1 1 0 00-1 1v1a4 4 0 004 4M18 4h2a1 1 0 011 1v1a4 4 0 01-4 4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 12h4v3h-4zM8 18h8M9 15h6v3H9z" />
    </svg>
  )},
  { num: 100, suffix: '%', label: 'Geprüft', delay: 450, icon: (
    <svg className="w-5 h-5 sm:w-10 sm:h-10 md:w-12 md:h-12 xl:w-14 xl:h-14" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  )},
];

function useCountUp(target: number, duration: number, startTime: number | null) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startTime) { setCount(0); return; }
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [startTime, target, duration]);

  return count;
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [agbAccepted, setAgbAccepted] = useState(false);
  const [startTimes, setStartTimes] = useState<(number | null)[]>([null, null, null, null]);
  const [doneFlags, setDoneFlags] = useState([false, false, false, false]);
  const [shimmer, setShimmer] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (localStorage.getItem('agb-accepted')) setAgbAccepted(true);
    const handler = () => setAgbAccepted(true);
    window.addEventListener('agb-accepted', handler);
    return () => window.removeEventListener('agb-accepted', handler);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const canAnimate = visible && agbAccepted;

  // Stagger start times
  useEffect(() => {
    if (!canAnimate || triggered.current) return;
    triggered.current = true;
    STATS.forEach((stat, i) => {
      setTimeout(() => {
        setStartTimes(prev => {
          const next = [...prev];
          next[i] = performance.now();
          return next;
        });
        // Mark done after count duration
        setTimeout(() => {
          setDoneFlags(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, 1800);
      }, stat.delay);
    });
    // Shimmer sweep after all done
    setTimeout(() => setShimmer(true), 2600);
  }, [canAnimate]);

  // Reset when leaving viewport
  useEffect(() => {
    if (!visible) {
      triggered.current = false;
      setStartTimes([null, null, null, null]);
      setDoneFlags([false, false, false, false]);
      setShimmer(false);
    }
  }, [visible]);

  const counts = STATS.map((s, i) => useCountUp(s.num, 1800, startTimes[i]));

  return (
    <section ref={ref} className="relative border-y border-gray-200 bg-[#d0d0d0] overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 py-5 md:py-8 xl:py-10 grid grid-cols-4 gap-2 md:gap-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="flex items-center justify-center gap-2 sm:gap-3"
            style={{
              opacity: startTimes[i] ? 1 : 0,
              transform: startTimes[i] ? (doneFlags[i] ? 'translateY(0) scale(1)' : 'translateY(0) scale(1)') : 'translateY(12px) scale(0.95)',
              transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
            }}
          >
            <div className="flex flex-col">
              <div
                className="relative text-xl sm:text-3xl md:text-4xl xl:text-5xl text-[var(--gold)] leading-none text-right"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  transform: doneFlags[i] ? 'scale(1)' : 'scale(1)',
                  animation: doneFlags[i] ? 'stat-pop 0.35s ease-out' : 'none',
                }}
              >
                <span className="invisible" suppressHydrationWarning>{stat.num.toLocaleString('de-CH')}{stat.suffix}</span>
                <span className="absolute inset-0 text-right" suppressHydrationWarning>{counts[i].toLocaleString('de-CH')}{stat.suffix}</span>
              </div>
              <div className="text-[9px] sm:text-xs xl:text-sm text-gray-700 uppercase tracking-wider">{stat.label}</div>
            </div>
            <div
              className="text-[var(--red-main)]"
              style={{
                animation: doneFlags[i] ? 'stat-icon-pop 0.4s ease-out' : 'none',
              }}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>
      {/* Gold shimmer sweep — kontinuierlich nach erster Animation */}
      {shimmer && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            width: '150px',
            left: '-150px',
            background: 'linear-gradient(110deg, transparent 0%, rgba(240,167,62,0.04) 20%, rgba(255,255,255,0.08) 50%, rgba(240,167,62,0.04) 80%, transparent 100%)',
            animation: 'stats-shimmer-loop 4s ease-in-out infinite',
          }}
        />
      )}
      <style jsx>{`
        @keyframes stat-pop {
          0% { transform: scale(1); }
          40% { transform: scale(1.15); }
          70% { transform: scale(0.97); }
          100% { transform: scale(1); }
        }
        @keyframes stat-icon-pop {
          0% { transform: scale(1) rotate(0deg); }
          40% { transform: scale(1.2) rotate(-5deg); }
          70% { transform: scale(0.95) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes stats-shimmer-loop {
          0% { left: -150px; opacity: 0; }
          5% { opacity: 1; }
          45% { left: 100%; opacity: 1; }
          50% { left: 100%; opacity: 0; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  );
}
