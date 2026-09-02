import { AnswerOption, PositionId } from '../../types/game';
import { GAME_CONFIG } from '../../config/gameConfig';
import { ChallengeTemplate, shuffleArray, pickRandom, getColorDef } from '../challengeTypes';

export const positionTrapTemplate: ChallengeTemplate = {
  type: 'POSITION_TRAP',
  generate: () => {
    const positions: PositionId[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    const colors = shuffleArray([...GAME_CONFIG.PRIMARY_COLOR_IDS]);

    const elements = positions.map((pos, idx) => ({
      id: `pos_${idx}`,
      shapeId: 'circle' as const,
      color: getColorDef(colors[idx]).hex,
      colorId: colors[idx],
      position: pos
    }));

    // 50% ask what color is in a position, 50% ask which position has a color
    const askColorAtPos = Math.random() > 0.5;

    if (askColorAtPos) {
      const targetElement = pickRandom(elements);
      const targetDef = getColorDef(targetElement.colorId);
      const posLabel = targetElement.position.replace('-', ' ').toUpperCase();

      const options: AnswerOption[] = colors.map(cId => {
        const def = getColorDef(cId);
        return {
          id: cId,
          label: def.name,
          colorId: cId,
          isCorrect: cId === targetElement.colorId
        };
      });

      return {
        id: `pos_color_${Date.now()}_${Math.random()}`,
        type: 'POSITION_TRAP',
        question: `What color is in the ${posLabel}?`,
        targetProperty: targetDef.name,
        distractorProperty: targetElement.position,
        stimulus: {
          type: 'POSITION_TRAP',
          additionalElements: elements
        },
        options: shuffleArray(options),
        correctAnswerId: targetElement.colorId,
        startTime: performance.now()
      };
    } else {
      const targetElement = pickRandom(elements);
      const targetDef = getColorDef(targetElement.colorId);

      const options: AnswerOption[] = positions.map(pos => ({
        id: pos,
        label: pos.replace('-', ' ').toUpperCase(),
        isCorrect: pos === targetElement.position
      }));

      return {
        id: `pos_name_${Date.now()}_${Math.random()}`,
        type: 'POSITION_TRAP',
        question: `Where is the ${targetDef.name} circle?`,
        targetProperty: targetElement.position,
        distractorProperty: targetDef.name,
        stimulus: {
          type: 'POSITION_TRAP',
          additionalElements: elements
        },
        options: shuffleArray(options),
        correctAnswerId: targetElement.position,
        startTime: performance.now()
      };
    }
  }
};
