import { GameSettings, GameStats, DifficultyLevel } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';

type StorageListener = () => void;

class StorageManager {
  private memoryFallback: Map<string, string> = new Map();
  private isLocalStorageAvailable = true;
  private changeListeners: Set<StorageListener> = new Set();

  constructor() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
    } catch {
      this.isLocalStorageAvailable = false;
      console.warn('Color Trap: localStorage is not available, falling back to memory.');
    }

    // Versioned Save Data Migration (Requirement 1 & 34)
    // Ensures clean reset of progression to 0 points, Cyber Arcade & Ultra Speed Vortex locked
    this.runMigration();
  }

  private runMigration(): void {
    const currentVersion = this.getItem(GAME_CONFIG.STORAGE_KEYS.SAVE_VERSION);
    if (currentVersion !== '2') {
      // Complete progression reset: 0 points, only default classic_neon theme unlocked
      this.setItem(GAME_CONFIG.STORAGE_KEYS.REWARD_POINTS, '0');
      this.setItem(GAME_CONFIG.STORAGE_KEYS.TOTAL_REWARD_POINTS_EARNED, '0');
      this.setItem(GAME_CONFIG.STORAGE_KEYS.UNLOCKED_ITEMS, JSON.stringify(['classic_neon']));
      this.setItem(GAME_CONFIG.STORAGE_KEYS.ACTIVE_THEME, 'classic_neon');
      this.setItem(GAME_CONFIG.STORAGE_KEYS.SAVE_VERSION, '2');
    }
  }

  private notifyChange(): void {
    this.changeListeners.forEach(listener => {
      try {
        listener();
      } catch (e) {
        console.error('Storage change listener error:', e);
      }
    });
  }

  subscribe(listener: StorageListener): () => void {
    this.changeListeners.add(listener);
    return () => {
      this.changeListeners.delete(listener);
    };
  }

  private getItem(key: string): string | null {
    if (this.isLocalStorageAvailable) {
      try {
        return localStorage.getItem(key);
      } catch {
        return this.memoryFallback.get(key) || null;
      }
    }
    return this.memoryFallback.get(key) || null;
  }

  private setItem(key: string, value: string): void {
    if (this.isLocalStorageAvailable) {
      try {
        localStorage.setItem(key, value);
        this.notifyChange();
        return;
      } catch {
        // Fall back to memory on quota error or restriction
      }
    }
    this.memoryFallback.set(key, value);
    this.notifyChange();
  }

  // =========================================================================
  // BEST SCORE & STREAK
  // =========================================================================
  getBestScore(): number {
    const val = this.getItem(GAME_CONFIG.STORAGE_KEYS.BEST_SCORE);
    if (!val) return 0;
    const num = parseInt(val, 10);
    return isNaN(num) ? 0 : Math.max(0, num);
  }

  setBestScore(score: number): boolean {
    const current = this.getBestScore();
    if (score > current) {
      this.setItem(GAME_CONFIG.STORAGE_KEYS.BEST_SCORE, score.toString());
      return true; // Is new best
    }
    return false;
  }

  getBestStreak(): number {
    const val = this.getItem(GAME_CONFIG.STORAGE_KEYS.BEST_STREAK);
    if (!val) return 0;
    const num = parseInt(val, 10);
    return isNaN(num) ? 0 : Math.max(0, num);
  }

  setBestStreak(streak: number): boolean {
    const current = this.getBestStreak();
    if (streak > current) {
      this.setItem(GAME_CONFIG.STORAGE_KEYS.BEST_STREAK, streak.toString());
      return true;
    }
    return false;
  }

  // =========================================================================
  // REWARD POINTS ECONOMY (Core Rule: 1 Correct Answer = 1 Reward Point)
  // =========================================================================
  getRewardPoints(): number {
    const val = this.getItem(GAME_CONFIG.STORAGE_KEYS.REWARD_POINTS);
    if (!val) return 0;
    const num = parseInt(val, 10);
    return isNaN(num) ? 0 : Math.max(0, num);
  }

  getTotalRewardPointsEarned(): number {
    const val = this.getItem(GAME_CONFIG.STORAGE_KEYS.TOTAL_REWARD_POINTS_EARNED);
    if (!val) return this.getRewardPoints();
    const num = parseInt(val, 10);
    return isNaN(num) ? 0 : Math.max(0, num);
  }

  awardCorrectAnswerPoint(): number {
    // Exactly +1 Reward Point per correct answer (Requirement 2)
    const currentAvailable = this.getRewardPoints();
    const currentLifetime = this.getTotalRewardPointsEarned();

    const newAvailable = currentAvailable + 1;
    const newLifetime = currentLifetime + 1;

    this.setItem(GAME_CONFIG.STORAGE_KEYS.REWARD_POINTS, newAvailable.toString());
    this.setItem(GAME_CONFIG.STORAGE_KEYS.TOTAL_REWARD_POINTS_EARNED, newLifetime.toString());
    return newAvailable;
  }

  addRewardPoints(amount: number): number {
    const validAmount = Math.max(0, Math.floor(amount));
    const currentAvailable = this.getRewardPoints();
    const currentLifetime = this.getTotalRewardPointsEarned();

    const newAvailable = currentAvailable + validAmount;
    const newLifetime = currentLifetime + validAmount;

    this.setItem(GAME_CONFIG.STORAGE_KEYS.REWARD_POINTS, newAvailable.toString());
    this.setItem(GAME_CONFIG.STORAGE_KEYS.TOTAL_REWARD_POINTS_EARNED, newLifetime.toString());
    return newAvailable;
  }

  spendRewardPoints(amount: number): boolean {
    const current = this.getRewardPoints();
    if (current < amount || amount < 0) {
      return false; // Insufficient points
    }
    const updated = current - amount;
    this.setItem(GAME_CONFIG.STORAGE_KEYS.REWARD_POINTS, updated.toString());
    // Note: totalRewardPointsEarned does NOT decrease when points are spent!
    return true;
  }

  // =========================================================================
  // SHOP & UNLOCKS (Cyber Arcade: 500 PTS, Ultra Speed Vortex: 1,000 PTS)
  // =========================================================================
  getUnlockedItems(): string[] {
    const val = this.getItem(GAME_CONFIG.STORAGE_KEYS.UNLOCKED_ITEMS);
    if (!val) return ['classic_neon'];
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        if (!parsed.includes('classic_neon')) {
          parsed.unshift('classic_neon');
        }
        return parsed;
      }
      return ['classic_neon'];
    } catch {
      return ['classic_neon'];
    }
  }

  isItemUnlocked(itemId: string): boolean {
    if (itemId === 'classic_neon') return true;
    return this.getUnlockedItems().includes(itemId);
  }

  unlockItem(itemId: string): void {
    const current = this.getUnlockedItems();
    if (!current.includes(itemId)) {
      current.push(itemId);
      this.setItem(GAME_CONFIG.STORAGE_KEYS.UNLOCKED_ITEMS, JSON.stringify(current));
    }
  }

  getActiveTheme(): string {
    return this.getItem(GAME_CONFIG.STORAGE_KEYS.ACTIVE_THEME) || 'classic_neon';
  }

  setActiveTheme(itemId: string): boolean {
    if (this.isItemUnlocked(itemId)) {
      this.setItem(GAME_CONFIG.STORAGE_KEYS.ACTIVE_THEME, itemId);
      return true;
    }
    return false;
  }

  purchaseShopItem(itemId: string): { success: boolean; message: string; neededPoints?: number } {
    if (this.isItemUnlocked(itemId)) {
      return { success: false, message: 'Item is already unlocked.' };
    }

    const item = GAME_CONFIG.SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) {
      return { success: false, message: 'Item does not exist.' };
    }

    const currentPoints = this.getRewardPoints();
    if (currentPoints < item.cost) {
      const needed = item.cost - currentPoints;
      return {
        success: false,
        message: `NOT ENOUGH POINTS: Need ${needed} more points (Cost: ${item.cost} PTS).`,
        neededPoints: needed
      };
    }

    // Atomic spend and unlock
    const spent = this.spendRewardPoints(item.cost);
    if (!spent) {
      return { success: false, message: 'Purchase transaction could not be completed.' };
    }

    this.unlockItem(itemId);
    this.setActiveTheme(itemId);
    return { success: true, message: `UNLOCKED ${item.name.toUpperCase()}!` };
  }

  // =========================================================================
  // DAILY REWARD CALENDAR LOGIC (Strictly Once Per Calendar Day)
  // =========================================================================
  getTodayDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getLastDailyRewardDate(): string | null {
    return this.getItem(GAME_CONFIG.STORAGE_KEYS.LAST_DAILY_REWARD_DATE);
  }

  canClaimDailyReward(): boolean {
    const today = this.getTodayDateString();
    const lastClaim = this.getLastDailyRewardDate();
    return lastClaim !== today;
  }

  claimDailyReward(): { success: boolean; rewardAmount: number; newPoints: number; message: string } {
    const rewardAmount = GAME_CONFIG.DAILY_REWARD_AMOUNT;
    const today = this.getTodayDateString();

    // Enforce in logic: strictly one collection per calendar day
    if (!this.canClaimDailyReward()) {
      return {
        success: false,
        rewardAmount: 0,
        newPoints: this.getRewardPoints(),
        message: 'Already claimed today! Return tomorrow for your next reward.'
      };
    }

    // Record claim date and award points
    this.setItem(GAME_CONFIG.STORAGE_KEYS.LAST_DAILY_REWARD_DATE, today);
    const newPoints = this.addRewardPoints(rewardAmount);

    return {
      success: true,
      rewardAmount,
      newPoints,
      message: `Claimed +${rewardAmount} Reward Points!`
    };
  }

  // =========================================================================
  // FIRST-TIME TUTORIAL STATE
  // =========================================================================
  hasSeenTutorial(): boolean {
    return this.getItem(GAME_CONFIG.STORAGE_KEYS.TUTORIAL_SEEN) === 'true';
  }

  setTutorialSeen(seen: boolean = true): void {
    this.setItem(GAME_CONFIG.STORAGE_KEYS.TUTORIAL_SEEN, seen ? 'true' : 'false');
  }

  // =========================================================================
  // SETTINGS & DIFFICULTY
  // =========================================================================
  getSettings(): GameSettings {
    const defaultSettings: GameSettings = {
      soundEnabled: true,
      musicEnabled: true,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      hardMode: false,
      difficulty: 'NORMAL',
    };

    const val = this.getItem(GAME_CONFIG.STORAGE_KEYS.SETTINGS);
    if (!val) return defaultSettings;
    try {
      const parsed = JSON.parse(val);
      const diff: DifficultyLevel = parsed.difficulty || (parsed.hardMode ? 'HARD' : 'NORMAL');
      return { ...defaultSettings, ...parsed, difficulty: diff, hardMode: diff === 'HARD' || diff === 'VERY HARD' };
    } catch {
      return defaultSettings;
    }
  }

  saveSettings(settings: Partial<GameSettings>): GameSettings {
    const current = this.getSettings();
    let diff = settings.difficulty !== undefined ? settings.difficulty : current.difficulty;
    if (settings.hardMode !== undefined && settings.difficulty === undefined) {
      diff = settings.hardMode ? 'HARD' : 'NORMAL';
    }
    const updated: GameSettings = {
      ...current,
      ...settings,
      difficulty: diff,
      hardMode: diff === 'HARD' || diff === 'VERY HARD'
    };
    try {
      this.setItem(GAME_CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch {
      // safe fallback
    }
    return updated;
  }

  // =========================================================================
  // CUMULATIVE STATS & RECORDING
  // =========================================================================
  getStats(): GameStats {
    const defaultStats: GameStats = {
      bestScore: this.getBestScore(),
      bestStreak: this.getBestStreak(),
      totalGamesPlayed: 0,
      totalScore: 0,
      totalCorrect: 0,
      totalWrong: 0,
      totalReactionTimeMs: 0,
      bestReactionTimeMs: 9999,
      totalRewardPointsEarned: this.getTotalRewardPointsEarned(),
    };

    const val = this.getItem(GAME_CONFIG.STORAGE_KEYS.STATS);
    if (!val) return defaultStats;
    try {
      const parsed = JSON.parse(val);
      return {
        bestScore: this.getBestScore(),
        bestStreak: this.getBestStreak(),
        totalGamesPlayed: parsed.totalGamesPlayed || 0,
        totalScore: parsed.totalScore || 0,
        totalCorrect: parsed.totalCorrect || 0,
        totalWrong: parsed.totalWrong || 0,
        totalReactionTimeMs: parsed.totalReactionTimeMs || 0,
        bestReactionTimeMs: parsed.bestReactionTimeMs || 9999,
        totalRewardPointsEarned: this.getTotalRewardPointsEarned(),
      };
    } catch {
      return defaultStats;
    }
  }

  recordGameCompletion(metrics: {
    score: number;
    streak: number;
    correct: number;
    wrong: number;
    totalReactionTimeMs?: number;
    bestReactionTimeMs: number;
  }): { isNewBestScore: boolean; isNewBestStreak: boolean } {
    const isNewBestScore = this.setBestScore(metrics.score);
    const isNewBestStreak = this.setBestStreak(metrics.streak);

    const stats = this.getStats();
    stats.totalGamesPlayed += 1;
    stats.totalScore += Math.max(0, metrics.score);
    stats.totalCorrect += metrics.correct;
    stats.totalWrong += metrics.wrong;
    if (metrics.totalReactionTimeMs) {
      stats.totalReactionTimeMs += metrics.totalReactionTimeMs;
    }
    stats.bestScore = Math.max(stats.bestScore, metrics.score);
    stats.bestStreak = Math.max(stats.bestStreak, metrics.streak);
    if (metrics.bestReactionTimeMs > 0 && metrics.bestReactionTimeMs < stats.bestReactionTimeMs) {
      stats.bestReactionTimeMs = metrics.bestReactionTimeMs;
    }
    stats.totalRewardPointsEarned = this.getTotalRewardPointsEarned();

    try {
      this.setItem(GAME_CONFIG.STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch {
      // safe
    }

    return { isNewBestScore, isNewBestStreak };
  }

  resetStats(): void {
    // Resets ONLY gameplay statistics.
    // Does NOT reset rewardPoints, totalRewardPointsEarned, unlocked shop items, active theme, or settings!
    const cleanStats: GameStats = {
      bestScore: 0,
      bestStreak: 0,
      totalGamesPlayed: 0,
      totalScore: 0,
      totalCorrect: 0,
      totalWrong: 0,
      totalReactionTimeMs: 0,
      bestReactionTimeMs: 9999,
      totalRewardPointsEarned: this.getTotalRewardPointsEarned(),
    };

    this.setItem(GAME_CONFIG.STORAGE_KEYS.BEST_SCORE, '0');
    this.setItem(GAME_CONFIG.STORAGE_KEYS.BEST_STREAK, '0');
    this.setItem(GAME_CONFIG.STORAGE_KEYS.STATS, JSON.stringify(cleanStats));
  }
}

export const storage = new StorageManager();
