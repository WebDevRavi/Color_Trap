import { Challenge, ChallengeType, ColorId } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';

export interface ChallengeTemplate {
  type: ChallengeType;
  generate: (difficultyLevel: number) => Challenge;
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getColorDef(id: ColorId) {
  return GAME_CONFIG.COLORS.find(c => c.id === id) || GAME_CONFIG.COLORS[0];
}
