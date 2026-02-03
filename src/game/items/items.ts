import { DeterministicRng, findSpawnPosition } from "../engine/spawn";
import type { GridCoord, Item, Snake } from "../engine/types";
import type { GridBounds } from "../engine/spawn";

export const applyItemToSnake = (snake: Snake, item: Item): Snake => {
  if (item.type === "food") {
    const size = snake.size + 1;
    const segments = [...snake.segments, snake.segments[snake.segments.length - 1]];
    segments.length = size;
    return { ...snake, size, segments };
  }
  if (item.type === "poison") {
    const size = Math.max(1, snake.size - 1);
    const segments = snake.segments.slice(0, size);
    return { ...snake, size, segments };
  }
  if (item.type === "powerup") {
    return {
      ...snake,
      activePowerUp: item.powerUpType,
      powerUpExpiresAt: item.expiresAt ?? null,
    };
  }
  return snake;
};

export const spawnItem = (
  rng: DeterministicRng,
  bounds: GridBounds,
  blocked: GridCoord[],
  type: Item["type"],
): Item | null => {
  const position = findSpawnPosition(rng, bounds, blocked);
  if (!position) {
    return null;
  }
  return {
    id: `item-${rng.nextUint32()}`,
    type,
    powerUpType: type === "powerup" ? "speed" : null,
    position,
    spawnedAt: Date.now(),
    expiresAt: type === "powerup" ? Date.now() + 8000 : null,
  };
};
