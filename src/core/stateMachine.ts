import { ScreenState } from '../types/game';

type StateChangeListener = (newState: ScreenState, prevState: ScreenState) => void;

class StateMachine {
  private currentState: ScreenState = 'HOME';
  private listeners: Set<StateChangeListener> = new Set();

  private allowedTransitions: Record<ScreenState, ScreenState[]> = {
    HOME: ['INSTRUCTIONS', 'COUNTDOWN'],
    INSTRUCTIONS: ['HOME', 'COUNTDOWN'],
    COUNTDOWN: ['PLAYING', 'HOME'],
    PLAYING: ['PAUSED', 'GAMEOVER', 'HOME'],
    PAUSED: ['PLAYING', 'COUNTDOWN', 'HOME'],
    GAMEOVER: ['COUNTDOWN', 'HOME']
  };

  getState(): ScreenState {
    return this.currentState;
  }

  canTransitionTo(nextState: ScreenState): boolean {
    return this.allowedTransitions[this.currentState]?.includes(nextState) ?? false;
  }

  transitionTo(nextState: ScreenState): boolean {
    if (this.currentState === nextState) return false;
    
    const valid = this.canTransitionTo(nextState);
    if (!valid) {
      console.warn(`StateMachine: invalid transition from ${this.currentState} to ${nextState}`);
      return false;
    }

    const prevState = this.currentState;
    this.currentState = nextState;
    this.notifyListeners(nextState, prevState);
    return true;
  }

  subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(newState: ScreenState, prevState: ScreenState): void {
    this.listeners.forEach((listener) => {
      try {
        listener(newState, prevState);
      } catch (err) {
        console.error('StateMachine listener error:', err);
      }
    });
  }
}

export const stateMachine = new StateMachine();
