import { describe, expect, it } from "vitest";

import { DeterministicRng } from "../../src/game/engine/spawn";
import { resolveTeleportExit } from "../../src/game/rules/teleport";

describe("teleport exit resolution", () => {
  it("returns a non-blocked exit", () => {
    const rng = new DeterministicRng(42);
    const exits = [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];
    const blocked = [{ x: 1, y: 1 }, { x: 2, y: 2 }];

    const exit = resolveTeleportExit(exits, blocked, rng);

    expect(exit).toEqual({ x: 3, y: 3 });
  });

  it("returns null when all exits are blocked", () => {
    const rng = new DeterministicRng(7);
    const exits = [{ x: 1, y: 1 }];
    const blocked = [{ x: 1, y: 1 }];

    const exit = resolveTeleportExit(exits, blocked, rng);

    expect(exit).toBeNull();
  });
});
