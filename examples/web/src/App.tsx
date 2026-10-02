import { useEffect, useMemo, useRef, useState } from 'react';
import { compileMotion, defineMotion } from 'kinetrell/core';
import {
  attachScrollTrigger,
  createGsapTimeline,
} from 'kinetrell/web/gsap';
import { ReactLenis, createKinetrellLenis, useKinetrellLenis } from 'kinetrell/web/lenis';
import { connectGsapLenis } from 'kinetrell/web/gsap-lenis';
import 'lenis/dist/lenis.css';
import './styles.css';

const heroMotion = defineMotion({
  id: 'web-hero',
  initial: {
    panel: { opacity: 0.25, y: 64, scale: 0.94 },
    title: { opacity: 0, y: 28 },
  },
  tracks: [
    {
      target: 'panel',
      to: { opacity: 1, y: 0, scale: 1 },
      durationMs: 900,
      ease: 'cubic.out',
    },
    {
      target: 'title',
      to: { opacity: 1, y: 0 },
      atMs: 140,
      durationMs: 620,
      ease: 'power2.out',
    },
  ],
});


function ReactLenisProbe() {
  const lenis = useKinetrellLenis();

  return (
    <div className="react-lenis-status">
      <strong>ReactLenis / useLenis interop</strong>
      <span>{lenis ? 'context connected' : 'initializing'}</span>
    </div>
  );
}

function ReactLenisInterop() {
  return (
    <section className="react-lenis-section" aria-labelledby="react-lenis-title">
      <div className="react-lenis-copy">
        <p className="eyebrow">CALLER-OWNED REACT CONTEXT</p>
        <h2 id="react-lenis-title">The official ReactLenis path works too.</h2>
        <p>
          This nested provider is intentionally separate from the page's root
          GSAP-driven Lenis instance. Kinetrell re-exports ReactLenis and maps
          useKinetrellLenis() directly to the official useLenis() hook.
        </p>
      </div>

      <ReactLenis options={{ autoRaf: true, smoothWheel: true }}>
        <div className="react-lenis-box">
          <ReactLenisProbe />
          <div className="react-lenis-scroll-content">
            {Array.from({ length: 8 }, (_, index) => (
              <div className="react-lenis-card" key={index}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>Nested Lenis content</strong>
              </div>
            ))}
          </div>
        </div>
      </ReactLenis>
    </section>
  );
}

export function App() {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const [renderer, setRenderer] = useState('initializing');

  const motion = useMemo(() => compileMotion(heroMotion), []);

  useEffect(() => {
    const panel = panelRef.current;
    const title = titleRef.current;
    const trigger = triggerRef.current;

    if (!panel || !title || !trigger) return;

    const ownedLenis = createKinetrellLenis({
      autoRaf: false,
      smoothWheel: true,
      lerp: 0.09,
    });
    const disconnect = connectGsapLenis(ownedLenis.lenis, {
      clock: 'kinetrell',
    });

    const timeline = createGsapTimeline(
      motion,
      { panel, title },
      { paused: true },
    );

    const scrollTrigger = attachScrollTrigger(timeline, {
      trigger,
      start: 'top 78%',
      end: 'bottom 28%',
      scrub: true,
    });

    setRenderer('GSAP + ScrollTrigger + Lenis');

    return () => {
      scrollTrigger.kill();
      timeline.kill();
      disconnect();
      ownedLenis.destroy();
    };
  }, [motion]);

  return (
    <main>
      <header className="topbar">
        <strong>Kinetrell</strong>
        <span>{renderer}</span>
      </header>

      <section className="intro">
        <p className="eyebrow">ONE MOTION LANGUAGE</p>
        <h1>Native execution. Real browser engines.</h1>
        <p>
          Scroll to scrub the exact same portable timeline through the actual
          GSAP and Lenis packages.
        </p>
      </section>

      <section ref={triggerRef} className="stage">
        <div ref={panelRef} className="motion-panel">
          <p className="eyebrow">PORTABLE TIMELINE</p>
          <h2 ref={titleRef}>Reanimated on native. GSAP on the web.</h2>
          <div className="chips">
            <span>GSAP 3.15</span>
            <span>Lenis 1.3</span>
            <span>Reanimated 4.7</span>
            <span>Worklets 0.13</span>
          </div>
        </div>
      </section>

      <ReactLenisInterop />

      <section className="outro">
        <h2>No browser physics smuggled into native.</h2>
        <p>
          Kinetrell shares motion intent while leaving each platform's runtime
          in charge of the work it does best.
        </p>
      </section>
    </main>
  );
}
