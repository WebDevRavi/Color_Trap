import { ScreenManager } from './ui/screenManager';

document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    console.error('Color Trap: #app element not found!');
    return;
  }

  const screenManager = new ScreenManager(appContainer);

  // Start on Home Screen
  screenManager.showHome();

  // Expose for testing/debugging if needed
  (window as unknown as { __colorTrapScreenManager: ScreenManager }).__colorTrapScreenManager = screenManager;
});
