import { describe, expect, it } from "vitest";

import type { Snake } from "../../src/game/engine/types";
import { applyPowerUp, resolvePowerUpPriority } from "../../src/game/items/powerups";

const baseSnake: Snake = {
  id: "snake-1",
  owner: "player",
  segments: [{ x: 0, y: 0 }],
  size: 1,
  direction: "right",
  status: "alive",
  activePowerUp: null,
  powerUpExpiresAt: null,
};

describe("power-up priority", () => {
  it("prefers higher priority power-ups", () => {
    expect(resolvePowerUpPriority("speed", "shield")).toBe("shield");
    expect(resolvePowerUpPriority("slow-time", "speed")).toBe("slow-time");
  });

  it("does not replace higher priority with lower", () => {
    expect(resolvePowerUpPriority("shield", "speed")).toBe("shield");
  });

  it("applies duration when power-up is accepted", () => {
    const updated = applyPowerUp(baseSnake, "shield", 5000, 1000);
    expect(updated.activePowerUp).toBe("shield");
    expect(updated.powerUpExpiresAt).toBe(6000);
  });
});
