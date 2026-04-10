'use client';

import { useEffect, useRef, useState, useCallback, ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  mobileOnly?: boolean;
  /** Base animation duration in ms (default 500) */
  duration?: number;
  /**
   * If true, the reveal duration + delay adapt to the user's current scroll
   * velocity: slow scroll → longer (reading pace), fast flick → shorter.
   */
  adaptive?: boolean;
}

// Module-level scroll-velocity tracker. Installed once, shared across all
// ScrollReveal instances so each can query the current swipe speed cheaply.
let currentVelocity = 0; // px / ms, smoothed absolute value
let velocityInstalled = false;

function installVelocityTracker() {
  if (velocityInstalled || typeof window === 'undefined') return;
  velocityInstalled = true;
  let lastY = window.scrollY;
  let lastTs = performance.now();
  const onScroll = () => {
    const now = performance.now();
    const y = window.scrollY;
    const dt = now - lastTs;
    if (dt > 0) {
      const v = Math.abs(y - lastY) / dt;
      currentVelocity = currentVelocity * 0.6 + v * 0.4;
    }
    lastY = y;
    lastTs = now;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Map scroll velocity (px/ms) to a duration multiplier.
 *   < 0.4 px/ms  → slow / reading    → 1.8× base
 *   0.4–1.5      → normal swipe       → 1.0× base
 *   > 1.5        → fast flick / skim  → 0.55× base
 */
function velocityToMultiplier(v: number): number {
  if (v < 0.4) return 1.8;
  if (v > 1.5) return 0.55;
  const t = (v - 0.4) / (1.5 - 0.4);
  return 1.8 + (0.55 - 1.8) * t;
}

export default function ScrollReveal({
  children,
  delay = 0,
  className = '',
  mobileOnly = false,
  duration = 500,
  adaptive = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [actualDuration, setActualDuration] = useState(duration);
  const triggered = useRef(false);

  const reveal = useCallback(() => {
    if (triggered.current) return;
    triggered.current = true;

    let effectiveDuration = duration;
    let effectiveDelay = delay;
    if (adaptive) {
      const mult = velocityToMultiplier(currentVelocity);
      effectiveDuration = Math.round(duration * mult);
      effectiveDelay = Math.round(delay * mult);
    }
    setActualDuration(effectiveDuration);

    if (effectiveDelay > 0) {
      setTimeout(() => setVisible(true), effectiveDelay);
    } else {
      setVisible(true);
    }
  }, [delay, duration, adaptive]);

  useEffect(() => {
    // Desktop + mobileOnly: CSS media query guarantees visibility. Nothing to do.
    if (mobileOnly && typeof window !== 'undefined' && window.innerWidth >= 1024) {
      return;
    }

    if (adaptive) installVelocityTracker();

    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: '0px 0px 50px 0px' }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      reveal();
    }
  }, [reveal, mobileOnly, adaptive]);

  // mobileOnly path: use CSS classes so a media query can force desktop to
  // always be visible with no animation, no flash, no hydration mismatch.
  if (mobileOnly) {
    const style = { '--sr-duration': `${actualDuration}ms` } as CSSProperties;
    return (
      <div
        ref={ref}
        className={`sr-mobile ${visible ? 'sr-visible' : ''} ${className}`.trim()}
        style={style}
      >
        {children}
      </div>
    );
  }

  // Default path (e.g. league/team cards): inline-style fade on all viewports.
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity ${actualDuration}ms ease-out, transform ${actualDuration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
}
