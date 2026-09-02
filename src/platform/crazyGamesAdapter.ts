class CrazyGamesAdapter {
  private isInitialized = false;

  constructor() {
    this.checkInit();
  }

  private checkInit(): void {
    if (typeof window !== 'undefined' && window.CrazyGames?.SDK) {
      this.isInitialized = true;
    }
  }

  gameplayStart(): void {
    this.checkInit();
    try {
      if (this.isInitialized && window.CrazyGames?.SDK?.game?.gameplayStart) {
        window.CrazyGames.SDK.game.gameplayStart();
      }
    } catch {
      // safe fallback
    }
  }

  gameplayStop(): void {
    this.checkInit();
    try {
      if (this.isInitialized && window.CrazyGames?.SDK?.game?.gameplayStop) {
        window.CrazyGames.SDK.game.gameplayStop();
      }
    } catch {
      // safe fallback
    }
  }

  happytime(): void {
    this.checkInit();
    try {
      if (this.isInitialized && window.CrazyGames?.SDK?.game?.happytime) {
        window.CrazyGames.SDK.game.happytime();
      }
    } catch {
      // safe fallback
    }
  }
}

export const platform = new CrazyGamesAdapter();
