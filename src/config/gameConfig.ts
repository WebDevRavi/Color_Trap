import { ColorDef, ColorId, ShapeId, IconId, PatternId } from '../types/game';

export const GAME_CONFIG = {
  SESSION_DURATION_SEC: 60,
  COUNTDOWN_DURATION_SEC: 3,
  
  // Feedback duration by difficulty
  FEEDBACK_DURATIONS: {
    EASY: 400,
    NORMAL: 300,
    HARD: 200,
    'VERY HARD': 120,
  },

  // Speed bonus thresholds (SCORING MODEL)
  SPEED_BONUS_TIER_1_MS: 500,  // < 500ms: +3 bonus
  SPEED_BONUS_TIER_2_MS: 750,  // < 750ms: +2 bonus
  SPEED_BONUS_TIER_3_MS: 1000, // < 1000ms: +1 bonus
  BASE_SCORE: 1,

  // Streak Milestones for fire animation & audio cues (STREAK MODEL)
  STREAK_MILESTONES: [3, 5, 10, 20, 30],

  // Storage keys
  STORAGE_KEYS: {
    BEST_SCORE: 'color_trap_best_score_v1',
    BEST_STREAK: 'color_trap_best_streak_v1',
    STATS: 'color_trap_stats_v1',
    SETTINGS: 'color_trap_settings_v1',
    REWARD_POINTS: 'color_trap_reward_points_v2',
    TOTAL_REWARD_POINTS_EARNED: 'color_trap_total_points_earned_v2',
    UNLOCKED_ITEMS: 'color_trap_unlocked_items_v2',
    ACTIVE_THEME: 'color_trap_active_theme_v2',
    LAST_DAILY_REWARD_DATE: 'color_trap_last_daily_reward_date_v1',
    SAVE_VERSION: 'color_trap_save_version_v2',
    TUTORIAL_SEEN: 'color_trap_tutorial_seen_v2',
  },

  // Shop Catalog (Prices strictly matching specification: 500 and 1,000)
  SHOP_ITEMS: [
    {
      id: 'classic_neon',
      name: 'Classic Neon Splatter',
      cost: 0,
      desc: 'Default vibrant arcade visual style with rich splatters.',
      icon: '🎨'
    },
    {
      id: 'cyber_arcade',
      name: '8-Bit Cyber Arcade',
      cost: 500,
      desc: 'Retro 80s arcade neon glow with sharp cyber borders.',
      icon: '🕹️'
    },
    {
      id: 'ultra_speed_vortex',
      name: 'Ultra Speed Vortex',
      cost: 1000,
      desc: 'High-octane hyperspace theme for master players.',
      icon: '⚡'
    }
  ],

  DAILY_REWARD_AMOUNT: 100,

  // Color Definitions matching reference arcade palette
  COLORS: [
    {
      id: 'red',
      name: 'RED',
      hex: '#E82030',
      glowHex: '#FF3344',
      darkHex: '#8B0B17'
    },
    {
      id: 'blue',
      name: 'BLUE',
      hex: '#0088FF',
      glowHex: '#38A4FF',
      darkHex: '#004A9E'
    },
    {
      id: 'green',
      name: 'GREEN',
      hex: '#1BB82D',
      glowHex: '#30D845',
      darkHex: '#0C6E18'
    },
    {
      id: 'yellow',
      name: 'YELLOW',
      hex: '#FFB800',
      glowHex: '#FFCC22',
      darkHex: '#A36F00'
    },
    {
      id: 'purple',
      name: 'PURPLE',
      hex: '#963BEB',
      glowHex: '#B25DFF',
      darkHex: '#581799'
    },
    {
      id: 'orange',
      name: 'ORANGE',
      hex: '#FF6D1B',
      glowHex: '#FF8838',
      darkHex: '#A63E00'
    }
  ] as ColorDef[],

  SHAPES: ['circle', 'square', 'triangle', 'star', 'diamond'] as ShapeId[],
  ICONS: ['heart', 'star', 'lightning', 'target', 'flame'] as IconId[],
  PATTERNS: ['solid', 'stripes', 'dots', 'waves'] as PatternId[],

  // Standard 4 primary gameplay colors
  PRIMARY_COLOR_IDS: ['red', 'blue', 'green', 'yellow'] as ColorId[],
};
