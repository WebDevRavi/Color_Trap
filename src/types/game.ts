export type ScreenState = 
  | 'HOME'
  | 'INSTRUCTIONS'
  | 'COUNTDOWN'
  | 'PLAYING'
  | 'PAUSED'
  | 'GAMEOVER';

export type ChallengeType = 
  | 'WORD_TRAP'
  | 'SHAPE_TRAP'
  | 'OBJECT_TRAP'
  | 'PATTERN_TRAP'
  | 'POSITION_TRAP'
  | 'SIZE_TRAP'
  | 'ICON_TRAP'
  | 'MIXED_TRAP';

export type ColorId = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface ColorDef {
  id: ColorId;
  name: string;
  hex: string;
  glowHex: string;
  darkHex: string;
}

export type ShapeId = 'circle' | 'square' | 'triangle' | 'star' | 'diamond';
export type PatternId = 'solid' | 'stripes' | 'dots' | 'waves';
export type PositionId = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type SizeId = 'small' | 'medium' | 'large';
export type IconId = 'heart' | 'star' | 'lightning' | 'target' | 'flame';

export interface AnswerOption {
  id: string;
  label: string;
  colorId?: ColorId;
  shapeId?: ShapeId;
  iconId?: IconId;
  isCorrect: boolean;
}

export interface ChallengeStimulus {
  type: ChallengeType;
  primaryText?: string;
  textColor?: string;
  shapeId?: ShapeId;
  shapeColor?: string;
  patternId?: PatternId;
  iconId?: IconId;
  iconColor?: string;
  sizeId?: SizeId;
  positionId?: PositionId;
  additionalElements?: Array<{
    id: string;
    shapeId?: ShapeId;
    color: string;
    size?: SizeId;
    position?: PositionId;
    pattern?: PatternId;
  }>;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  question: string;
  targetProperty: string;
  distractorProperty: string;
  stimulus: ChallengeStimulus;
  options: AnswerOption[];
  correctAnswerId: string;
  startTime: number;
}

export type DifficultyLevel = 'EASY' | 'NORMAL' | 'HARD' | 'VERY HARD';

export interface SessionMetrics {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  currentStreak: number;
  maxStreak: number;
  totalReactionTimeMs: number;
  reactionTimes: number[];
  bestReactionTimeMs: number;
  accuracyPercent: number;
  averageReactionTimeMs: number;
  sessionDurationSec: number;
  hardMode: boolean;
  difficulty: DifficultyLevel;
  rewardPointsEarned: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  reducedMotion: boolean;
  hardMode: boolean;
  difficulty: DifficultyLevel;
}

export interface GameStats {
  bestScore: number;
  bestStreak: number;
  totalGamesPlayed: number;
  totalScore: number;
  totalCorrect: number;
  totalWrong: number;
  totalReactionTimeMs: number;
  bestReactionTimeMs: number;
  totalRewardPointsEarned: number;
}

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  desc: string;
  icon: string;
}
