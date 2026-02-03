import type { HighScoreEntry, MatchRecord } from "../game/engine/types";

export const addMatchRecord = (
  history: MatchRecord[],
  record: MatchRecord,
  cap = 10,
): MatchRecord[] => {
  const next = [...history, record];
  if (next.length <= cap) {
    return next;
  }
  return next.slice(next.length - cap);
};

export const addHighScore = (
  scores: HighScoreEntry[],
  entry: HighScoreEntry,
  cap = 10,
): HighScoreEntry[] => {
  const next = [...scores, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, cap);
  return next;
};
