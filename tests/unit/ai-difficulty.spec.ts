import { describe, expect, it } from "vitest";

import { getDifficultySettings } from "../../src/game/ai/difficulty";

describe("AI difficulty settings", () => {
  it("hard reacts faster than easy", () => {
    const easy = getDifficultySettings("easy");
    const hard = getDifficultySettings("hard");
    expect(hard.reactionDelayMs).toBeLessThan(easy.reactionDelayMs);
  });

  it("hard has fewer mistakes than easy", () => {
    const easy = getDifficultySettings("easy");
    const hard = getDifficultySettings("hard");
    expect(hard.maxMistakeChance).toBeLessThan(easy.maxMistakeChance);
  });
});
