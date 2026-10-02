import { useEffect, useMemo, useRef } from 'react';
import { compileMotion, defineMotion } from 'kinetrell/core';
import { createGsapTimeline, attachScrollTrigger } from 'kinetrell/web/gsap';
import {
  ReactLenis,
  useKinetrellLenis,
} from 'kinetrell/web/lenis';
import { connectGsapLenis } from 'kinetrell/web/gsap-lenis';

const motion = compileMotion(
  defineMotion({
    id: 'react-lenis-card',
    initial: { card: { opacity: 0.25, y: 80, scale: 0.92 } },
    tracks: [
      {
        target: 'card',
        to: { opacity: 1, y: 0, scale: 1 },
        durationMs: 1000,
        ease: 'cubic.out',
      },
    ],
  }),
);

function Scene() {
  const cardRef = useRef<HTMLDivElement>(null);
  const lenis = useKinetrellLenis();
  const targets = useMemo(
    () => (cardRef.current ? { card: cardRef.current } : null),
    [cardRef.current],
  );

  useEffect(() => {
    if (!lenis || !targets) return;

    // ReactLenis owns RAF. Kinetrell only subscribes ScrollTrigger updates.
    const disconnect = connectGsapLenis(lenis, {
      clock: 'external',
      refreshOnConnect: true,
    });

    const timeline = createGsapTimeline(motion, targets, { paused: true });
    const trigger = attachScrollTrigger(timeline, {
      trigger: cardRef.current,
      start: 'top 85%',
      end: 'top 35%',
      scrub: true,
    });

    return () => {
      trigger.kill();
      timeline.kill();
      disconnect();
    };
  }, [lenis, targets]);

  return (
    <main className="page">
      <section className="intro">
        <p className="eyebrow">KINETRELL × LENIS/REACT</p>
        <h1>Caller-owned smooth scrolling.</h1>
        <p>
          ReactLenis owns the scroll clock; Kinetrell consumes the existing
          instance without creating or destroying another one.
        </p>
      </section>
      <section className="stage">
        <div ref={cardRef} className="card">
          <strong>Portable motion → real GSAP ScrollTrigger</strong>
          <span>Scroll to scrub this card into place.</span>
        </div>
      </section>
      <section className="tail">Native keeps native scroll. Web can opt into Lenis.</section>
    </main>
  );
}

export default function App() {
  return (
    <ReactLenis root options={{ autoRaf: true }}>
      <Scene />
    </ReactLenis>
  );
}
