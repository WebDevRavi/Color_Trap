import { ChallengeStimulus, ShapeId, IconId, PatternId } from '../../types/game';

export class ChallengeRenderer {
  static render(stimulus: ChallengeStimulus, container: HTMLElement): void {
    container.innerHTML = '';

    switch (stimulus.type) {
      case 'WORD_TRAP':
        this.renderWord(stimulus, container);
        break;
      case 'SHAPE_TRAP':
        this.renderShape(stimulus, container);
        break;
      case 'ICON_TRAP':
        this.renderIcon(stimulus, container);
        break;
      case 'SIZE_TRAP':
        this.renderSize(stimulus, container);
        break;
      case 'POSITION_TRAP':
        this.renderPosition(stimulus, container);
        break;
      case 'PATTERN_TRAP':
      case 'MIXED_TRAP':
        this.renderPatternOrMixed(stimulus, container);
        break;
      default:
        this.renderWord(stimulus, container);
    }
  }

  private static renderWord(stimulus: ChallengeStimulus, container: HTMLElement): void {
    const wordEl = document.createElement('div');
    wordEl.className = 'stimulus-word';
    wordEl.textContent = stimulus.primaryText || '';
    wordEl.style.color = stimulus.textColor || '#FFFFFF';
    container.appendChild(wordEl);
  }

  private static renderShape(stimulus: ChallengeStimulus, container: HTMLElement): void {
    const shape = stimulus.shapeId || 'circle';
    const color = stimulus.shapeColor || '#FF2238';
    const svg = this.createShapeSvg(shape, color, 110, 110);
    container.appendChild(svg);
  }

  private static renderIcon(stimulus: ChallengeStimulus, container: HTMLElement): void {
    const icon = stimulus.iconId || 'star';
    const color = stimulus.iconColor || '#FFB800';
    const svg = this.createIconSvg(icon, color, 100, 100);
    container.appendChild(svg);
  }

  private static renderSize(stimulus: ChallengeStimulus, container: HTMLElement): void {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.justifyContent = 'center';
    wrap.style.gap = '24px';

    const sizeMap = { small: 38, medium: 62, large: 92 };

    stimulus.additionalElements?.forEach(elem => {
      const px = sizeMap[elem.size || 'medium'];
      const svg = this.createShapeSvg('circle', elem.color, px, px);
      wrap.appendChild(svg);
    });

    container.appendChild(wrap);
  }

  private static renderPosition(stimulus: ChallengeStimulus, container: HTMLElement): void {
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = '1fr 1fr';
    grid.style.gap = '14px';
    grid.style.padding = '8px';
    grid.style.background = 'rgba(255, 255, 255, 0.04)';
    grid.style.borderRadius = '16px';

    const order = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    order.forEach(pos => {
      const elem = stimulus.additionalElements?.find(e => e.position === pos);
      const color = elem ? elem.color : '#888888';
      const circleSvg = this.createShapeSvg('circle', color, 42, 42);
      grid.appendChild(circleSvg);
    });

    container.appendChild(grid);
  }

  private static renderPatternOrMixed(stimulus: ChallengeStimulus, container: HTMLElement): void {
    const shape = stimulus.shapeId || 'square';
    const color = stimulus.shapeColor || '#FFB800';
    const pattern = stimulus.patternId || 'stripes';

    const svg = this.createPatternedSvg(shape, color, pattern, 110, 110);
    container.appendChild(svg);
  }

  static createShapeSvg(shape: ShapeId, color: string, w: number, h: number): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', `${w}`);
    svg.setAttribute('height', `${h}`);
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.filter = `drop-shadow(0 4px 10px ${color}88)`;

