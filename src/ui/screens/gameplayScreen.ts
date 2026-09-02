import { Challenge, SessionMetrics } from '../../types/game';
import { GAME_CONFIG } from '../../config/gameConfig';
import { SessionManager } from '../../core/sessionManager';
import { ChallengeGenerator } from '../../challenges/challengeGenerator';
import { storage } from '../../core/storage';
import { audio } from '../../core/audio';
import { platform } from '../../platform/crazyGamesAdapter';
import { TimerComponent } from '../components/timerComponent';
import { StreakBarComponent } from '../components/streakBar';
import { ChallengeRenderer } from '../components/challengeRenderer';
import { modals } from '../components/modals';

export class GameplayScreen {
  private container: HTMLElement | null = null;
  private session: SessionManager;
  private generator: ChallengeGenerator;
  private timerComponent: TimerComponent;
  private streakBarComponent: StreakBarComponent;

  private currentChallenge: Challenge | null = null;
  private isResolvingAnswer: boolean = false;
  private isCountingDown: boolean = true;
  private isPaused: boolean = false;
  private feedbackTimeout: number | null = null;
  private countdownInterval: number | null = null;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;

  private onGameOver: (metrics: SessionMetrics) => void;
  private onQuitToHome: () => void;

  constructor(callbacks: { onGameOver: (metrics: SessionMetrics) => void; onQuitToHome: () => void }) {
    this.onGameOver = callbacks.onGameOver;
    this.onQuitToHome = callbacks.onQuitToHome;
    const settings = storage.getSettings();
    this.session = new SessionManager(settings.difficulty);
    this.generator = new ChallengeGenerator(settings.hardMode);
    this.timerComponent = new TimerComponent(GAME_CONFIG.SESSION_DURATION_SEC);
    this.streakBarComponent = new StreakBarComponent();
  }

  mount(parent: HTMLElement): void {
    this.container = parent;
    const bestScore = storage.getBestScore();
    const bestStreak = storage.getBestStreak();
    const currentDiff = this.session.getMetrics().difficulty;

    this.container.innerHTML = `
      <div class="screen-gameplay">
        <!-- Countdown Overlay -->
        <div id="gameplay-countdown" class="countdown-overlay">
          <div id="countdown-text" class="countdown-number">3</div>
        </div>

        <!-- Top HUD Bar -->
        <header class="gameplay-hud-top">
          <div class="hud-left-group">
            <button id="btn-gameplay-pause" class="btn-pause" aria-label="Pause Game" title="Pause">
              <span>❚❚</span>
            </button>
            <div id="timer-container-mount"></div>
          </div>

          <div class="brand-logo-compact">
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
            <div class="hud-difficulty-badge" id="hud-difficulty-badge">MODE: ${currentDiff}</div>
          </div>

          <div class="hud-right-group">
            <div class="hud-stat-pill">
              <span class="hud-stat-title">SCORE</span>
              <span id="hud-score-val" class="hud-stat-val-score">0</span>
              <span class="hud-stat-sub">BEST <span id="hud-best-score-val">${bestScore}</span></span>
            </div>

            <div class="hud-stat-pill">
              <span class="hud-stat-title">STREAK</span>
              <span id="hud-streak-val" class="hud-stat-val-streak">x0</span>
              <span class="hud-stat-sub">BEST: x<span id="hud-best-streak-val">${bestStreak}</span></span>
            </div>
          </div>
        </header>

        <!-- Rainbow Intensity Progress Bar -->
        <div id="streakbar-container-mount" style="width: 100%; max-width: 820px;"></div>

        <!-- Central Challenge Card -->
        <main class="gameplay-challenge-card" id="challenge-card-el">
          <div id="challenge-stimulus-mount" class="challenge-stimulus-box"></div>
          <div id="challenge-question" class="challenge-question-text"></div>
        </main>

        <!-- 2x2 Answer Grid -->
        <div id="gameplay-answers-grid" class="gameplay-answers-grid"></div>

        <!-- Bottom Performance HUD Footer -->
        <footer class="gameplay-footer-hud">
          <div class="perf-item">
            <span class="perf-icon">⚡</span>
            <div>
              <span class="perf-label">ACCURACY</span>
              <div id="footer-accuracy" class="perf-val val-accuracy">100%</div>
            </div>
          </div>

          <div class="perf-divider"></div>

          <div class="perf-item">
            <span class="perf-icon">⏱️</span>
            <div>
              <span class="perf-label">AVG. REACTION</span>
              <div id="footer-avg-reaction" class="perf-val val-avg-reaction">0 ms</div>
            </div>
          </div>

          <div class="perf-divider"></div>

          <div class="perf-item">
            <span class="perf-icon">🏆</span>
            <div>
              <span class="perf-label">BEST REACTION</span>
              <div id="footer-best-reaction" class="perf-val val-best-reaction">0 ms</div>
            </div>
          </div>
        </footer>
      </div>
    `;

    // Mount subcomponents
    document.getElementById('timer-container-mount')?.appendChild(this.timerComponent.getElement());
    document.getElementById('streakbar-container-mount')?.appendChild(this.streakBarComponent.getElement());

    // Pause button click
    document.getElementById('btn-gameplay-pause')?.addEventListener('click', () => {
      this.togglePause();
    });

    // Keyboard bindings (1, 2, 3, 4, Esc/P for pause)
    this.keydownHandler = (e: KeyboardEvent) => {
      if (this.isCountingDown) return;

      if (e.code === 'Escape' || e.key.toLowerCase() === 'p') {
        e.preventDefault();
        this.togglePause();
        return;
      }

      if (this.isPaused || this.isResolvingAnswer) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const index = parseInt(e.key, 10) - 1;
        this.selectOptionByIndex(index);
      }
    };
    window.addEventListener('keydown', this.keydownHandler);

