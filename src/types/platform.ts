export interface CrazyGamesSDK {
  game?: {
    gameplayStart?: () => void;
    gameplayStop?: () => void;
    happytime?: () => void;
  };
  ad?: {
    requestAd?: (type: 'midgame' | 'rewarded') => Promise<void>;
  };
  banner?: {
    requestBanner?: (options: { id: string; width: number; height: number }) => void;
  };
}

declare global {
  interface Window {
    CrazyGames?: {
      SDK?: CrazyGamesSDK;
    };
  }
}
