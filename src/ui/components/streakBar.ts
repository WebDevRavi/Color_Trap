export class StreakBarComponent {
  private element: HTMLElement;
  private fillElement: HTMLElement | null = null;
  private flameElement: HTMLElement | null = null;
  private maxCap: number = 20;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'gameplay-intensity-bar-wrap';
    this.render();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  private render(): void {
    this.element.innerHTML = `
      <div class="intensity-track">
        <div class="intensity-fill"></div>
      </div>
      <div class="intensity-flame-icon">🔥</div>
    `;

    this.fillElement = this.element.querySelector('.intensity-fill');
    this.flameElement = this.element.querySelector('.intensity-flame-icon');
  }

  update(currentStreak: number): void {
    if (this.fillElement) {
      const pct = Math.min(100, Math.round((currentStreak / this.maxCap) * 100));
      this.fillElement.style.width = `${pct}%`;
    }

    if (this.flameElement) {
      if (currentStreak >= 10) {
        this.flameElement.style.transform = 'scale(1.3)';
      } else if (currentStreak >= 5) {
        this.flameElement.style.transform = 'scale(1.15)';
      } else {
        this.flameElement.style.transform = 'scale(1)';
      }
    }
  }
}
