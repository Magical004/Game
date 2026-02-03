import { describe, expect, it } from "vitest";

import type { Item, Snake } from "../../src/game/engine/types";
import { applyItemToSnake } from "../../src/game/items/items";

const createSnake = (size: number): Snake => ({
  id: "snake-1",
  owner: "player",
  segments: Array.from({ length: size }, (_, idx) => ({ x: idx, y: 0 })),
  size,
  direction: "right",
  status: "alive",
  activePowerUp: null,
  powerUpExpiresAt: null,
});

const createItem = (type: Item["type"]): Item => ({
  id: "item-1",
  type,
  powerUpType: null,
  position: { x: 0, y: 0 },
  spawnedAt: 0,
  expiresAt: null,
});

describe("snake growth and poison clamp", () => {
  it("grows by one when food is collected", () => {
    const snake = createSnake(3);
    const updated = applyItemToSnake(snake, createItem("food"));

    expect(updated.size).toBe(4);
    expect(updated.segments.length).toBe(4);
  });

  it("clamps size to minimum of 1 when poison is collected", () => {
    const snake = createSnake(1);
    const updated = applyItemToSnake(snake, createItem("poison"));

    expect(updated.size).toBe(1);
    expect(updated.segments.length).toBe(1);
  });
});
