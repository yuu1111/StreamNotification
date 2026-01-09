export interface StreamerState {
  userId: string;
  username: string;
  displayName: string;
  profileImageUrl: string;
  isLive: boolean;
  title: string;
  gameId: string;
  gameName: string;
  startedAt: string | null;
  thumbnailUrl: string | null;
  viewerCount: number;
}

export class StateManager {
  private states = new Map<string, StreamerState>();

  getState(username: string): StreamerState | undefined {
    return this.states.get(username.toLowerCase());
  }

  updateState(username: string, newState: StreamerState): void {
    this.states.set(username.toLowerCase(), newState);
  }

  hasState(username: string): boolean {
    return this.states.has(username.toLowerCase());
  }

  getAllStates(): Map<string, StreamerState> {
    return new Map(this.states);
  }
}
