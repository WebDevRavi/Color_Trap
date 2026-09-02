import { AnswerOption, SizeId } from '../../types/game';
import { GAME_CONFIG } from '../../config/gameConfig';
import { ChallengeTemplate, shuffleArray, getColorDef } from '../challengeTypes';

export const sizeTrapTemplate: ChallengeTemplate = {
  type: 'SIZE_TRAP',
  generate: () => {
    // 3 or 4 objects with distinct sizes and colors
    const colors = shuffleArray([...GAME_CONFIG.PRIMARY_COLOR_IDS]);
    const sizes: SizeId[] = ['small', 'medium', 'large'];
    const askLargest = Math.random() > 0.5;

    // Assign sizes to colors
    const elements = sizes.map((size, idx) => ({
      id: `elem_${idx}`,
      shapeId: 'circle' as const,
      color: getColorDef(colors[idx]).hex,
      colorId: colors[idx],
      size: size
    }));

    const targetElement = askLargest 
      ? elements.find(e => e.size === 'large')! 
      : elements.find(e => e.size === 'small')!;

    const targetDef = getColorDef(targetElement.colorId);

    const options: AnswerOption[] = colors.slice(0, 3).map(cId => {
      const def = getColorDef(cId);
      return {
        id: cId,
        label: def.name,
        colorId: cId,
        isCorrect: cId === targetElement.colorId
      };
    });

    return {
      id: `size_${Date.now()}_${Math.random()}`,
      type: 'SIZE_TRAP',
      question: askLargest ? 'Which color is the LARGEST circle?' : 'Which color is the SMALLEST circle?',
      targetProperty: targetDef.name,
      distractorProperty: askLargest ? 'small' : 'large',
      stimulus: {
        type: 'SIZE_TRAP',
        additionalElements: shuffleArray(elements).map(e => ({
          id: e.id,
          shapeId: e.shapeId,
          color: e.color,
          size: e.size
        }))
      },
      options: shuffleArray(options),
      correctAnswerId: targetElement.colorId,
      startTime: performance.now()
    };
  }
};
