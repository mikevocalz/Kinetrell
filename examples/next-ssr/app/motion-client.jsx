'use client';

import { useEffect, useRef, useState } from 'react';
import { createGsapTimeline } from 'kinetrell/web/gsap';
import { createKinetrellLenis } from 'kinetrell/web/lenis';
import { connectGsapLenis } from 'kinetrell/web/gsap-lenis';

export function MotionClient({ motion }) {
  const cardRef = useRef(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    const ownedLenis = createKinetrellLenis({ autoRaf: true });
    const disconnect = connectGsapLenis(ownedLenis.lenis, {
      clock: 'external',
      refreshOnConnect: false,
    });

    const timeline = createGsapTimeline(
      motion,
      { card: cardRef.current },
      { paused: true },
    );
    timeline.play();
    setHydrated(true);

    return () => {
      timeline.kill();
      disconnect();
      ownedLenis.destroy();
    };
  }, [motion]);

  return (
    <section
      ref={cardRef}
      id="motion-card"
      style={{
        marginTop: 32,
        padding: 24,
        borderRadius: 20,
        background: '#101827',
        color: 'white',
      }}
    >
      <strong>Browser adapter loaded</strong>
      <div id="hydration-marker">
        {hydrated ? 'hydrated' : 'server-shell'}
      </div>
    </section>
  );
}
