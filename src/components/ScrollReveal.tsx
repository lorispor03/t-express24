'use client';

import { useEffect, useRef, useState, useCallback, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  mobileOnly?: boolean;
}

export default function ScrollReveal({ children, delay = 0, className = '', mobileOnly = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);

  const reveal = useCallback(() => {
    if (triggered.current) return;
    triggered.current = true;
    if (delay > 0) {
      setTimeout(() => setVisible(true), delay);
    } else {
      setVisible(true);
    }
  }, [delay]);

  useEffect(() => {
    // On desktop with mobileOnly: show immediately
    if (mobileOnly && typeof window !== 'undefined' && window.innerWidth >= 1024) {
      reveal();
      return;
    }

    const el = ref.current;
    if (!el) return;

    // Use IntersectionObserver if available
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
      // Fallback: just show it
      reveal();
    }
  }, [reveal, mobileOnly]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
      }}
    >
      {children}
    </div>
  );
}
