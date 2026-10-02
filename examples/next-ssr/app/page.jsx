import { compileMotion, defineMotion } from 'kinetrell/core';
import { MotionClient } from './motion-client.jsx';

export default function Page() {
  const motion = compileMotion(
    defineMotion({
      id: 'ssr-card',
      initial: { card: { opacity: 0.2, y: 24 } },
      tracks: [
        {
          target: 'card',
          to: { opacity: 1, y: 0 },
          durationMs: 420,
          ease: 'cubic.out',
        },
      ],
    }),
  );

  return (
    <main style={{ fontFamily: 'system-ui', padding: 40 }}>
      <h1>Kinetrell SSR boundary</h1>
      <p id="server-marker">
        This text is rendered by a Next.js Server Component using kinetrell/core.
      </p>
      <MotionClient motion={motion} />
    </main>
  );
}
