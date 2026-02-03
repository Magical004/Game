import { describe, expect, it } from "vitest";

import { resolveCollisionWinner, resolveTimerWinner } from "../../src/game/rules/match-end";

describe("match resolution", () => {
  it("returns draw on timer when sizes are equal", () => {
    expect(resolveTimerWinner(5, 5)).toBe("draw");
  });

  it("returns player when player is larger on timer", () => {
    expect(resolveTimerWinner(6, 5)).toBe("player");
  });

  it("returns bot when bot is larger on timer", () => {
    expect(resolveTimerWinner(4, 5)).toBe("bot");
  });

  it("returns larger snake when both collide", () => {
    expect(resolveCollisionWinner(7, 4, true, true)).toBe("player");
    expect(resolveCollisionWinner(2, 6, true, true)).toBe("bot");
  });

  it("returns draw when both collide and sizes are equal", () => {
    expect(resolveCollisionWinner(5, 5, true, true)).toBe("draw");
  });

  it("returns opponent when only one snake collides", () => {
    expect(resolveCollisionWinner(3, 3, true, false)).toBe("bot");
    expect(resolveCollisionWinner(3, 3, false, true)).toBe("player");
  });
});
