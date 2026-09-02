import { SessionMetrics } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';
import { storage } from './storage';
import { audio } from './audio';

export type SessionUpdateCallback = (metrics: SessionMetrics, remainingSeconds: number) => void;
export type SessionEndCallback = (metrics: SessionMetrics) => void;

export class SessionManager {
  private metrics: SessionMetrics;
  private durationSec: number = GAME_CONFIG.SESSION_DURATION_SEC;
  private remainingTimeMs: number = GAME_CONFIG.SESSION_DURATION_SEC * 1000;
  private timerInterval: number | null = null;
  private lastTickTimestamp: number = 0;
  private isPaused: boolean = false;
  private isActive: boolean = false;

  private onUpdate: SessionUpdateCallback | null = null;
  private onEnd: SessionEndCallback | null = null;

  constructor(difficulty: import('../types/game').DifficultyLevel = 'NORMAL') {
    const isHard = difficulty === 'HARD' || difficulty === 'VERY HARD';
    this.metrics = {
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      currentStreak: 0,
      maxStreak: 0,
      totalReactionTimeMs: 0,
      reactionTimes: [],
      bestReactionTimeMs: 0,
      accuracyPercent: 100,
      averageReactionTimeMs: 0,
      sessionDurationSec: GAME_CONFIG.SESSION_DURATION_SEC,
      hardMode: isHard,
      difficulty,
      rewardPointsEarned: 0,
    };
  }

  start(onUpdate: SessionUpdateCallback, onEnd: SessionEndCallback): void {
    this.stop(); // Ensure any prior timer is cleaned up
    this.onUpdate = onUpdate;
    this.onEnd = onEnd;
    this.remainingTimeMs = this.durationSec * 1000;
    this.isActive = true;
    this.isPaused = false;
    this.lastTickTimestamp = performance.now();

    this.timerInterval = window.setInterval(() => {
      if (this.isPaused || !this.isActive) return;
      
      const now = performance.now();
      const delta = now - this.lastTickTimestamp;
      this.lastTickTimestamp = now;

      this.remainingTimeMs -= delta;

      if (this.remainingTimeMs <= 0) {
        this.remainingTimeMs = 0;
        this.stop();
        if (this.onUpdate) {
          this.onUpdate(this.getMetrics(), 0);
        }
        if (this.onEnd) {
          this.onEnd(this.getMetrics());
        }
      } else {
        if (this.onUpdate) {
          this.onUpdate(this.getMetrics(), Math.ceil(this.remainingTimeMs / 1000));
        }
      }
    }, 100);
  }

  pause(): void {
    if (!this.isActive || this.isPaused) return;
    this.isPaused = true;
  }

  resume(): void {
    if (!this.isActive || !this.isPaused) return;
    this.isPaused = false;
    this.lastTickTimestamp = performance.now();
  }

  recordAnswer(isCorrect: boolean, reactionTimeMs: number): {
    pointsAwarded: number;
    speedBonus: number;
    streakMilestoneReached: boolean;
  } {
    if (!this.isActive) {
      return { pointsAwarded: 0, speedBonus: 0, streakMilestoneReached: false };
    }

    let pointsAwarded = 0;
    let speedBonus = 0;
    let streakMilestoneReached = false;

    // Reaction time tracking
    this.metrics.reactionTimes.push(reactionTimeMs);
    this.metrics.totalReactionTimeMs += reactionTimeMs;
    this.metrics.averageReactionTimeMs = Math.round(
      this.metrics.totalReactionTimeMs / this.metrics.reactionTimes.length
    );

    if (this.metrics.bestReactionTimeMs === 0 || reactionTimeMs < this.metrics.bestReactionTimeMs) {
      this.metrics.bestReactionTimeMs = Math.round(reactionTimeMs);
    }

    if (isCorrect) {
      this.metrics.correctAnswers += 1;
      this.metrics.rewardPointsEarned += 1;
      // Core Rule: Every correct answer = exactly 1 Reward Point
      storage.awardCorrectAnswerPoint();

      this.metrics.currentStreak += 1;
      if (this.metrics.currentStreak > this.metrics.maxStreak) {
        this.metrics.maxStreak = this.metrics.currentStreak;
      }

      // Check streak milestone
      if (GAME_CONFIG.STREAK_MILESTONES.includes(this.metrics.currentStreak)) {
        streakMilestoneReached = true;
        audio.playStreakMilestone();
      }

      // Base score
      pointsAwarded += GAME_CONFIG.BASE_SCORE;

      // Speed bonus calculation (SCORING MODEL)
      if (reactionTimeMs < GAME_CONFIG.SPEED_BONUS_TIER_1_MS) {
        speedBonus = 3;
      } else if (reactionTimeMs < GAME_CONFIG.SPEED_BONUS_TIER_2_MS) {
        speedBonus = 2;
      } else if (reactionTimeMs < GAME_CONFIG.SPEED_BONUS_TIER_3_MS) {
        speedBonus = 1;
      }

      pointsAwarded += speedBonus;
      this.metrics.score += pointsAwarded;
    } else {
      this.metrics.wrongAnswers += 1;
      this.metrics.currentStreak = 0;
    }

    // Accuracy calculation
    const total = this.metrics.correctAnswers + this.metrics.wrongAnswers;
    this.metrics.accuracyPercent = total > 0 ? Math.round((this.metrics.correctAnswers / total) * 100) : 100;

    return { pointsAwarded, speedBonus, streakMilestoneReached };
  }

  getMetrics(): SessionMetrics {
    return { ...this.metrics };
  }

  getRemainingSeconds(): number {
    return Math.max(0, Math.ceil(this.remainingTimeMs / 1000));
  }

  getElapsedSeconds(): number {
    return Math.min(this.durationSec, this.durationSec - this.remainingTimeMs / 1000);
  }

  stop(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isActive = false;
    this.isPaused = false;
  }

  reset(difficulty?: import('../types/game').DifficultyLevel): void {
    this.stop();
    const diff = difficulty !== undefined ? difficulty : this.metrics.difficulty;
    const isHard = diff === 'HARD' || diff === 'VERY HARD';
    this.metrics = {
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      currentStreak: 0,
      maxStreak: 0,
      totalReactionTimeMs: 0,
      reactionTimes: [],
      bestReactionTimeMs: 0,
      accuracyPercent: 100,
      averageReactionTimeMs: 0,
      sessionDurationSec: GAME_CONFIG.SESSION_DURATION_SEC,
      hardMode: isHard,
      difficulty: diff,
      rewardPointsEarned: 0
    };
    this.remainingTimeMs = this.durationSec * 1000;
    this.lastTickTimestamp = 0;
  }

  finalize(): { isNewBestScore: boolean; isNewBestStreak: boolean } {
    this.stop();
    return storage.recordGameCompletion({
      score: this.metrics.score,
      streak: this.metrics.maxStreak,
      correct: this.metrics.correctAnswers,
      wrong: this.metrics.wrongAnswers,
      totalReactionTimeMs: this.metrics.totalReactionTimeMs,
      bestReactionTimeMs: this.metrics.bestReactionTimeMs
    });
  }
}
