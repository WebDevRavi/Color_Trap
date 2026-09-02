import { storage } from '../../core/storage';
import { audio } from '../../core/audio';
import { modals } from '../components/modals';

export class HomeScreen {
  private container: HTMLElement | null = null;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private storageUnsubscribe: (() => void) | null = null;
  private onPlay: () => void;
  private onHowToPlay: () => void;

  constructor(callbacks: { onPlay: () => void; onHowToPlay: () => void }) {
    this.onPlay = callbacks.onPlay;
    this.onHowToPlay = callbacks.onHowToPlay;
  }

  mount(parent: HTMLElement): void {
    this.container = parent;
    const bestScore = storage.getBestScore();
    const rewardPoints = storage.getRewardPoints();
    const isMuted = audio.isSoundMuted();

    this.container.innerHTML = `
      <div class="screen-home">
        <!-- Top Header with Best Score and Reward Points -->
        <header class="home-header">
          <div class="home-header-left">
            <div class="badge-best-score" title="Your highest single-session score">
              <span class="label">👑 BEST SCORE</span>
              <span class="value" id="home-best-score-val">${bestScore}</span>
            </div>
            <div class="badge-reward-points" title="Total Reward Points balance">
              <span class="label">💎 REWARD POINTS</span>
              <span class="value" id="home-reward-points-val">${rewardPoints}</span>
            </div>
            <button id="btn-home-difficulty" class="badge-difficulty-select" title="Click to Change Difficulty Mode">
              <span>⚡ MODE:</span>
              <span class="val-diff" id="home-difficulty-val">${storage.getSettings().difficulty}</span>
            </button>
          </div>

          <div class="home-header-right">
            <button id="home-btn-audio" class="btn-circle-icon" aria-label="Toggle Sound" title="Sound Mute/Unmute">
              <span id="audio-icon-span" style="font-size: 1.4rem;">${isMuted ? '🔇' : '🔊'}</span>
            </button>
            <button id="home-btn-settings" class="btn-circle-icon" aria-label="Open Settings" title="Settings">
              <span style="font-size: 1.4rem;">⚙️</span>
            </button>
          </div>
        </header>

        <!-- Center Brand & CTA -->
        <main class="home-center">
          <div class="brand-logo-container">
            <div class="brand-splash-fx">
              <svg viewBox="0 0 500 320" style="width: 100%; height: 100%; overflow: visible;" fill="none">
                <!-- Top Blue Splatter -->
                <path d="M250,50 C230,10 210,0 190,15 C170,30 200,50 180,65 C160,80 140,70 120,95 C140,110 170,100 200,110 C230,120 270,110 300,100 C340,90 350,50 330,30 C310,10 280,30 250,50 Z" fill="#0088FF" opacity="0.95"/>
                <circle cx="210" cy="10" r="8" fill="#0088FF" />
                <circle cx="280" cy="5" r="10" fill="#00C8FF" />
                <circle cx="345" cy="20" r="7" fill="#0088FF" />

                <!-- Left Red/Orange Splatter -->
                <path d="M140,110 C90,80 60,95 40,120 C20,150 50,180 30,210 C10,240 30,270 70,270 C100,270 120,240 140,220 C160,200 170,150 140,110 Z" fill="#FF1A38" opacity="0.95"/>
                <circle cx="25" cy="115" r="9" fill="#FF1A38" />
                <circle cx="15" cy="180" r="11" fill="#FF6D1B" />
                <circle cx="45" cy="250" r="8" fill="#FF1A38" />

                <!-- Right Green Splatter -->
                <path d="M360,110 C410,80 440,95 460,120 C480,150 450,180 470,210 C490,240 470,270 430,270 C400,270 380,240 360,220 C340,200 330,150 360,110 Z" fill="#14C834" opacity="0.95"/>
                <circle cx="475" cy="115" r="9" fill="#14C834" />
                <circle cx="485" cy="180" r="11" fill="#FFB800" />
                <circle cx="455" cy="250" r="8" fill="#14C834" />

                <!-- Bottom Purple/Magenta Splatter -->
                <path d="M180,220 C150,250 170,290 200,300 C240,310 270,310 310,295 C340,280 340,250 320,230 C300,210 270,220 250,220 C220,220 200,200 180,220 Z" fill="#A23DF5" opacity="0.9"/>
                <circle cx="210" cy="315" r="9" fill="#A23DF5" />
                <circle cx="295" cy="310" r="10" fill="#FF2680" />
              </svg>
            </div>
            <div class="brand-splatters-wrap">
              <div class="brand-title">
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
              </div>
              <div class="brand-tagline">
                <span class="part-white">DON'T READ IT.</span>
                <span class="part-yellow">SEE IT.</span>
              </div>
            </div>
          </div>

          <div class="home-actions-primary">
            <button id="btn-home-play" class="btn-arcade btn-primary-yellow">
              PLAY ▶
            </button>
          </div>

          <!-- Secondary Actions including STATS, HOW TO PLAY, ACHIEVEMENTS -->
          <div class="home-actions-secondary">
            <button id="btn-home-howto" class="btn-arcade btn-purple">
              📖 HOW TO PLAY
            </button>
            <button id="btn-home-stats" class="btn-arcade btn-blue">
              📊 STATS
            </button>
            <button id="btn-home-achieve" class="btn-arcade btn-purple">
              🏆 ACHIEVEMENTS
            </button>
          </div>
        </main>

        <!-- Bottom Footer -->
        <footer class="home-footer">
          <div class="shop-btn-wrap">
            <button id="btn-home-shop" class="btn-circle-icon" aria-label="Arcade Shop" title="Arcade Shop">
              <span style="font-size: 1.4rem;">🛒</span>
            </button>
            <span class="shop-btn-label">SHOP</span>
          </div>

          <div class="keyboard-hint-bar" aria-label="Keyboard Shortcut Hints">
            <span>⌨️ KEYBOARD:</span>
            <span class="key-badge key-badge-1">1</span>
            <span class="key-badge key-badge-2">2</span>
            <span class="key-badge key-badge-3">3</span>
            <span class="key-badge key-badge-4">4</span>
          </div>

          <div id="btn-home-reward" class="daily-reward-box" title="Claim Daily Reward">
            <div style="font-size: 2.8rem; line-height: 1; filter: drop-shadow(0 4px 10px rgba(168, 54, 245, 0.7));">🎁</div>
            <span class="daily-reward-btn">DAILY REWARD</span>
          </div>
        </footer>
      </div>
    `;

    // Event Listeners
    document.getElementById('btn-home-play')?.addEventListener('click', () => {
      audio.playClick();
      this.onPlay();
    });

    document.getElementById('btn-home-howto')?.addEventListener('click', () => {
      audio.playClick();
      this.onHowToPlay();
    });

    document.getElementById('btn-home-stats')?.addEventListener('click', () => {
      audio.playClick();
      modals.showStatsModal();
    });

    document.getElementById('btn-home-achieve')?.addEventListener('click', () => {
      audio.playClick();
      modals.showAchievementsModal();
    });

    document.getElementById('home-btn-audio')?.addEventListener('click', () => {
      const soundOn = audio.toggleSound();
      const iconSpan = document.getElementById('audio-icon-span');
      if (iconSpan) {
        iconSpan.textContent = soundOn ? '🔊' : '🔇';
      }
    });

    document.getElementById('home-btn-settings')?.addEventListener('click', () => {
      audio.playClick();
      modals.showSettingsModal((soundEnabled) => {
        const iconSpan = document.getElementById('audio-icon-span');
        if (iconSpan) {
          iconSpan.textContent = soundEnabled ? '🔊' : '🔇';
        }
      });
    });

    document.getElementById('btn-home-shop')?.addEventListener('click', () => {
      audio.playClick();
      modals.showShopModal();
    });

    document.getElementById('btn-home-reward')?.addEventListener('click', () => {
      audio.playClick();
      modals.showDailyRewardModal();
    });

    document.getElementById('btn-home-difficulty')?.addEventListener('click', () => {
      audio.playClick();
      const current = storage.getSettings().difficulty;
      const sequence: import('../../types/game').DifficultyLevel[] = ['NORMAL', 'HARD', 'VERY HARD', 'EASY'];
      const currentIndex = sequence.indexOf(current);
      const nextDiff = sequence[(currentIndex + 1) % sequence.length];
      storage.saveSettings({ difficulty: nextDiff });
    });

    // Subscribe to storage changes for real-time badge updates (points, best score, difficulty)
    this.storageUnsubscribe = storage.subscribe(() => {
      this.updateBadges();
    });

    // Keyboard support
    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        audio.playClick();
        this.onPlay();
      } else if (e.key.toLowerCase() === 'h') {
        audio.playClick();
        this.onHowToPlay();
      } else if (e.key.toLowerCase() === 's') {
        audio.playClick();
        modals.showStatsModal();
      }
    };
    window.addEventListener('keydown', this.keydownHandler);
  }

  private updateBadges(): void {
    const scoreVal = document.getElementById('home-best-score-val');
    if (scoreVal) {
      scoreVal.textContent = storage.getBestScore().toString();
    }
    const pointsVal = document.getElementById('home-reward-points-val');
    if (pointsVal) {
      pointsVal.textContent = storage.getRewardPoints().toString();
    }
    const diffVal = document.getElementById('home-difficulty-val');
    if (diffVal) {
      diffVal.textContent = storage.getSettings().difficulty;
    }
  }

  unmount(): void {
    if (this.storageUnsubscribe) {
      this.storageUnsubscribe();
      this.storageUnsubscribe = null;
    }
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
  }
}
