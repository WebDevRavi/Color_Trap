import { AnswerOption, ShapeId } from '../../types/game';
import { GAME_CONFIG } from '../../config/gameConfig';
import { ChallengeTemplate, shuffleArray, pickRandom, getColorDef } from '../challengeTypes';

export const shapeTrapTemplate: ChallengeTemplate = {
  type: 'SHAPE_TRAP',
  generate: () => {
    // 50% ask for shape, 50% ask for color
    const askForColor = Math.random() > 0.5;

    if (askForColor) {
      const pool = shuffleArray([...GAME_CONFIG.PRIMARY_COLOR_IDS]);
      const optionColors = pool.slice(0, 4);
      const targetColorId = pickRandom(optionColors);
      const targetDef = getColorDef(targetColorId);
      const shape = pickRandom(GAME_CONFIG.SHAPES);

      const options: AnswerOption[] = optionColors.map(cId => {
        const def = getColorDef(cId);
        return {
          id: cId,
          label: def.name,
          colorId: cId,
          isCorrect: cId === targetColorId
        };
      });

      return {
        id: `shape_color_${Date.now()}_${Math.random()}`,
        type: 'SHAPE_TRAP',
        question: 'What color is the shape?',
        targetProperty: targetDef.name,
        distractorProperty: shape,
        stimulus: {
          type: 'SHAPE_TRAP',
          shapeId: shape,
          shapeColor: targetDef.hex
        },
        options: shuffleArray(options),
        correctAnswerId: targetColorId,
        startTime: performance.now()
      };
    } else {
      const allShapes = shuffleArray([...GAME_CONFIG.SHAPES]);
      const optionShapes = allShapes.slice(0, 4);
      const targetShape: ShapeId = pickRandom(optionShapes);
      const colorId = pickRandom(GAME_CONFIG.PRIMARY_COLOR_IDS);
      const colorDef = getColorDef(colorId);

      const options: AnswerOption[] = optionShapes.map(sId => ({
        id: sId,
        label: sId.toUpperCase(),
        shapeId: sId,
        isCorrect: sId === targetShape
      }));

      return {
        id: `shape_name_${Date.now()}_${Math.random()}`,
        type: 'SHAPE_TRAP',
        question: 'Which shape is shown?',
        targetProperty: targetShape,
        distractorProperty: colorDef.name,
        stimulus: {
          type: 'SHAPE_TRAP',
          shapeId: targetShape,
          shapeColor: colorDef.hex
        },
        options: shuffleArray(options),
        correctAnswerId: targetShape,
        startTime: performance.now()
      };
    }
  }
};
