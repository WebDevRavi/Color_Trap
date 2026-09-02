export class TimerComponent {
  private element: HTMLElement;
  private circleProgress: SVGCircleElement | null = null;
  private timeText: HTMLElement | null = null;
  private totalDuration: number = 60;
  private radius: number = 30;
  private circumference: number = 2 * Math.PI * 30; // ~188.5px

  constructor(totalDuration: number = 60) {
    this.totalDuration = totalDuration;
    this.element = document.createElement('div');
    this.element.className = 'timer-radial-wrap';
    this.render();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  private render(): void {
    this.element.innerHTML = `
      <svg class="timer-svg" width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
        <circle class="timer-circle-bg" cx="38" cy="38" r="${this.radius}" stroke-width="5" fill="none" />
        <circle class="timer-circle-progress" cx="38" cy="38" r="${this.radius}" stroke-width="5" fill="none"
          stroke-dasharray="${this.circumference}" stroke-dashoffset="0" stroke-linecap="round" />
      </svg>
      <div class="timer-content-text">
        <span class="timer-label">TIME LEFT</span>
        <span class="timer-number">${this.totalDuration}s</span>
      </div>
    `;

    this.circleProgress = this.element.querySelector('.timer-circle-progress');
    this.timeText = this.element.querySelector('.timer-number');
  }

  update(remainingSeconds: number): void {
    if (this.timeText) {
      this.timeText.textContent = `${remainingSeconds}s`;
    }

    if (this.circleProgress) {
      const progress = Math.max(0, Math.min(1, remainingSeconds / this.totalDuration));
      const offset = this.circumference * (1 - progress);
      this.circleProgress.style.strokeDashoffset = `${offset}`;

      if (remainingSeconds <= 10) {
        this.circleProgress.classList.add('timer-circle-low');
      } else {
        this.circleProgress.classList.remove('timer-circle-low');
      }
    }
  }
}
