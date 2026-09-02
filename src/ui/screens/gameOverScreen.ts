import { SessionMetrics } from '../../types/game';
import { storage } from '../../core/storage';
import { audio } from '../../core/audio';
import { confetti } from '../components/confetti';
import { modals } from '../components/modals';

export class GameOverScreen {
  private container: HTMLElement | null = null;
  private metrics: SessionMetrics;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private onPlayAgain: (hardMode: boolean) => void;
  private onHome: () => void;

  constructor(
    metrics: SessionMetrics,
    callbacks: { onPlayAgain: (hardMode: boolean) => void; onHome: () => void }
  ) {
    this.metrics = metrics;
    this.onPlayAgain = callbacks.onPlayAgain;
    this.onHome = callbacks.onHome;
  }

  mount(parent: HTMLElement): void {
    this.container = parent;

    // Record stats and check if new best
    const { isNewBestScore, isNewBestStreak } = storage.recordGameCompletion({
      score: this.metrics.score,
      streak: this.metrics.maxStreak,
      correct: this.metrics.correctAnswers,
      wrong: this.metrics.wrongAnswers,
      totalReactionTimeMs: this.metrics.totalReactionTimeMs,
      bestReactionTimeMs: this.metrics.bestReactionTimeMs
    });

    const bestScore = storage.getBestScore();
    const bestStreak = storage.getBestStreak();

    // Trigger confetti if high score or great run
    if (isNewBestScore || this.metrics.score >= 50) {
      confetti.fire(90);
    }

    this.container.innerHTML = `
      <div class="screen-game-over">
        <!-- Top Header -->
        <header class="gameover-header">
          <button id="btn-gameover-home" class="btn-back">
            <span>🏠</span>
            <span>HOME</span>
          </button>

          <div class="gameover-header-center brand-logo-compact">
            <div class="brand-color-row">
              <span class="letter-c">C</span>
              <span class="letter-o1">O</span>
              <span class="letter-l">L</span>
              <span class="letter-o2">O</span>
              <span class="letter-r">R</span>
            </div>
            <div class="brand-trap-row">
              <span>T</span>
              <span>R</span>
              <span class="trap-letter-a">
                A
                <svg class="trap-warning-icon" viewBox="0 0 24 24" fill="none">
                  <polygon points="12,3 22,21 2,21" fill="#FFC400" stroke="#000000" stroke-width="2"/>
                  <circle cx="12" cy="17" r="1.5" fill="#000000"/>
                  <line x1="12" y1="8" x2="12" y2="13" stroke="#000000" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </span>
              <span>P</span>
            </div>
            <h1 class="game-over-title">GAME OVER!</h1>
            <div class="brand-tagline">
              <span class="part-white">DON'T READ IT.</span>
              <span class="part-yellow">SEE IT.</span>
            </div>
          </div>

          <button id="btn-gameover-share" class="btn-back">
            <span>🔗</span>
            <span>SHARE</span>
          </button>
        </header>

        <!-- 3 Results Cards -->
        <main class="gameover-cards-grid">
          <!-- Card 1: Score -->
          <div class="result-card">
            <div class="result-card-title">YOUR SCORE</div>
            <div class="score-big-display">
              <div class="score-big-val">${this.metrics.score}</div>
              ${isNewBestScore ? '<div class="badge-new-best">★ NEW BEST! ★</div>' : ''}
            </div>
            <div class="score-alltime-best">
              <span>👑 BEST SCORE</span>
              <strong>${bestScore}</strong>
            </div>
          </div>

          <!-- Card 2: Summary -->
          <div class="result-card">
            <div class="result-card-title">SUMMARY</div>
            <div class="summary-items-list">
              <div class="summary-row">
                <span class="summary-row-label"><span>🎯</span> CORRECT ANSWERS</span>
                <span class="summary-row-val val-green">${this.metrics.correctAnswers}</span>
              </div>
              <div class="summary-row">
                <span class="summary-row-label"><span>❌</span> WRONG ANSWERS</span>
                <span class="summary-row-val val-red">${this.metrics.wrongAnswers}</span>
              </div>
              <div class="summary-row">
                <span class="summary-row-label"><span>🔄</span> ACCURACY</span>
                <span class="summary-row-val val-cyan">${this.metrics.accuracyPercent}%</span>
              </div>
              <div class="summary-row">
                <span class="summary-row-label"><span>⚡</span> MAX STREAK</span>
                <span class="summary-row-val val-purple">x${this.metrics.maxStreak}</span>
              </div>
              <div class="summary-row">
                <span class="summary-row-label"><span>⏱️</span> AVG. REACTION TIME</span>
                <span class="summary-row-val val-orange">${this.metrics.averageReactionTimeMs} ms</span>
              </div>
            </div>
          </div>

          <!-- Card 3: Best Streak with Sunglasses Flame Mascot -->
          <div class="result-card">
            <div class="result-card-title">BEST STREAK</div>
            <div class="streak-big-val">x${this.metrics.maxStreak}</div>
            ${isNewBestStreak ? '<div class="badge-new-best" style="margin-top: 4px;">NEW BEST!</div>' : `<div style="font-size: 0.78rem; color: #B5C4E8; margin-top: 4px;">BEST: x${bestStreak}</div>`}
            
            <div class="flame-mascot-wrap">
              <!-- Animated Fire Flame Mascot with Cool Sunglasses -->
              <svg class="flame-mascot-svg" viewBox="0 0 100 100">
                <!-- Outer Flame -->
                <path d="M50,8 C55,22 75,32 78,50 C82,68 70,88 50,92 C30,88 18,68 22,50 C25,32 45,22 50,8 Z"
                  fill="url(#flameGradOuter)" filter="drop-shadow(0 0 8px #FF6600)" />
                <!-- Inner Flame -->
                <path d="M50,30 C53,40 66,48 68,60 C70,72 62,82 50,85 C38,82 30,72 32,60 C34,48 47,40 50,30 Z"
                  fill="url(#flameGradInner)" />
                <!-- Cute Sunglasses -->
                <rect x="26" y="52" width="20" height="13" rx="4" fill="#111111" stroke="#333333" stroke-width="1.5"/>
                <rect x="54" y="52" width="20" height="13" rx="4" fill="#111111" stroke="#333333" stroke-width="1.5"/>
                <line x1="46" y1="56" x2="54" y2="56" stroke="#111111" stroke-width="3"/>
                <!-- Sunglasses Glare -->
                <polygon points="28,54 36,54 32,62 28,62" fill="rgba(255,255,255,0.4)"/>
                <polygon points="56,54 64,54 60,62 56,62" fill="rgba(255,255,255,0.4)"/>
                <!-- Smile -->
                <path d="M42,72 Q50,78 58,72" stroke="#681500" stroke-width="2.5" stroke-linecap="round" fill="none"/>

                <defs>
                  <linearGradient id="flameGradOuter" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFE033" />
                    <stop offset="45%" stop-color="#FF6600" />
                    <stop offset="100%" stop-color="#FF2238" />
                  </linearGradient>
                  <linearGradient id="flameGradInner" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFFFFF" />
                    <stop offset="50%" stop-color="#FFE033" />
                    <stop offset="100%" stop-color="#FF8533" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </main>

        <!-- Actions Row -->
        <div class="gameover-actions-row">
          <button id="btn-replay-normal" class="btn-arcade btn-purple">
            🔄 PLAY AGAIN
          </button>
          <button id="btn-gameover-stats" class="btn-arcade btn-blue">
            📊 STATS
          </button>
          <button id="btn-replay-hard" class="btn-arcade btn-green">
            ▶ PLAY AGAIN (HARDER!)
          </button>
        </div>

        <!-- Bottom Tip Banner -->
        <footer class="gameover-bottom-banner">
          <div class="banner-left">
            <span style="font-size: 1.2rem;">💡</span>
            <span><strong>TIP:</strong> Trust your eyes, not your brain.</span>
          </div>
          <div class="banner-right">
            “ FOCUS. REACT. WIN. ”
          </div>
        </footer>
      </div>
    `;

    document.getElementById('btn-gameover-home')?.addEventListener('click', () => {
      audio.playClick();
      this.onHome();
    });

    document.getElementById('btn-replay-normal')?.addEventListener('click', () => {
      audio.playClick();
      this.onPlayAgain(false);
    });

    document.getElementById('btn-replay-hard')?.addEventListener('click', () => {
      audio.playClick();
      this.onPlayAgain(true);
    });

    document.getElementById('btn-gameover-stats')?.addEventListener('click', () => {
      audio.playClick();
      modals.showStatsModal();
    });

    document.getElementById('btn-gameover-share')?.addEventListener('click', () => {
      audio.playClick();
      if (navigator.share) {
        navigator.share({
          title: 'Color Trap!',
          text: `I scored ${this.metrics.score} points with a ${this.metrics.maxStreak}x streak in Color Trap! Can you beat me?`,
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(
          `I scored ${this.metrics.score} points in Color Trap with a ${this.metrics.maxStreak}x streak! Don't read it. See it.`
        );
        alert('Score copied to clipboard! Share it with friends!');
      }
    });

    // Keyboard support
    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        audio.playClick();
        this.onPlayAgain(false);
      } else if (e.code === 'Escape') {
        e.preventDefault();
        audio.playClick();
        this.onHome();
      }
    };
    window.addEventListener('keydown', this.keydownHandler);
  }

  unmount(): void {
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    confetti.clear();
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
  }
}
