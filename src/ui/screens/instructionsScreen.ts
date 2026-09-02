import { audio } from '../../core/audio';

export class InstructionsScreen {
  private container: HTMLElement | null = null;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private onBack: () => void;
  private onGotIt: () => void;

  constructor(callbacks: { onBack: () => void; onGotIt: () => void }) {
    this.onBack = callbacks.onBack;
    this.onGotIt = callbacks.onGotIt;
  }

  mount(parent: HTMLElement): void {
    this.container = parent;

    this.container.innerHTML = `
      <div class="screen-instructions">
        <!-- Top Header -->
        <header class="instructions-header">
          <button id="btn-inst-back" class="btn-back">
            <span>⬅</span>
            <span>BACK</span>
          </button>

          <div class="instructions-header-center brand-logo-compact">
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
            <div class="brand-tagline">
              <span class="part-white">DON'T READ IT.</span>
              <span class="part-yellow">SEE IT.</span>
            </div>
            <div class="how-to-play-badge">
              <span>★</span>
              <span>HOW TO PLAY</span>
              <span>★</span>
            </div>
          </div>

          <div style="width: 80px;"></div> <!-- Spacer to balance header -->
        </header>

        <!-- 2-Column Instructions Card -->
        <main class="card-arcade instructions-card">
          <!-- Left Column: Steps -->
          <div class="instructions-steps-list">
            <div class="step-item">
              <div class="step-icon-bubble step-bubble-1">👁️</div>
              <div class="step-text">
                <span class="step-title">1. SEE THE <span class="highlight-color">COLOR</span></span>
                <span class="step-desc">Look at the COLOR the word is written in.</span>
              </div>
            </div>

            <div class="step-item">
              <div class="step-icon-bubble step-bubble-2">🧠</div>
              <div class="step-text">
                <span class="step-title">2. IGNORE THE WORD</span>
                <span class="step-desc">The word is the trap. Don't read it!</span>
              </div>
            </div>

            <div class="step-item">
              <div class="step-icon-bubble step-bubble-3">👆</div>
              <div class="step-text">
                <span class="step-title">3. TAP THE MATCH</span>
                <span class="step-desc">Tap the button that matches the COLOR, not the word.</span>
              </div>
            </div>

            <div class="step-item">
              <div class="step-icon-bubble step-bubble-4">⚡</div>
              <div class="step-text">
                <span class="step-title">4. GO FAST & STAY FOCUSED</span>
                <span class="step-desc">The timer is running! Build streaks and get a high score.</span>
              </div>
            </div>
          </div>

          <!-- Vertical Divider -->
          <div class="instructions-divider"></div>

          <!-- Right Column: Interactive Example -->
          <div class="instructions-example-box">
            <div class="example-ribbon">EXAMPLE</div>

            <div class="example-word-trap">
              BLUE
            </div>

            <p class="example-question">Which color is the word written in?</p>

            <div class="example-buttons-grid" style="position: relative;">
              <button id="demo-btn-red" class="btn-arcade btn-answer-red example-btn" style="box-shadow: var(--shadow-btn-red);">
                RED
              </button>
              <button id="demo-btn-blue" class="btn-arcade btn-answer-blue example-btn example-btn-active">
                BLUE
              </button>
              <button id="demo-btn-green" class="btn-arcade btn-answer-green example-btn" style="box-shadow: var(--shadow-btn-green);">
                GREEN
              </button>
              <button id="demo-btn-yellow" class="btn-arcade btn-answer-yellow example-btn" style="box-shadow: var(--shadow-btn-yellow);">
                YELLOW
              </button>

              <!-- Curved Indicator Arrow pointing to correct match (BLUE button) -->
              <svg class="example-pointer-arrow" viewBox="0 0 40 50" fill="none">
                <path d="M5,45 Q35,40 25,12" stroke="#14C834" stroke-width="3.5" stroke-linecap="round" fill="none"/>
                <polygon points="20,10 32,10 28,22" fill="#14C834"/>
              </svg>
            </div>

            <div class="example-correct-badge">
              <span>✔</span>
              <span>Correct Answer: <strong>BLUE</strong></span>
            </div>
          </div>
        </main>

        <!-- Bottom Bar -->
        <footer class="instructions-bottom-bar">
          <div class="instructions-tip-pill">
            <span style="font-size: 1.3rem;">💡</span>
            <span><strong class="tip-bold">TIP:</strong> Trust your eyes, not your brain. You know the color!</span>
          </div>

          <button id="btn-inst-gotit" class="btn-arcade btn-got-it">
            GOT IT!
          </button>
        </footer>
      </div>
    `;

    document.getElementById('btn-inst-back')?.addEventListener('click', () => {
      audio.playClick();
      this.onBack();
    });

    document.getElementById('btn-inst-gotit')?.addEventListener('click', () => {
      audio.playClick();
      this.onGotIt();
    });

    // Demo buttons interactivity in example card
    document.getElementById('demo-btn-blue')?.addEventListener('click', () => {
      audio.playCorrect(3);
    });
    document.getElementById('demo-btn-red')?.addEventListener('click', () => {
      audio.playWrong();
    });
    document.getElementById('demo-btn-green')?.addEventListener('click', () => {
      audio.playWrong();
    });
    document.getElementById('demo-btn-yellow')?.addEventListener('click', () => {
      audio.playWrong();
    });

    // Keyboard support
    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        audio.playClick();
        this.onGotIt();
      } else if (e.code === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        audio.playClick();
        this.onBack();
      }
    };
    window.addEventListener('keydown', this.keydownHandler);
  }

  unmount(): void {
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
