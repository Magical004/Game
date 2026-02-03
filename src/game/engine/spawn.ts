import type { GridCoord } from "./types";

export interface GridBounds {
  width: number;
  height: number;
}

export class DeterministicRng {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  nextUint32() {
    this.state = (1664525 * this.state + 1013904223) >>> 0;
    return this.state;
  }

  nextFloat() {
    return this.nextUint32() / 0xffffffff;
  }

  nextInt(min: number, max: number) {
    if (max <= min) {
      return min;
    }
    const range = max - min + 1;
    return min + (this.nextUint32() % range);
  }

  pick<T>(values: T[]) {
    if (values.length === 0) {
      return undefined;
    }
    return values[this.nextInt(0, values.length - 1)];
  }
}

export const hashSeed = (seed: string | number) => {
  if (typeof seed === "number") {
    return seed >>> 0;
  }
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
};

export const createRng = (seed: string | number) => new DeterministicRng(hashSeed(seed));

export const coordKey = (coord: GridCoord) => `${coord.x},${coord.y}`;

export const isWithinBounds = (coord: GridCoord, bounds: GridBounds) =>
  coord.x >= 0 && coord.y >= 0 && coord.x < bounds.width && coord.y < bounds.height;

export const findSpawnPosition = (
  rng: DeterministicRng,
  bounds: GridBounds,
  blocked: GridCoord[] = [],
): GridCoord | null => {
  const total = bounds.width * bounds.height;
  if (total <= 0 || blocked.length >= total) {
    return null;
  }
  const blockedSet = new Set(blocked.map(coordKey));
  const maxAttempts = Math.min(64, total);
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const coord = {
      x: rng.nextInt(0, bounds.width - 1),
      y: rng.nextInt(0, bounds.height - 1),
    };
    if (!blockedSet.has(coordKey(coord))) {
      return coord;
    }
  }
  const open: GridCoord[] = [];
  for (let y = 0; y < bounds.height; y += 1) {
    for (let x = 0; x < bounds.width; x += 1) {
      const coord = { x, y };
      if (!blockedSet.has(coordKey(coord))) {
        open.push(coord);
      }
    }
  }
  return rng.pick(open) ?? null;
};
