import { describe, expect, it } from "vitest";

import type { MatchRecord } from "../../src/game/engine/types";
import type { HighScoreEntry } from "../../src/game/engine/types";
import { addHighScore, addMatchRecord } from "../../src/storage/history";

const makeRecord = (id: number): MatchRecord => ({
  id: `record-${id}`,
  timestamp: id,
  winner: "player",
  playerSize: 5,
  botSize: 3,
  difficulty: "medium",
  durationSec: 30,
  themeId: "default",
});

describe("match history storage", () => {
  it("caps history to last 10 records", () => {
    let history: MatchRecord[] = [];
    for (let i = 1; i <= 12; i += 1) {
      history = addMatchRecord(history, makeRecord(i), 10);
    }

    expect(history).toHaveLength(10);
    expect(history[0].id).toBe("record-3");
    expect(history[9].id).toBe("record-12");
  });

  it("caps high scores to top 10", () => {
    let scores: HighScoreEntry[] = [];
    for (let i = 1; i <= 12; i += 1) {
      scores = addHighScore(
        scores,
        { id: `score-${i}`, score: i, difficulty: "easy", timestamp: i },
        10,
      );
    }

    expect(scores).toHaveLength(10);
    expect(scores[0].score).toBe(12);
    expect(scores[9].score).toBe(3);
  });
});
