import { Challenge } from '../types/game';
import { wordTrapTemplate } from './templates/wordTrap';
import { shapeTrapTemplate } from './templates/shapeTrap';
import { iconTrapTemplate } from './templates/iconTrap';
import { sizeTrapTemplate } from './templates/sizeTrap';
import { positionTrapTemplate } from './templates/positionTrap';
import { patternTrapTemplate } from './templates/patternTrap';
import { mixedTrapTemplate } from './templates/mixedTrap';
import { pickRandom } from './challengeTypes';

export class ChallengeGenerator {
  private hardMode: boolean = false;
  private lastType: string | null = null;

  constructor(hardMode: boolean = false) {
    this.hardMode = hardMode;
  }

  setHardMode(enabled: boolean): void {
    this.hardMode = enabled;
  }

  generateNext(elapsedSeconds: number): Challenge {
    // Determine difficulty phase (DIFFICULTY MODEL)
    let availableTemplates = [wordTrapTemplate];

    if (this.hardMode) {
      // Hard mode has all challenges from the start with high weight on mixed & pattern
      availableTemplates = [
        wordTrapTemplate,
        wordTrapTemplate,
        shapeTrapTemplate,
        iconTrapTemplate,
        sizeTrapTemplate,
        positionTrapTemplate,
        patternTrapTemplate,
        mixedTrapTemplate,
        mixedTrapTemplate
      ];
    } else if (elapsedSeconds < 18) {
      // Phase 1 (0-18s): Classic Word Trap + Shape Trap
      availableTemplates = [
        wordTrapTemplate,
        wordTrapTemplate,
        wordTrapTemplate,
        shapeTrapTemplate
      ];
    } else if (elapsedSeconds < 36) {
      // Phase 2 (18-36s): Word Trap, Shape, Icon, Size
      availableTemplates = [
        wordTrapTemplate,
        shapeTrapTemplate,
        iconTrapTemplate,
        sizeTrapTemplate
      ];
    } else if (elapsedSeconds < 48) {
      // Phase 3 (36-48s): Position, Pattern, Shape, Word
      availableTemplates = [
        wordTrapTemplate,
        patternTrapTemplate,
        positionTrapTemplate,
        iconTrapTemplate
      ];
    } else {
      // Phase 4 (48-60s): Late intensity, high visual distraction + mixed
      availableTemplates = [
        wordTrapTemplate,
        mixedTrapTemplate,
        patternTrapTemplate,
        sizeTrapTemplate,
        shapeTrapTemplate
      ];
    }

    // Filter out the immediate last type if possible to keep gameplay dynamic (Contract 54)
    let candidates = availableTemplates.filter(t => t.type !== this.lastType);
    if (candidates.length === 0) {
      candidates = availableTemplates;
    }

    const selectedTemplate = pickRandom(candidates);
    this.lastType = selectedTemplate.type;

    return selectedTemplate.generate(Math.floor(elapsedSeconds / 15) + (this.hardMode ? 2 : 0));
  }
}
