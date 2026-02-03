import { createRng } from "./spawn";
import type {
  Difficulty,
  GridCoord,
  Item,
  Match,
  MatchState,
  Snake,
  SnakeOwner,
} from "./types";

export interface GameState {
  match: Match;
  player: Snake;
  bot: Snake;
  items: Item[];
  grid: { width: number; height: number };
  rngSeed: number;
}

export interface MatchConfig {
  gridWidth?: number;
  gridHeight?: number;
  durationSec?: number;
  seed?: number;
  difficulty?: Difficulty;
  themeId?: string;
}

const createSnake = (id: string, owner: SnakeOwner, segments: GridCoord[], direction: Snake["direction"]): Snake => ({
  id,
  owner,
  segments,
  size: segments.length,
  direction,
  status: "alive",
  activePowerUp: null,
  powerUpExpiresAt: null,
});

const createMatch = (
  state: MatchState,
  durationSec: number,
  difficulty: Difficulty,
  playerSnakeId: string,
  botSnakeId: string,
): Match => ({
  id: `match-${Date.now()}`,
  state,
  startedAt: null,
  endedAt: null,
  durationSec,
  remainingSec: durationSec,
  winner: null,
  endReason: null,
  playerSnakeId,
  botSnakeId,
  themeId: "default",
  difficulty,
  items: [],
});

export const createMatchState = (config: MatchConfig = {}): GameState => {
  const gridWidth = config.gridWidth ?? 20;
  const gridHeight = config.gridHeight ?? 20;
  const durationSec = config.durationSec ?? 30;
  const difficulty = config.difficulty ?? "medium";
  const themeId = config.themeId ?? "default";
  const rngSeed = config.seed ?? createRng(Date.now()).nextUint32();

  const midY = Math.floor(gridHeight / 2);
  const playerSegments: GridCoord[] = [
    { x: 3, y: midY },
    { x: 2, y: midY },
    { x: 1, y: midY },
  ];
  const botSegments: GridCoord[] = [
    { x: gridWidth - 4, y: midY },
    { x: gridWidth - 3, y: midY },
    { x: gridWidth - 2, y: midY },
  ];

  const player = createSnake("player-snake", "player", playerSegments, "right");
  const bot = createSnake("bot-snake", "bot", botSegments, "left");

  return {
    match: { ...createMatch("ready", durationSec, difficulty, player.id, bot.id), themeId },
    player,
    bot,
    items: [],
    grid: { width: gridWidth, height: gridHeight },
    rngSeed,
  };
};
