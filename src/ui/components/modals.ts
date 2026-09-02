import { storage } from '../../core/storage';
import { audio } from '../../core/audio';
import { GAME_CONFIG } from '../../config/gameConfig';
import { DifficultyLevel } from '../../types/game';

export class ModalManager {
  private container: HTMLElement;
  private isProcessingAction: boolean = false;

  constructor() {
    this.container = document.getElementById('modal-container') as HTMLElement;
  }

  showPauseModal(onResume: () => void, onRestart: () => void, onQuit: () => void): void {
    this.container.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">⏸️ GAME PAUSED</h2>
        <div style="display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 280px; margin: 12px 0;">
          <button id="modal-resume-btn" class="btn-arcade btn-primary-yellow" style="font-size: 1.4rem; padding: 12px 24px; min-width: auto;">RESUME ▶</button>
          <button id="modal-restart-btn" class="btn-arcade btn-purple">RESTART 🔄</button>
          <button id="modal-quit-btn" class="btn-arcade btn-blue">QUIT TO HOME 🏠</button>
        </div>
      </div>
    `;

    this.container.classList.remove('hidden');

    document.getElementById('modal-resume-btn')?.addEventListener('click', () => {
      audio.playClick();
      this.close();
      onResume();
    });

    document.getElementById('modal-restart-btn')?.addEventListener('click', () => {
      audio.playClick();
      this.close();
      onRestart();
    });

    document.getElementById('modal-quit-btn')?.addEventListener('click', () => {
      audio.playClick();
      this.close();
      onQuit();
    });
  }

  showSettingsModal(onSoundToggle?: (enabled: boolean) => void): void {
    const settings = storage.getSettings();

    this.container.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">⚙️ SETTINGS</h2>
        <div style="width: 100%;">
          <div class="modal-row">
            <span>🔊 Sound Effects</span>
            <input type="checkbox" id="setting-sound" ${settings.soundEnabled ? 'checked' : ''} style="width: 22px; height: 22px; cursor: pointer;" />
          </div>
          <div class="modal-row">
            <span>✨ Reduced Motion</span>
            <input type="checkbox" id="setting-motion" ${settings.reducedMotion ? 'checked' : ''} style="width: 22px; height: 22px; cursor: pointer;" />
          </div>
          <div class="modal-row">
            <span>⚡ Difficulty Mode</span>
            <select id="setting-difficulty" style="background: #1C2347; color: #FFDE59; border: 1px solid #FFC400; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 0.95rem; cursor: pointer;">
              <option value="EASY" ${settings.difficulty === 'EASY' ? 'selected' : ''}>EASY</option>
              <option value="NORMAL" ${settings.difficulty === 'NORMAL' ? 'selected' : ''}>NORMAL</option>
              <option value="HARD" ${settings.difficulty === 'HARD' ? 'selected' : ''}>HARD</option>
              <option value="VERY HARD" ${settings.difficulty === 'VERY HARD' ? 'selected' : ''}>VERY HARD</option>
            </select>
          </div>
        </div>
        <button id="modal-close-settings" class="btn-arcade btn-primary-yellow modal-close-btn" style="min-width: 180px; font-size: 1.2rem; padding: 10px 24px;">DONE</button>
      </div>
    `;

    this.container.classList.remove('hidden');

    const soundCb = document.getElementById('setting-sound') as HTMLInputElement;
    soundCb?.addEventListener('change', () => {
      const enabled = soundCb.checked;
      storage.saveSettings({ soundEnabled: enabled });
      if (onSoundToggle) onSoundToggle(enabled);
      if (enabled) audio.playClick();
    });

    const motionCb = document.getElementById('setting-motion') as HTMLInputElement;
    motionCb?.addEventListener('change', () => {
      storage.saveSettings({ reducedMotion: motionCb.checked });
      audio.playClick();
    });

    const diffSelect = document.getElementById('setting-difficulty') as HTMLSelectElement;
    diffSelect?.addEventListener('change', () => {
      const diff = diffSelect.value as DifficultyLevel;
      storage.saveSettings({ difficulty: diff });
      audio.playClick();
    });

    document.getElementById('modal-close-settings')?.addEventListener('click', () => {
      audio.playClick();
      this.close();
    });
  }

