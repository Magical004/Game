import { beforeEach, describe, expect, it } from "vitest";

import { createStorage } from "../../src/storage/storage";
import { applyPreferencesUpdate, DEFAULT_PREFERENCES, validatePreferences } from "../../src/storage/preferences";

const storageKey = "snake-duel-test-preferences";

describe("preferences", () => {
  beforeEach(() => {
    window.localStorage.removeItem(storageKey);
  });

  it("validates defaults for invalid input", () => {
    const validated = validatePreferences({
      snakeColor: "not-a-color",
      difficulty: "impossible" as never,
      themeId: "",
      audioEnabled: "yes" as never,
      musicEnabled: 1 as never,
    });

    expect(validated.snakeColor).toBe(DEFAULT_PREFERENCES.snakeColor);
    expect(validated.difficulty).toBe(DEFAULT_PREFERENCES.difficulty);
    expect(validated.themeId).toBe(DEFAULT_PREFERENCES.themeId);
    expect(validated.audioEnabled).toBe(DEFAULT_PREFERENCES.audioEnabled);
    expect(validated.musicEnabled).toBe(DEFAULT_PREFERENCES.musicEnabled);
  });

  it("persists updated preferences", () => {
    const storage = createStorage({ key: storageKey, version: 1, historyCap: 10 });
    const defaults = { preferences: DEFAULT_PREFERENCES, history: [], highScores: [] };

    const updated = applyPreferencesUpdate(DEFAULT_PREFERENCES, { snakeColor: "#ff0000" });
    storage.save({ ...defaults, preferences: updated });

    const loaded = storage.load(defaults);
    expect(loaded.preferences.snakeColor).toBe("#ff0000");
  });
});