    // Start 3-2-1-GO Countdown (Contract 14, 21, 68)
    this.startCountdown();
  }

  private startCountdown(): void {
    if (this.countdownInterval !== null) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.isCountingDown = true;
    let count = 3;
    const countdownEl = document.getElementById('countdown-text');
    audio.playCountdownBeep(false);

    this.countdownInterval = window.setInterval(() => {
      count -= 1;
      if (count > 0) {
        if (countdownEl) {
          countdownEl.textContent = count.toString();
          countdownEl.classList.remove('countdown-go');
        }
        audio.playCountdownBeep(false);
      } else if (count === 0) {
        if (countdownEl) {
          countdownEl.textContent = 'GO!';
          countdownEl.classList.add('countdown-go');
        }
        audio.playCountdownBeep(true);
      } else {
        // Finished countdown
        if (this.countdownInterval !== null) {
          clearInterval(this.countdownInterval);
          this.countdownInterval = null;
        }
        const overlay = document.getElementById('gameplay-countdown');
        if (overlay) overlay.style.display = 'none';

        this.isCountingDown = false;
        this.beginActiveSession();
      }
    }, 850);
  }

  private beginActiveSession(): void {
    platform.gameplayStart();

    // Start active 60-second session
    this.session.start(
      (metrics, remainingSec) => {
        this.updateHUD(metrics, remainingSec);
      },
      (finalMetrics) => {
        platform.gameplayStop();
        audio.playGameOver();
        this.onGameOver(finalMetrics);
      }
    );

    this.nextChallenge();

    // First-time player guidance (Requirement 31)
    if (!storage.hasSeenTutorial()) {
      this.showTutorialGuide();
    }
  }

  private showTutorialGuide(): void {
    if (document.getElementById('tutorial-pointer')) return;
    const card = document.getElementById('challenge-card-el');
    if (!card) return;

    const pointer = document.createElement('div');
    pointer.id = 'tutorial-pointer';
    pointer.className = 'tutorial-guide-overlay';
    pointer.innerHTML = `
      <div class="tutorial-hand-bounce">👆</div>
      <div class="tutorial-tip-pill">DON'T READ IT. TAP THE COLOR!</div>
    `;
    card.appendChild(pointer);
  }

  private hideTutorialGuide(): void {
    const pointer = document.getElementById('tutorial-pointer');
    if (pointer) pointer.remove();
  }

  private nextChallenge(): void {
    if (this.isPaused) return;

    this.isResolvingAnswer = false;
    const elapsed = this.session.getElapsedSeconds();
    this.currentChallenge = this.generator.generateNext(elapsed);

    // Render Stimulus
    const stimulusMount = document.getElementById('challenge-stimulus-mount');
    if (stimulusMount && this.currentChallenge) {
      ChallengeRenderer.render(this.currentChallenge.stimulus, stimulusMount);
    }

    // Render Question Text
    const questionEl = document.getElementById('challenge-question');
    if (questionEl && this.currentChallenge) {
      questionEl.textContent = this.currentChallenge.question;
    }

    // Render 2x2 Answer Grid
    const answersGrid = document.getElementById('gameplay-answers-grid');
    if (answersGrid && this.currentChallenge) {
      answersGrid.innerHTML = '';
      this.currentChallenge.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        const colorClass = opt.colorId ? `btn-answer-${opt.colorId}` : 'btn-answer-blue';
        btn.className = `btn-arcade btn-answer ${colorClass}`;
        btn.id = `btn-answer-opt-${idx}`;
        btn.setAttribute('data-option-id', opt.id);
        btn.setAttribute('aria-label', `Option ${idx + 1}: ${opt.label}`);

        const dotClass = opt.colorId ? `dot-${opt.colorId}` : 'dot-blue';
        btn.innerHTML = `
          <div class="answer-dot ${dotClass}"></div>
          <span class="answer-label">${opt.label}</span>
          <span style="font-size: 0.8rem; opacity: 0.6; font-weight: 700;">[${idx + 1}]</span>
        `;

        btn.addEventListener('click', () => {
          this.handleAnswer(opt.id, btn);
        });

        answersGrid.appendChild(btn);
      });
    }
  }

  private selectOptionByIndex(index: number): void {
    if (!this.currentChallenge) return;
    const option = this.currentChallenge.options[index];
    if (option) {
      const btn = document.getElementById(`btn-answer-opt-${index}`) as HTMLButtonElement;
      if (btn) {
        this.handleAnswer(option.id, btn);
      }
    }
  }

  private handleAnswer(selectedOptionId: string, buttonEl: HTMLElement): void {
    if (this.isResolvingAnswer || !this.currentChallenge || this.isPaused) return;

    // Guaranteed one-answer-per-challenge (Contract 19, 71)
    this.isResolvingAnswer = true;
    const now = performance.now();
    const reactionTimeMs = Math.max(1, Math.round(now - this.currentChallenge.startTime));
    const isCorrect = selectedOptionId === this.currentChallenge.correctAnswerId;

    // Dismiss first-time guide on first interaction
    if (!storage.hasSeenTutorial()) {
      storage.setTutorialSeen(true);
      this.hideTutorialGuide();
    }

    // Record answer in session (award 1 reward point if correct)
    const res = this.session.recordAnswer(isCorrect, reactionTimeMs);

    if (isCorrect) {
      audio.playCorrect(this.session.getMetrics().currentStreak);
      buttonEl.classList.add('flash-correct');
      this.showScoreFloater(`+${res.pointsAwarded}${res.speedBonus > 0 ? ' SPEED!' : ''}`);
    } else {
      audio.playWrong();
      buttonEl.classList.add('flash-wrong');
    }

    const metrics = this.session.getMetrics();
    this.updateHUD(metrics, this.session.getRemainingSeconds());

    // Feedback duration based on difficulty
    const currentDiff = metrics.difficulty;
    const delay = GAME_CONFIG.FEEDBACK_DURATIONS[currentDiff] || (metrics.hardMode ? 200 : 300);

    this.feedbackTimeout = window.setTimeout(() => {
      buttonEl.classList.remove('flash-correct', 'flash-wrong');
      this.nextChallenge();
    }, delay);
  }

  private showScoreFloater(text: string): void {
    const card = document.getElementById('challenge-card-el');
    if (!card) return;

    const floater = document.createElement('div');
    floater.className = 'score-floater';
    floater.textContent = text;
    card.appendChild(floater);

    setTimeout(() => {
      floater.remove();
    }, 600);
  }

  private updateHUD(metrics: SessionMetrics, remainingSeconds: number): void {
    this.timerComponent.update(remainingSeconds);
    this.streakBarComponent.update(metrics.currentStreak);

    const scoreEl = document.getElementById('hud-score-val');
    if (scoreEl) scoreEl.textContent = metrics.score.toString();

    const streakEl = document.getElementById('hud-streak-val');
    if (streakEl) streakEl.textContent = `x${metrics.currentStreak}`;

    const accEl = document.getElementById('footer-accuracy');
    if (accEl) accEl.textContent = `${metrics.accuracyPercent}%`;

    const avgEl = document.getElementById('footer-avg-reaction');
    if (avgEl) avgEl.textContent = `${metrics.averageReactionTimeMs} ms`;

    const bestEl = document.getElementById('footer-best-reaction');
    if (bestEl) bestEl.textContent = `${metrics.bestReactionTimeMs} ms`;
  }

  private restartSession(): void {
    // 1. Cancel any active countdown, timeouts or intervals
    if (this.countdownInterval !== null) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (this.feedbackTimeout !== null) {
      clearTimeout(this.feedbackTimeout);
      this.feedbackTimeout = null;
    }

    // 2. Completely reset session state & metrics with active difficulty
    const settings = storage.getSettings();
    this.session.reset(settings.difficulty);

    const diffBadge = document.getElementById('hud-difficulty-badge');
    if (diffBadge) {
      diffBadge.textContent = `MODE: ${settings.difficulty}`;
    }
    this.hideTutorialGuide();

    // 3. Reset internal flags
    this.isPaused = false;
    this.isResolvingAnswer = false;
    this.isCountingDown = true;
    this.currentChallenge = null;

    // 4. Reset HUD & Subcomponents to pristine state
    this.timerComponent.update(GAME_CONFIG.SESSION_DURATION_SEC);
    this.streakBarComponent.update(0);

    const scoreEl = document.getElementById('hud-score-val');
    if (scoreEl) scoreEl.textContent = '0';

    const streakEl = document.getElementById('hud-streak-val');
    if (streakEl) streakEl.textContent = 'x0';

    const accEl = document.getElementById('footer-accuracy');
    if (accEl) accEl.textContent = '100%';

    const avgEl = document.getElementById('footer-avg-reaction');
    if (avgEl) avgEl.textContent = '0 ms';

    const bestEl = document.getElementById('footer-best-reaction');
    if (bestEl) bestEl.textContent = '0 ms';

    // 5. Clear challenge display & answer grid
    const stimMount = document.getElementById('challenge-stimulus-mount');
    if (stimMount) stimMount.innerHTML = '';

    const questEl = document.getElementById('challenge-question');
    if (questEl) questEl.textContent = '';

    const grid = document.getElementById('gameplay-answers-grid');
    if (grid) grid.innerHTML = '';

    // Remove any lingering floating feedback text
    document.querySelectorAll('.feedback-float').forEach(el => el.remove());

    // 6. Reset & show countdown overlay
    const overlay = document.getElementById('gameplay-countdown');
    const countdownEl = document.getElementById('countdown-text');
    if (countdownEl) {
      countdownEl.textContent = '3';
      countdownEl.classList.remove('countdown-go');
    }
    if (overlay) {
      overlay.style.display = 'flex';
    }

    // 7. Start fresh countdown
    this.startCountdown();
  }

  private togglePause(): void {
    if (this.isCountingDown) return;

    if (!this.isPaused) {
      this.isPaused = true;
      this.session.pause();
      audio.playClick();
      modals.showPauseModal(
        () => {
          this.isPaused = false;
          this.session.resume();
        },
        () => {
          this.restartSession();
        },
        () => {
          this.session.stop();
          platform.gameplayStop();
          this.onQuitToHome();
        }
      );
    }
  }

  unmount(): void {
    if (this.countdownInterval !== null) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (this.feedbackTimeout !== null) {
      clearTimeout(this.feedbackTimeout);
      this.feedbackTimeout = null;
    }
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    this.hideTutorialGuide();
    this.session.stop();
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
  }
}
