import type { GridCoord, Item, Snake } from "../engine/types";
import type { DifficultySettings } from "./difficulty";

const distance = (a: GridCoord, b: GridCoord) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const directionFromDelta = (dx: number, dy: number): Snake["direction"] => {
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? "right" : "left";
  }
  return dy >= 0 ? "down" : "up";
};

const directionDelta: Record<Snake["direction"], GridCoord> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const isOutOfBounds = (coord: GridCoord, width: number, height: number) =>
  coord.x < 0 || coord.y < 0 || coord.x >= width || coord.y >= height;

const hitsSegments = (coord: GridCoord, segments: GridCoord[]) =>
  segments.some((segment) => coord.x === segment.x && coord.y === segment.y);

export const chooseBotDirection = (
  bot: Snake,
  items: Item[],
  settings?: DifficultySettings,
  gridWidth = 20,
  gridHeight = 20,
  playerSegments: GridCoord[] = [],
): Snake["direction"] => {
  const head = bot.segments[0];
  const body = bot.segments.slice(1);
  const allObstacles = [...body, ...playerSegments];

  const isSafe = (dir: Snake["direction"]): boolean => {
    const delta = directionDelta[dir];
    const newPos = { x: head.x + delta.x, y: head.y + delta.y };
    if (isOutOfBounds(newPos, gridWidth, gridHeight)) {
      return false;
    }
    if (hitsSegments(newPos, allObstacles)) {
      return false;
    }
    return true;
  };

  const allDirections: Snake["direction"][] = ["up", "down", "left", "right"];
  const safeDirections = allDirections.filter(isSafe);

  if (safeDirections.length === 0) {
    return bot.direction;
  }

  const foodTargets = items.filter((item) => item.type === "food");
  if (foodTargets.length === 0) {
    return safeDirections[Math.floor(Math.random() * safeDirections.length)];
  }

  const nearest = foodTargets.reduce((closest, current) =>
    distance(head, current.position) < distance(head, closest.position) ? current : closest,
  );

  const scoreDirection = (dir: Snake["direction"]): number => {
    if (!isSafe(dir)) {
      return -Infinity;
    }
    const delta = directionDelta[dir];
    const newPos = { x: head.x + delta.x, y: head.y + delta.y };
    return -distance(newPos, nearest.position);
  };

  const sortedDirections = allDirections
    .map((dir) => ({ dir, score: scoreDirection(dir) }))
    .sort((a, b) => b.score - a.score);

  const bestSafe = sortedDirections.find((d) => isSafe(d.dir));
  if (bestSafe) {
    if (!settings) {
      return bestSafe.dir;
    }
    if (Math.random() < settings.maxMistakeChance) {
      return safeDirections[Math.floor(Math.random() * safeDirections.length)];
    }
    return bestSafe.dir;
  }

  return safeDirections[Math.floor(Math.random() * safeDirections.length)];
};
