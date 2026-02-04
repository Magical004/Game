import type { GridCoord, Snake } from "../engine/types";

export interface Bounds {
  width: number;
  height: number;
}

const directionDelta: Record<Snake["direction"], GridCoord> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const nextHeadPosition = (snake: Snake): GridCoord => {
  const head = snake.segments[0];
  const delta = directionDelta[snake.direction];
  return { x: head.x + delta.x, y: head.y + delta.y };
};

const isOutOfBounds = (coord: GridCoord, bounds: Bounds) =>
  coord.x < 0 || coord.y < 0 || coord.x >= bounds.width || coord.y >= bounds.height;

const coordEquals = (a: GridCoord, b: GridCoord) => a.x === b.x && a.y === b.y;

const hitsSegments = (coord: GridCoord, segments: GridCoord[]) =>
  segments.some((segment) => coordEquals(coord, segment));

export interface StepResult {
  player: Snake;
  bot: Snake;
  playerCollided: boolean;
  botCollided: boolean;
}

export const stepSnakes = (player: Snake, bot: Snake, bounds: Bounds): StepResult => {
  const playerNext = nextHeadPosition(player);
  const botNext = nextHeadPosition(bot);

  const playerHitsWall = isOutOfBounds(playerNext, bounds);
  const botHitsWall = isOutOfBounds(botNext, bounds);
  const playerHitsSelf = hitsSegments(playerNext, player.segments.slice(0, -1));
  const botHitsSelf = hitsSegments(botNext, bot.segments.slice(0, -1));
  const playerHitsBot = hitsSegments(playerNext, bot.segments);
  const botHitsPlayer = hitsSegments(botNext, player.segments);
  const headToHead = coordEquals(playerNext, botNext);

  const playerCollided = playerHitsWall || playerHitsSelf || playerHitsBot || headToHead;
  const botCollided = botHitsWall || botHitsSelf || botHitsPlayer || headToHead;

  const advance = (snake: Snake, next: GridCoord): Snake => {
    if (snake.status === "collided") {
      return snake;
    }
    const segments = [next, ...snake.segments];
    segments.length = snake.size;
    return { ...snake, segments };
  };

  const updatedPlayer = playerCollided
    ? { ...player, status: "collided" as const }
    : advance(player, playerNext);
  const updatedBot = botCollided ? { ...bot, status: "collided" as const } : advance(bot, botNext);

  return { player: updatedPlayer, bot: updatedBot, playerCollided, botCollided };
};
