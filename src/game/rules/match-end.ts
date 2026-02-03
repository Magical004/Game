import type { Match, MatchRecord, MatchWinner } from "../engine/types";

export const resolveTimerWinner = (playerSize: number, botSize: number): MatchWinner => {
  if (playerSize === botSize) {
    return "draw";
  }
  return playerSize > botSize ? "player" : "bot";
};

export const resolveCollisionWinner = (
  playerSize: number,
  botSize: number,
  playerCollided: boolean,
  botCollided: boolean,
): MatchWinner => {
  if (playerCollided && botCollided) {
    return resolveTimerWinner(playerSize, botSize);
  }
  if (playerCollided) {
    return "bot";
  }
  if (botCollided) {
    return "player";
  }
  return null;
};

export const applyTimer = (match: Match, dtMs: number): Match => {
  if (match.state !== "active") {
    return match;
  }
  const remaining = Math.max(0, match.remainingSec - dtMs / 1000);
  return { ...match, remainingSec: remaining };
};

export const endMatchOnTimer = (match: Match, playerSize: number, botSize: number): Match => {
  if (match.state !== "active" || match.remainingSec > 0) {
    return match;
  }
  return {
    ...match,
    state: "ended",
    winner: resolveTimerWinner(playerSize, botSize),
    endReason: "timer",
    endedAt: Date.now(),
  };
};

export const endMatchOnCollision = (
  match: Match,
  playerSize: number,
  botSize: number,
  playerCollided: boolean,
  botCollided: boolean,
): Match => {
  if (match.state !== "active") {
    return match;
  }
  const winner = resolveCollisionWinner(playerSize, botSize, playerCollided, botCollided);
  if (!winner) {
    return match;
  }
  return {
    ...match,
    state: "ended",
    winner,
    endReason: "collision",
    endedAt: Date.now(),
  };
};

export const buildMatchRecord = (match: Match, playerSize: number, botSize: number): MatchRecord => ({
  id: `match-record-${match.id}`,
  timestamp: Date.now(),
  winner: match.winner ?? "draw",
  playerSize,
  botSize,
  difficulty: match.difficulty,
  durationSec: match.durationSec,
  themeId: match.themeId,
});
