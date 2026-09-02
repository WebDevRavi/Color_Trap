import { AnswerOption, IconId } from '../../types/game';
import { GAME_CONFIG } from '../../config/gameConfig';
import { ChallengeTemplate, shuffleArray, pickRandom, getColorDef } from '../challengeTypes';

export const iconTrapTemplate: ChallengeTemplate = {
  type: 'ICON_TRAP',
  generate: () => {
    const askForColor = Math.random() > 0.5;

    if (askForColor) {
      const pool = shuffleArray([...GAME_CONFIG.PRIMARY_COLOR_IDS]);
      const optionColors = pool.slice(0, 4);
      const targetColorId = pickRandom(optionColors);
      const targetDef = getColorDef(targetColorId);
      const icon = pickRandom(GAME_CONFIG.ICONS);

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
        id: `icon_color_${Date.now()}_${Math.random()}`,
        type: 'ICON_TRAP',
        question: 'What color is the icon?',
        targetProperty: targetDef.name,
        distractorProperty: icon,
        stimulus: {
          type: 'ICON_TRAP',
          iconId: icon,
          iconColor: targetDef.hex
        },
        options: shuffleArray(options),
        correctAnswerId: targetColorId,
        startTime: performance.now()
      };
    } else {
      const allIcons = shuffleArray([...GAME_CONFIG.ICONS]);
      const optionIcons = allIcons.slice(0, 4);
      const targetIcon: IconId = pickRandom(optionIcons);
      const colorId = pickRandom(GAME_CONFIG.PRIMARY_COLOR_IDS);
      const colorDef = getColorDef(colorId);

      const options: AnswerOption[] = optionIcons.map(iId => ({
        id: iId,
        label: iId.toUpperCase(),
        iconId: iId,
        isCorrect: iId === targetIcon
      }));

      return {
        id: `icon_name_${Date.now()}_${Math.random()}`,
        type: 'ICON_TRAP',
        question: 'Which icon is shown?',
        targetProperty: targetIcon,
        distractorProperty: colorDef.name,
        stimulus: {
          type: 'ICON_TRAP',
          iconId: targetIcon,
          iconColor: colorDef.hex
        },
        options: shuffleArray(options),
        correctAnswerId: targetIcon,
        startTime: performance.now()
      };
    }
  }
};