    let pathD = '';
    if (shape === 'circle') {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '50');
      circle.setAttribute('cy', '50');
      circle.setAttribute('r', '42');
      circle.setAttribute('fill', color);
      svg.appendChild(circle);
      return svg;
    } else if (shape === 'square') {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '10');
      rect.setAttribute('y', '10');
      rect.setAttribute('width', '80');
      rect.setAttribute('height', '80');
      rect.setAttribute('rx', '14');
      rect.setAttribute('fill', color);
      svg.appendChild(rect);
      return svg;
    } else if (shape === 'triangle') {
      pathD = 'M50,12 L88,84 L12,84 Z';
    } else if (shape === 'star') {
      pathD = 'M50,8 L61,38 L94,38 L67,58 L77,88 L50,69 L23,88 L33,58 L6,38 L39,38 Z';
    } else if (shape === 'diamond') {
      pathD = 'M50,8 L88,50 L50,92 L12,50 Z';
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('fill', color);
    svg.appendChild(path);
    return svg;
  }

  static createIconSvg(icon: IconId, color: string, w: number, h: number): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', `${w}`);
    svg.setAttribute('height', `${h}`);
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.filter = `drop-shadow(0 4px 10px ${color}88)`;

    let pathD = '';
    if (icon === 'heart') {
      pathD = 'M50,85 C20,60 10,40 10,25 C10,12 20,6 32,6 C40,6 46,10 50,16 C54,10 60,6 68,6 C80,6 90,12 90,25 C90,40 80,60 50,85 Z';
    } else if (icon === 'lightning') {
      pathD = 'M56,8 L24,52 L48,52 L42,92 L76,46 L52,46 Z';
    } else if (icon === 'target') {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.innerHTML = `
        <circle cx="50" cy="50" r="42" stroke="${color}" stroke-width="8" fill="none" />
        <circle cx="50" cy="50" r="24" stroke="${color}" stroke-width="8" fill="none" />
        <circle cx="50" cy="50" r="8" fill="${color}" />
      `;
      svg.appendChild(g);
      return svg;
    } else if (icon === 'flame') {
      pathD = 'M50,10 C50,10 65,30 65,45 C65,55 58,62 50,62 C42,62 35,55 35,45 C35,32 45,22 50,10 Z M50,92 C25,92 15,72 15,55 C15,38 30,25 30,25 C30,25 28,40 38,48 C38,48 42,32 58,32 C58,45 68,52 68,65 C68,78 58,92 50,92 Z';
    } else { // star
      pathD = 'M50,8 L61,38 L94,38 L67,58 L77,88 L50,69 L23,88 L33,58 L6,38 L39,38 Z';
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('fill', color);
    svg.appendChild(path);
    return svg;
  }

  static createPatternedSvg(shape: ShapeId, color: string, pattern: PatternId, w: number, h: number): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', `${w}`);
    svg.setAttribute('height', `${h}`);
    svg.setAttribute('viewBox', '0 0 100 100');

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const patId = `pat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const pat = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pat.setAttribute('id', patId);
    pat.setAttribute('patternUnits', 'userSpaceOnUse');

    if (pattern === 'stripes') {
      pat.setAttribute('width', '16');
      pat.setAttribute('height', '16');
      pat.setAttribute('patternTransform', 'rotate(45)');
      pat.innerHTML = `
        <rect width="16" height="16" fill="${color}" />
        <line x1="0" y1="0" x2="0" y2="16" stroke="#FFFFFF" stroke-width="6" />
      `;
    } else if (pattern === 'dots') {
      pat.setAttribute('width', '16');
      pat.setAttribute('height', '16');
      pat.innerHTML = `
        <rect width="16" height="16" fill="${color}" />
        <circle cx="8" cy="8" r="4" fill="#FFFFFF" />
      `;
    } else if (pattern === 'waves') {
      pat.setAttribute('width', '20');
      pat.setAttribute('height', '10');
      pat.innerHTML = `
        <rect width="20" height="10" fill="${color}" />
        <path d="M0,5 Q5,0 10,5 T20,5" stroke="#FFFFFF" stroke-width="3" fill="none" />
      `;
    } else {
      pat.setAttribute('width', '10');
      pat.setAttribute('height', '10');
      pat.innerHTML = `<rect width="10" height="10" fill="${color}" />`;
    }

    defs.appendChild(pat);
    svg.appendChild(defs);

    let shapeNode: SVGElement;
    if (shape === 'circle') {
      shapeNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      shapeNode.setAttribute('cx', '50');
      shapeNode.setAttribute('cy', '50');
      shapeNode.setAttribute('r', '42');
    } else {
      shapeNode = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      shapeNode.setAttribute('x', '10');
      shapeNode.setAttribute('y', '10');
      shapeNode.setAttribute('width', '80');
      shapeNode.setAttribute('height', '80');
      shapeNode.setAttribute('rx', '14');
    }

    shapeNode.setAttribute('fill', `url(#${patId})`);
    shapeNode.setAttribute('stroke', 'rgba(255,255,255,0.4)');
    shapeNode.setAttribute('stroke-width', '2');
    svg.appendChild(shapeNode);

    return svg;
  }
}
