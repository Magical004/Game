import { describe, expect, it } from "vitest";

import { createFixedLoop } from "../../../src/game/engine/loop";

describe("frame time and allocation guard", () => {
  it("does not overrun fixed-step updates on long frames", () => {
    let updates = 0;
    const loop = createFixedLoop({
      stepMs: 16,
      maxFrameMs: 32,
      now: () => 0,
      requestFrame: (cb) => {
        cb(100);
        return 1;
      },
      cancelFrame: () => undefined,
      update: () => {
        updates += 1;
      },
    });

    loop.start();
    expect(updates).toBeGreaterThan(0);
    expect(updates).toBeLessThanOrEqual(2);
  });
});