  showStatsModal(): void {
    const stats = storage.getStats();
    const points = storage.getRewardPoints();
    const lifetimePoints = storage.getTotalRewardPointsEarned();
    const unlocked = storage.getUnlockedItems();
    const totalItems = GAME_CONFIG.SHOP_ITEMS.length;

    const total = stats.totalCorrect + stats.totalWrong;
    const accuracy = total > 0 ? Math.round((stats.totalCorrect / total) * 100) : 0;
    const avgReaction = total > 0 ? Math.round(stats.totalReactionTimeMs / total) : 0;
    const bestReact = stats.bestReactionTimeMs < 9000 ? `${stats.bestReactionTimeMs} ms` : '—';

    this.container.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">📊 ALL-TIME STATS</h2>
        <div style="width: 100%; max-height: 380px; overflow-y: auto; padding-right: 4px;">
          <div class="modal-row">
            <span>💎 Available Reward Points</span>
            <strong style="color: #00C8FF; font-size: 1.3rem;">${points}</strong>
          </div>
          <div class="modal-row">
            <span>🌟 Lifetime Points Earned</span>
            <strong style="color: #FFDE59;">${lifetimePoints}</strong>
          </div>
          <div class="modal-row">
            <span>👑 High Score</span>
            <strong style="color: #FFC400; font-size: 1.3rem;">${stats.bestScore}</strong>
          </div>
          <div class="modal-row">
            <span>🔥 Best Streak</span>
            <strong style="color: #FF8533; font-size: 1.3rem;">x${stats.bestStreak}</strong>
          </div>
          <div class="modal-row">
            <span>🎮 Games Completed</span>
            <strong>${stats.totalGamesPlayed}</strong>
          </div>
          <div class="modal-row">
            <span>🎯 Total Correct</span>
            <strong style="color: #14C834;">${stats.totalCorrect}</strong>
          </div>
          <div class="modal-row">
            <span>❌ Total Wrong</span>
            <strong style="color: #FF4557;">${stats.totalWrong}</strong>
          </div>
          <div class="modal-row">
            <span>📈 Lifetime Accuracy</span>
            <strong style="color: #0088FF;">${accuracy}%</strong>
          </div>
          <div class="modal-row">
            <span>⏱️ Avg. Reaction Time</span>
            <strong style="color: #6CE5E8;">${avgReaction} ms</strong>
          </div>
          <div class="modal-row">
            <span>⚡ Best Reaction Time</span>
            <strong style="color: #A23DF5;">${bestReact}</strong>
          </div>
          <div class="modal-row">
            <span>🎨 Themes Unlocked</span>
            <strong style="color: #B57BFF;">${unlocked.length} / ${totalItems}</strong>
          </div>
        </div>

        <div style="display: flex; gap: 14px; width: 100%; justify-content: center; align-items: center; margin-top: 22px;">
          <button id="modal-reset-stats-btn" class="btn-danger" style="padding: 10px 20px; font-size: 0.95rem;">
            🗑️ RESET STATS
          </button>
          <button id="modal-close-stats" class="btn-arcade btn-primary-yellow" style="min-width: 140px; font-size: 1.15rem; padding: 10px 24px;">
            CLOSE
          </button>
        </div>
      </div>
    `;

    this.container.classList.remove('hidden');

    document.getElementById('modal-close-stats')?.addEventListener('click', () => {
      audio.playClick();
      this.close();
    });

    document.getElementById('modal-reset-stats-btn')?.addEventListener('click', () => {
      audio.playClick();
      this.showResetConfirmationModal();
    });
  }

  showResetConfirmationModal(): void {
    this.container.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title" style="color: #FF4557;">⚠️ RESET STATISTICS?</h2>
        <p style="font-size: 1.05rem; color: #E0E8FF; margin: 12px 0 20px; line-height: 1.5;">
          This will reset your score, streak, and reaction time history.<br/>
          <strong>Your Reward Points and Unlocked Themes will NOT be lost.</strong><br/>
          This action cannot be undone.
        </p>
        <div style="display: flex; gap: 16px; width: 100%; justify-content: center;">
          <button id="confirm-cancel-btn" class="btn-arcade btn-blue" style="min-width: 130px; padding: 10px 20px;">
            CANCEL
          </button>
          <button id="confirm-reset-btn" class="btn-danger" style="min-width: 130px; padding: 10px 20px; font-size: 1.05rem;">
            RESET
          </button>
        </div>
      </div>
    `;

    document.getElementById('confirm-cancel-btn')?.addEventListener('click', () => {
      audio.playClick();
      this.showStatsModal(); // Return to stats modal
    });

    document.getElementById('confirm-reset-btn')?.addEventListener('click', () => {
      audio.playClick();
      storage.resetStats();
      this.showStatsModal(); // Re-render stats modal with 0 values
    });
  }

