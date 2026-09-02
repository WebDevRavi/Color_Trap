import { SessionMetrics } from '../types/game';
import { HomeScreen } from './screens/homeScreen';
import { InstructionsScreen } from './screens/instructionsScreen';
import { GameplayScreen } from './screens/gameplayScreen';
import { GameOverScreen } from './screens/gameOverScreen';
import { stateMachine } from '../core/stateMachine';
import { storage } from '../core/storage';

export class ScreenManager {
  private appRoot: HTMLElement;
  private currentScreenInstance: { unmount: () => void } | null = null;

  constructor(appRoot: HTMLElement) {
    this.appRoot = appRoot;
  }

  showHome(): void {
    stateMachine.transitionTo('HOME');
    this.switchScreen(
      new HomeScreen({
        onPlay: () => this.showGameplay(),
        onHowToPlay: () => this.showInstructions()
      })
    );
  }

  showInstructions(): void {
    stateMachine.transitionTo('INSTRUCTIONS');
    this.switchScreen(
      new InstructionsScreen({
        onBack: () => this.showHome(),
        onGotIt: () => this.showGameplay()
      })
    );
  }

  showGameplay(hardMode: boolean = false): void {
    if (hardMode) {
      storage.saveSettings({ hardMode: true });
    }
    stateMachine.transitionTo('COUNTDOWN');
    this.switchScreen(
      new GameplayScreen({
        onGameOver: (metrics: SessionMetrics) => this.showGameOver(metrics),
        onQuitToHome: () => this.showHome()
      })
    );
  }

  showGameOver(metrics: SessionMetrics): void {
    stateMachine.transitionTo('GAMEOVER');
    this.switchScreen(
      new GameOverScreen(metrics, {
        onPlayAgain: (hardMode: boolean) => this.showGameplay(hardMode),
        onHome: () => this.showHome()
      })
    );
  }

  private switchScreen(newScreen: { mount: (parent: HTMLElement) => void; unmount: () => void }): void {
    // 1. Cleanly unmount old screen
    if (this.currentScreenInstance) {
      this.currentScreenInstance.unmount();
      this.currentScreenInstance = null;
    }

    // 2. Clear root container
    this.appRoot.innerHTML = '';

    // 3. Mount new screen
    this.currentScreenInstance = newScreen;
    newScreen.mount(this.appRoot);
  }
}
