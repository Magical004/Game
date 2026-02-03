import { beforeEach, describe, expect, it } from "vitest";

import type { MatchRecord } from "../../src/game/engine/types";
import { createLocalApi } from "../../src/storage/local-api";
import { createStorage } from "../../src/storage/storage";
import { DEFAULT_PREFERENCES } from "../../src/storage/preferences";
import { THEMES } from "../../src/styles/themes";

const storageKey = "snake-duel-test-api";

const record: MatchRecord = {
  id: "record-1",
  timestamp: 1000,
  winner: "player",
  playerSize: 5,
  botSize: 3,
  difficulty: "medium",
  durationSec: 30,
  themeId: "default",
};

describe("local api contracts", () => {
  beforeEach(() => {
    window.localStorage.removeItem(storageKey);
  });

  it("round-trips settings and history", () => {
    const storage = createStorage({ key: storageKey, version: 1, historyCap: 10 });
    const defaults = { preferences: DEFAULT_PREFERENCES, history: [], highScores: [] };
    const api = createLocalApi(storage, defaults, THEMES, 10);

    const settings = api.getSettings();
    expect(settings.snakeColor).toBe(DEFAULT_PREFERENCES.snakeColor);

    api.recordMatch(record);
    expect(api.getMatchHistory()).toHaveLength(1);

    const updated = api.updateSettings({ ...settings, themeId: "sunset" });
    expect(updated.themeId).toBe("sunset");
  });
});
