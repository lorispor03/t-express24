'use client';

import { useEffect, useRef, useState, ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  mobileOnly?: boolean;
  /** Animation duration in ms (default 500) */
  duration?: number;
  /** @deprecated No longer used, kept for backwards compatibility */
  adaptive?: boolean;
}

export default function ScrollReveal({
  children,
  delay = 0,
  className = '',
  mobileOnly = false,
  duration = 500,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (mobileOnly && typeof window !== 'undefined' && window.innerWidth >= 1024) {
      return;
    }

    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !triggered.current) {
            triggered.current = true;
            if (delay > 0) {
              setTimeout(() => setVisible(true), delay);
            } else {
              setVisible(true);
            }
            observer.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: '0px 0px 50px 0px' },
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      setVisible(true);
    }
  }, [delay, mobileOnly]);

  if (mobileOnly) {
    const style = { '--sr-duration': `${duration}ms` } as CSSProperties;
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

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
}
