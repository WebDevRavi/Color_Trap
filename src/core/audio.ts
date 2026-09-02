import { storage } from './storage';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private musicOscillator: OscillatorNode | null = null;
  private musicGain: GainNode | null = null;

  constructor() {
    const settings = storage.getSettings();
    this.isMuted = !settings.soundEnabled;
    this.isMusicMuted = !settings.musicEnabled;
  }

  private initCtx(): AudioContext | null {
    if (this.isMuted) return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  isSoundMuted(): boolean {
    return this.isMuted;
  }

  isMusicMutedState(): boolean {
    return this.isMusicMuted;
  }

  toggleSound(): boolean {
    this.isMuted = !this.isMuted;
    storage.saveSettings({ soundEnabled: !this.isMuted });
    if (!this.isMuted) {
      this.playClick();
    }
    return !this.isMuted;
  }

  playClick(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.06);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // safe fallback
    }
  }

  playCorrect(streak: number = 0): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Base frequencies scale up with streak
      const baseFreq = Math.min(880, 523.25 + Math.min(streak, 20) * 18); // C5 upwards
      
      // Dual harmonic chime
      [baseFreq, baseFreq * 1.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.03);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.18 + idx * 0.03);

        gain.gain.setValueAtTime(0.18, now + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22 + idx * 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.03);
        osc.stop(now + 0.25 + idx * 0.03);
      });
    } catch {
      // safe fallback
    }
  }

  playWrong(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.22);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.24);
    } catch {
      // safe fallback
    }
  }

  playCountdownBeep(isGo: boolean = false): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const freq = isGo ? 880 : 440; // A5 for GO, A4 for 3,2,1
      const duration = isGo ? 0.35 : 0.12;

      osc.frequency.setValueAtTime(freq, now);
      if (isGo) {
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + duration); // D6
      }

      gain.gain.setValueAtTime(isGo ? 0.28 : 0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // safe fallback
    }
  }

  playStreakMilestone(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.2, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.22);
      });
    } catch {
      // safe fallback
    }
  }

  playGameOver(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const chords = [
        [523.25, 659.25, 783.99],  // C major
        [587.33, 739.99, 880.00],  // D major
        [659.25, 830.61, 987.77],  // E major
        [783.99, 987.77, 1174.66], // G major flourish
      ];
      const now = ctx.currentTime;

      chords.forEach((chord, chordIdx) => {
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + chordIdx * 0.14);

          gain.gain.setValueAtTime(0.12, now + chordIdx * 0.14);
          gain.gain.exponentialRampToValueAtTime(0.001, now + chordIdx * 0.14 + (chordIdx === chords.length - 1 ? 0.6 : 0.25));

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + chordIdx * 0.14);
          osc.stop(now + chordIdx * 0.14 + (chordIdx === chords.length - 1 ? 0.65 : 0.28));
        });
      });
    } catch {
      // safe fallback
    }
  }

  cleanup(): void {
    if (this.musicOscillator) {
      try {
        this.musicOscillator.stop();
        this.musicOscillator.disconnect();
      } catch {
        // safe
      }
      this.musicOscillator = null;
    }
    if (this.musicGain) {
      try {
        this.musicGain.disconnect();
      } catch {
        // safe
      }
      this.musicGain = null;
    }
  }
}

export const audio = new SoundEngine();
