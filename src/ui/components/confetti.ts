export class ConfettiCannon {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private particles: Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    angle: number;
    rotationSpeed: number;
    alpha: number;
  }> = [];
  private isRunning: boolean = false;
  private colors = ['#FF2238', '#0088FF', '#14C834', '#FFB800', '#A23DF5', '#FF6600', '#FFFFFF'];

  constructor() {
    this.canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  fire(count: number = 80): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; // Respect reduced motion preference
    }

    this.resize();
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: -20,
        size: Math.random() * 8 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        speedX: (Math.random() - 0.5) * 6,
        speedY: Math.random() * 5 + 3,
        angle: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  private loop(): void {
    if (!this.ctx || this.particles.length === 0) {
      this.isRunning = false;
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.angle += p.rotationSpeed;

      if (p.y > this.canvas.height * 0.75) {
        p.alpha -= 0.02;
      }

      if (p.alpha <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.angle * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.loop());
  }

  clear(): void {
    this.particles = [];
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

export const confetti = new ConfettiCannon();
