export type Difficulty = "easy" | "medium" | "hard";
export type Direction = "up" | "down" | "left" | "right";
export type SnakeOwner = "player" | "bot";
export type SnakeStatus = "alive" | "collided";
export type PowerUpType = "shield" | "slow-time" | "speed" | null;
export type ItemType = "food" | "poison" | "powerup";
export type MatchState = "ready" | "active" | "ended";
export type MatchWinner = "player" | "bot" | "draw" | null;
export type MatchEndReason = "collision" | "timer" | null;

export interface GridCoord {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  displayName?: string;
  preferencesId: string;
}

export interface PlayerPreferences {
  id: string;
  snakeColor: string;
  difficulty: Difficulty;
  themeId: string;
  audioEnabled: boolean;
  musicEnabled: boolean;
}

export interface Bot {
  id: string;
  difficulty: Difficulty;
}

export interface Snake {
  id: string;
  owner: SnakeOwner;
  segments: GridCoord[];
  size: number;
  direction: Direction;
  status: SnakeStatus;
  activePowerUp: PowerUpType;
  powerUpExpiresAt: number | null;
}

export interface Item {
  id: string;
  type: ItemType;
  powerUpType: PowerUpType;
  position: GridCoord;
  spawnedAt: number;
  expiresAt: number | null;
}

export interface ArenaTheme {
  id: string;
  name: string;
  backgroundStyle: string;
  accentColor: string;
}

export interface Match {
  id: string;
  state: MatchState;
  startedAt: number | null;
  endedAt: number | null;
  durationSec: number;
  remainingSec: number;
  winner: MatchWinner;
  endReason: MatchEndReason;
  playerSnakeId: string;
  botSnakeId: string;
  themeId: string;
  difficulty: Difficulty;
  items: Item[];
}

export interface MatchRecord {
  id: string;
  timestamp: number;
  winner: Exclude<MatchWinner, null>;
  playerSize: number;
  botSize: number;
  difficulty: Difficulty;
  durationSec: number;
  themeId: string;
}

export interface HighScoreEntry {
  id: string;
  score: number;
  difficulty: Difficulty;
  timestamp: number;
}
