import { AnswerOption } from '../../types/game';
import { GAME_CONFIG } from '../../config/gameConfig';
import { ChallengeTemplate, shuffleArray, pickRandom, getColorDef } from '../challengeTypes';

export const wordTrapTemplate: ChallengeTemplate = {
  type: 'WORD_TRAP',
  generate: () => {
    // Pick 4 colors for the 4 buttons
    const pool = shuffleArray([...GAME_CONFIG.PRIMARY_COLOR_IDS]);
    const optionColors = pool.slice(0, 4);

    // Pick target color (the ink color)
    const targetColorId = pickRandom(optionColors);
    const targetDef = getColorDef(targetColorId);

    // Pick distractor word (a color name that does NOT match the ink color)
    const distractorCandidates = optionColors.filter(c => c !== targetColorId);
    const wordColorId = pickRandom(distractorCandidates);
    const wordDef = getColorDef(wordColorId);

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
      id: `word_${Date.now()}_${Math.random()}`,
      type: 'WORD_TRAP',
      question: 'What color is the word written in?',
      targetProperty: targetDef.name,
      distractorProperty: wordDef.name,
      stimulus: {
        type: 'WORD_TRAP',
        primaryText: wordDef.name,
        textColor: targetDef.hex
      },
      options: shuffleArray(options),
      correctAnswerId: targetColorId,
      startTime: performance.now()
    };
  }
};