  showAchievementsModal(): void {
    const stats = storage.getStats();
    const list = [
      { name: 'First Trap Survived', desc: 'Score your first point', done: stats.bestScore >= 1, icon: '🎯' },
      { name: 'On Fire!', desc: 'Reach a streak of 10x', done: stats.bestStreak >= 10, icon: '🔥' },
      { name: 'Lightning Reflexes', desc: 'Reaction time under 450ms', done: stats.bestReactionTimeMs <= 450, icon: '⚡' },
      { name: 'Century Club', desc: 'Score 100+ points in one run', done: stats.bestScore >= 100, icon: '👑' },
    ];

    const rows = list.map(item => `
      <div class="modal-row" style="text-align: left;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.5rem;">${item.icon}</span>
          <div>
            <div style="font-weight: 800; color: ${item.done ? '#FFC400' : '#8899B5'};">${item.name}</div>
            <div style="font-size: 0.8rem; color: #8899B5;">${item.desc}</div>
          </div>
        </div>
        <span style="font-size: 1.2rem;">${item.done ? '✅' : '🔒'}</span>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">🏆 ACHIEVEMENTS</h2>
        <div style="width: 100%; max-height: 280px; overflow-y: auto;">
          ${rows}
        </div>
        <button id="modal-close-achieve" class="btn-arcade btn-primary-yellow modal-close-btn" style="min-width: 180px; font-size: 1.2rem; padding: 10px 24px;">AWESOME</button>
      </div>
    `;

    this.container.classList.remove('hidden');

    document.getElementById('modal-close-achieve')?.addEventListener('click', () => {
      audio.playClick();
      this.close();
    });
  }

  showDailyRewardModal(): void {
    const canClaim = storage.canClaimDailyReward();
    const rewardAmount = GAME_CONFIG.DAILY_REWARD_AMOUNT;

    if (canClaim) {
      this.container.innerHTML = `
        <div class="modal-card">
          <h2 class="modal-title">🎁 DAILY REWARD</h2>
          <div style="font-size: 3.5rem; margin: 8px 0;">🎉</div>
          <p style="font-size: 1.1rem; color: #CCD8F5; margin-bottom: 14px;">
            Claim your Daily Arcade Focus Booster!
          </p>
          <div style="background: rgba(255, 184, 0, 0.15); border: 1px solid #FFB800; border-radius: 14px; padding: 12px 20px; color: #FFC400; font-weight: 800; margin-bottom: 20px; font-size: 1.25rem;">
            +${rewardAmount} REWARD POINTS
          </div>
          <button id="modal-claim-reward-btn" class="btn-arcade btn-primary-yellow" style="min-width: 180px; font-size: 1.2rem; padding: 12px 28px;">
            COLLECT ▶
          </button>
        </div>
      `;

      this.container.classList.remove('hidden');

      const claimBtn = document.getElementById('modal-claim-reward-btn');
      claimBtn?.addEventListener('click', () => {
        // Enforce double-click protection in logic
        if (this.isProcessingAction) return;
        this.isProcessingAction = true;

        const result = storage.claimDailyReward();
        if (result.success) {
          audio.playStreakMilestone();
          // Render claimed confirmation
          this.container.innerHTML = `
            <div class="modal-card">
              <h2 class="modal-title" style="color: #14C834;">✅ REWARD COLLECTED!</h2>
              <div style="font-size: 3.5rem; margin: 8px 0;">💎</div>
              <p style="font-size: 1.15rem; color: #E2ECFF; margin-bottom: 12px;">
                You received <strong>+${rewardAmount} Points</strong>!
              </p>
              <div style="color: #8E9FC2; font-size: 0.9rem; margin-bottom: 20px;">
                Come back tomorrow to collect again!
              </div>
              <button id="modal-claimed-close-btn" class="btn-arcade btn-primary-yellow" style="min-width: 160px; font-size: 1.15rem; padding: 10px 24px;">
                CONTINUE ▶
              </button>
            </div>
          `;
          document.getElementById('modal-claimed-close-btn')?.addEventListener('click', () => {
            audio.playClick();
            this.isProcessingAction = false;
            this.close();
          });
        } else {
          this.isProcessingAction = false;
          this.showDailyRewardModal();
        }
      });
    } else {
      // Already claimed today
      this.container.innerHTML = `
        <div class="modal-card">
          <h2 class="modal-title">🎁 DAILY REWARD</h2>
          <div style="font-size: 3.2rem; margin: 8px 0; filter: grayscale(0.5);">⏳</div>
          <h3 style="color: #FFC400; font-size: 1.3rem; margin-bottom: 8px;">ALREADY COLLECTED TODAY!</h3>
          <p style="font-size: 1rem; color: #A0B2DC; margin-bottom: 20px; line-height: 1.4;">
            You have already claimed today's daily reward.<br/>
            Come back tomorrow to receive your next bonus!
          </p>
          <button id="modal-close-reward" class="btn-arcade btn-blue" style="min-width: 160px; font-size: 1.15rem; padding: 10px 24px;">
            GOT IT
          </button>
        </div>
      `;

      this.container.classList.remove('hidden');

      document.getElementById('modal-close-reward')?.addEventListener('click', () => {
        audio.playClick();
        this.close();
      });
    }
  }

  showShopModal(): void {
    const points = storage.getRewardPoints();
    const items = GAME_CONFIG.SHOP_ITEMS;

    const itemRows = items.map(item => {
      const isUnlocked = storage.isItemUnlocked(item.id);
      let actionBtnHtml = '';

      if (isUnlocked) {
        actionBtnHtml = `<span class="shop-btn-action shop-btn-unlocked">UNLOCKED ✔</span>`;
      } else if (points >= item.cost) {
        actionBtnHtml = `<button class="shop-btn-action shop-btn-buy" data-item-id="${item.id}" data-cost="${item.cost}">UNLOCK (${item.cost} PTS)</button>`;
      } else {
        actionBtnHtml = `<button class="shop-btn-action shop-btn-locked" data-item-id="${item.id}" data-cost="${item.cost}">LOCKED (${item.cost} PTS)</button>`;
      }

      return `
        <div class="shop-item-card">
          <div class="shop-item-left">
            <span style="font-size: 2rem;">${item.icon}</span>
            <div>
              <div class="shop-item-name">${item.name}</div>
              <div class="shop-item-desc">${item.desc}</div>
            </div>
          </div>
          <div>${actionBtnHtml}</div>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="modal-card" style="max-width: 560px;">
        <h2 class="modal-title">🛒 ARCADE SHOP</h2>
        <div class="shop-balance-badge">
          <span>💎 Your Reward Points:</span>
          <strong id="shop-modal-points">${points}</strong>
        </div>
        <div id="shop-feedback-msg" style="display: none; padding: 8px 14px; border-radius: 8px; margin-bottom: 12px; font-weight: 700; font-size: 0.95rem;"></div>
        <div style="width: 100%; display: flex; flex-direction: column; gap: 12px;">
          ${itemRows}
        </div>
        <button id="modal-close-shop" class="btn-arcade btn-primary-yellow modal-close-btn" style="min-width: 160px; font-size: 1.15rem; padding: 10px 24px;">BACK</button>
      </div>
    `;

    this.container.classList.remove('hidden');

    // Attach buy and locked buttons with feedback & double-click protection
    const buyBtns = this.container.querySelectorAll<HTMLButtonElement>('.shop-btn-buy');
    buyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isProcessingAction) return;
        this.isProcessingAction = true;

        const itemId = btn.getAttribute('data-item-id');
        if (!itemId) {
          this.isProcessingAction = false;
          return;
        }

        const result = storage.purchaseShopItem(itemId);
        if (result.success) {
          audio.playStreakMilestone();
          this.isProcessingAction = false;
          this.showShopModal();
          const msgEl = document.getElementById('shop-feedback-msg');
          if (msgEl) {
            msgEl.style.display = 'block';
            msgEl.style.background = 'rgba(20, 200, 52, 0.2)';
            msgEl.style.color = '#14C834';
            msgEl.style.border = '1px solid #14C834';
            msgEl.textContent = result.message;
          }
        } else {
          audio.playWrong();
          this.isProcessingAction = false;
          const msgEl = document.getElementById('shop-feedback-msg');
          if (msgEl) {
            msgEl.style.display = 'block';
            msgEl.style.background = 'rgba(255, 69, 87, 0.2)';
            msgEl.style.color = '#FF4557';
            msgEl.style.border = '1px solid #FF4557';
            msgEl.textContent = result.message;
          }
        }
      });
    });

    // Provide explicit feedback on clicking locked items
    const lockedBtns = this.container.querySelectorAll<HTMLButtonElement>('.shop-btn-locked');
    lockedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        audio.playWrong();
        const cost = parseInt(btn.getAttribute('data-cost') || '0', 10);
        const needed = Math.max(1, cost - storage.getRewardPoints());
        const msgEl = document.getElementById('shop-feedback-msg');
        if (msgEl) {
          msgEl.style.display = 'block';
          msgEl.style.background = 'rgba(255, 69, 87, 0.2)';
          msgEl.style.color = '#FF4557';
          msgEl.style.border = '1px solid #FF4557';
          msgEl.textContent = `NOT ENOUGH POINTS: Need ${needed} more points (Cost: ${cost} PTS).`;
        }
      });
    });

    document.getElementById('modal-close-shop')?.addEventListener('click', () => {
      audio.playClick();
      this.close();
    });
  }

  close(): void {
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
    this.isProcessingAction = false;
  }
}

export const modals = new ModalManager();
