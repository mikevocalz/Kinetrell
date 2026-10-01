import type { CompiledMotion } from './types.js';

export type TimelineSnapshot = Readonly<{
  timeMs: number;
  progress: number;
  direction: 1 | -1;
  playing: boolean;
  playbackRate: number;
}>;

export class TimelineClock {
  #motion: CompiledMotion;
  #state: TimelineSnapshot;
  constructor(motion: CompiledMotion) {
    this.#motion = motion;
    this.#state = Object.freeze({ timeMs: 0, progress: 0, direction: 1, playing: false, playbackRate: 1 });
  }
  get snapshot(): TimelineSnapshot { return this.#state; }
  play() { this.#patch({ playing: true, direction: 1 }); return this; }
  pause() { this.#patch({ playing: false }); return this; }
  reverse() { this.#patch({ playing: true, direction: -1 }); return this; }
  restart() { this.#patch({ timeMs: 0, progress: 0, direction: 1, playing: true }); return this; }
  seek(timeMs: number) {
    const time = Math.min(Math.max(0, timeMs), this.#motion.durationMs);
    this.#patch({ timeMs: time, progress: this.#motion.durationMs === 0 ? 1 : time / this.#motion.durationMs });
    return this;
  }
  setProgress(progress: number) { return this.seek(Math.min(1, Math.max(0, progress)) * this.#motion.durationMs); }
  setPlaybackRate(playbackRate: number) {
    if (!Number.isFinite(playbackRate) || playbackRate <= 0) throw new RangeError('playbackRate must be > 0');
    this.#patch({ playbackRate }); return this;
  }
  tick(deltaMs: number) {
    if (!this.#state.playing) return this.#state;
    return this.seek(this.#state.timeMs + deltaMs * this.#state.playbackRate * this.#state.direction).snapshot;
  }
  #patch(patch: Partial<TimelineSnapshot>) { this.#state = Object.freeze({ ...this.#state, ...patch }); }
}
