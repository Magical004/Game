import { describe, expect, it } from "vitest";

import { createInputBuffer } from "../../../src/game/engine/loop";

describe("input latency harness", () => {
  it("drains inputs in timestamp order", () => {
    const buffer = createInputBuffer<string>(10);
    buffer.enqueue("left", 10);
    buffer.enqueue("right", 5);
    buffer.enqueue("up", 8);

    const drained = buffer.drain(10).map((event) => event.value);
    expect(drained).toEqual(["right", "up", "left"]);
  });
});
