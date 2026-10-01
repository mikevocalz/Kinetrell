import type { CompiledMotion } from './types.js';

export type TimelineStatus =
  | 'idle'
  | 'playing'
  | 'paused'
  | 'completed'
  | 'cancelled'
  | 'disposed';

export type TimelineSnapshot = Readonly<{
  timeMs: number;
  progress: number;
  direction: 1 | -1;
  status: TimelineStatus;
  playbackRate: number;
}>;

export class TimelineClock {
  #motion: CompiledMotion;
  #state: TimelineSnapshot;

  constructor(motion: CompiledMotion) {
    this.#motion = motion;
    this.#state = Object.freeze({
      timeMs: 0,
      progress: motion.durationMs === 0 ? 1 : 0,
      direction: 1,
      status: 'idle',
      playbackRate: 1,
    });
  }

  get snapshot(): TimelineSnapshot {
    return this.#state;
  }

  play() {
    this.#assertAlive();
    if (this.#state.direction === 1 && this.#state.timeMs >= this.#motion.durationMs) {
      return this.restart();
    }
    this.#patch({ status: 'playing', direction: 1 });
    return this;
  }

  pause() {
    this.#assertAlive();
    if (this.#state.status === 'playing') this.#patch({ status: 'paused' });
    return this;
  }

  resume() {
    this.#assertAlive();
    if (this.#state.status === 'paused' || this.#state.status === 'idle') {
      this.#patch({ status: 'playing' });
    }
    return this;
  }

  reverse() {
    this.#assertAlive();
    if (this.#state.timeMs <= 0) {
      this.#patch({
        timeMs: this.#motion.durationMs,
        progress: this.#motion.durationMs === 0 ? 1 : 1,
      });
    }
    this.#patch({ status: 'playing', direction: -1 });
    return this;
  }

  restart() {
    this.#assertAlive();
    this.#patch({
      timeMs: 0,
      progress: this.#motion.durationMs === 0 ? 1 : 0,
      direction: 1,
      status: 'playing',
    });
    return this;
  }

  seek(timeMs: number) {
    this.#assertAlive();
    if (!Number.isFinite(timeMs)) throw new RangeError('timeMs must be finite');
    const time = Math.min(Math.max(0, timeMs), this.#motion.durationMs);
    this.#patch({
      timeMs: time,
      progress: this.#motion.durationMs === 0 ? 1 : time / this.#motion.durationMs,
    });
    return this;
  }

  setProgress(progress: number) {
    this.#assertAlive();
    if (!Number.isFinite(progress)) throw new RangeError('progress must be finite');
    return this.seek(Math.min(1, Math.max(0, progress)) * this.#motion.durationMs);
  }

  setPlaybackRate(playbackRate: number) {
    this.#assertAlive();
    if (!Number.isFinite(playbackRate) || playbackRate <= 0) {
      throw new RangeError('playbackRate must be > 0');
    }
    this.#patch({ playbackRate });
    return this;
  }

  cancel() {
    this.#assertAlive();
    this.#patch({ status: 'cancelled' });
    return this;
  }

  dispose() {
    if (this.#state.status !== 'disposed') this.#patch({ status: 'disposed' });
  }

  tick(deltaMs: number) {
    this.#assertAlive();
    if (!Number.isFinite(deltaMs) || deltaMs < 0) throw new RangeError('deltaMs must be >= 0');
    if (this.#state.status !== 'playing') return this.#state;

    const next =
      this.#state.timeMs +
      deltaMs * this.#state.playbackRate * this.#state.direction;

    if (this.#state.direction === 1 && next >= this.#motion.durationMs) {
      this.seek(this.#motion.durationMs);
      this.#patch({ status: 'completed' });
      return this.#state;
    }

    if (this.#state.direction === -1 && next <= 0) {
      this.seek(0);
      this.#patch({ status: 'completed' });
      return this.#state;
    }

    this.seek(next);
    return this.#state;
  }

  #patch(patch: Partial<TimelineSnapshot>) {
    this.#state = Object.freeze({ ...this.#state, ...patch });
  }

  #assertAlive() {
    if (this.#state.status === 'disposed') throw new Error('TimelineClock is disposed');
  }
}
