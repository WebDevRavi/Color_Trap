import { AnswerOption, ShapeId, ColorId, PatternId } from '../../types/game';
import { GAME_CONFIG } from '../../config/gameConfig';
import { ChallengeTemplate, shuffleArray, getColorDef } from '../challengeTypes';

export const mixedTrapTemplate: ChallengeTemplate = {
  type: 'MIXED_TRAP',
  generate: () => {
    // Pick 1 of 3 questions: Color, Shape, or Pattern
    const rand = Math.random();
    const queryType = rand < 0.4 ? 'color' : rand < 0.7 ? 'shape' : 'pattern';

    const colors = shuffleArray([...GAME_CONFIG.PRIMARY_COLOR_IDS]);
    const targetColorId: ColorId = colors[0];
    const targetColorDef = getColorDef(targetColorId);

    const shapes = shuffleArray([...GAME_CONFIG.SHAPES]);
    const targetShape: ShapeId = shapes[0];

    const patterns = shuffleArray([...GAME_CONFIG.PATTERNS]);
    const targetPattern: PatternId = patterns[0];

    let question = '';
    let targetProperty = '';
    let distractorProperty = '';
    let options: AnswerOption[] = [];
    let correctAnswerId = '';

    if (queryType === 'color') {
      question = 'What COLOR is this shape?';
      targetProperty = targetColorDef.name;
      distractorProperty = `${targetShape} with ${targetPattern}`;
      options = colors.slice(0, 4).map(cId => {
        const def = getColorDef(cId);
        return {
          id: cId,
          label: def.name,
          colorId: cId,
          isCorrect: cId === targetColorId
        };
      });
      correctAnswerId = targetColorId;
    } else if (queryType === 'shape') {
      question = 'Which SHAPE is shown?';
      targetProperty = targetShape;
      distractorProperty = `${targetColorDef.name} with ${targetPattern}`;
      options = shapes.slice(0, 4).map(s => ({
        id: s,
        label: s.toUpperCase(),
        shapeId: s,
        isCorrect: s === targetShape
      }));
      correctAnswerId = targetShape;
    } else {
      question = 'Which PATTERN is on the shape?';
      targetProperty = targetPattern;
      distractorProperty = `${targetColorDef.name} ${targetShape}`;
      options = patterns.slice(0, 4).map(p => ({
        id: p,
        label: p.toUpperCase(),
        isCorrect: p === targetPattern
      }));
      correctAnswerId = targetPattern;
    }

    return {
      id: `mixed_${Date.now()}_${Math.random()}`,
      type: 'MIXED_TRAP',
      question,
      targetProperty,
      distractorProperty,
      stimulus: {
        type: 'MIXED_TRAP',
        shapeId: targetShape,
        shapeColor: targetColorDef.hex,
        patternId: targetPattern
      },
      options: shuffleArray(options),
      correctAnswerId,
      startTime: performance.now()
    };
  }
};
