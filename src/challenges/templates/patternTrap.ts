import { AnswerOption, PatternId, ColorId } from '../../types/game';
import { GAME_CONFIG } from '../../config/gameConfig';
import { ChallengeTemplate, shuffleArray, pickRandom, getColorDef } from '../challengeTypes';

export const patternTrapTemplate: ChallengeTemplate = {
  type: 'PATTERN_TRAP',
  generate: () => {
    const askPattern = Math.random() > 0.5;
    const allPatterns = shuffleArray([...GAME_CONFIG.PATTERNS]);
    const targetPattern: PatternId = pickRandom(allPatterns);
    
    const colors = shuffleArray([...GAME_CONFIG.PRIMARY_COLOR_IDS]);
    const targetColorId: ColorId = pickRandom(colors);
    const targetDef = getColorDef(targetColorId);

    if (askPattern) {
      const options: AnswerOption[] = allPatterns.map(p => ({
        id: p,
        label: p.toUpperCase(),
        isCorrect: p === targetPattern
      }));

      return {
        id: `pat_name_${Date.now()}_${Math.random()}`,
        type: 'PATTERN_TRAP',
        question: 'Which pattern is shown?',
        targetProperty: targetPattern,
        distractorProperty: targetDef.name,
        stimulus: {
          type: 'PATTERN_TRAP',
          shapeId: 'square',
          shapeColor: targetDef.hex,
          patternId: targetPattern
        },
        options: shuffleArray(options),
        correctAnswerId: targetPattern,
        startTime: performance.now()
      };
    } else {
      const options: AnswerOption[] = colors.map(cId => {
        const def = getColorDef(cId);
        return {
          id: cId,
          label: def.name,
          colorId: cId,
          isCorrect: cId === targetColorId
        };
      });

      return {
        id: `pat_color_${Date.now()}_${Math.random()}`,
        type: 'PATTERN_TRAP',
        question: 'What color is the pattern?',
        targetProperty: targetDef.name,
        distractorProperty: targetPattern,
        stimulus: {
          type: 'PATTERN_TRAP',
          shapeId: 'square',
          shapeColor: targetDef.hex,
          patternId: targetPattern
        },
        options: shuffleArray(options),
        correctAnswerId: targetColorId,
        startTime: performance.now()
      };
    }
  }
};
