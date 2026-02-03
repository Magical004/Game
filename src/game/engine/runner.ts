import { createFixedLoop } from "./loop";
import type { MatchWinner, Snake } from "./types";
import { chooseBotDirection } from "../ai/basic-ai";
import { getDifficultySettings } from "../ai/difficulty";
import { stepSnakes } from "../rules/collision";
import { applyTimer, endMatchOnCollision, endMatchOnTimer } from "../rules/match-end";
import type { GameState } from "./state";
import type { MatchRecord } from "./types";
import { buildMatchRecord } from "../rules/match-end";

export interface RunnerCallbacks {
  onMatchEnd?: (winner: MatchWinner) => void;
  onMatchRecord?: (record: MatchRecord) => void;
  onTick?: (state: GameState) => void;
}

export interface MatchRunner {
  start: () => void;
  stop: () => void;
  enqueueDirection: (direction: Snake["direction"]) => void;
  getState: () => GameState;
}

export const createMatchRunner = (initialState: GameState, callbacks: RunnerCallbacks = {}): MatchRunner => {
  let state = { ...initialState };
  const difficultySettings = getDifficultySettings(state.match.difficulty);
  let lastBotDecisionAt = 0;

  const loop = createFixedLoop<Snake["direction"]>({
    stepMs: 1000 / 12,
    update: (dtMs, inputs) => {
      if (state.match.state === "ready") {
        state = { ...state, match: { ...state.match, state: "active", startedAt: Date.now() } };
      }
      if (state.match.state !== "active") {
        return;
      }

      const lastInput = inputs[inputs.length - 1];
      if (lastInput) {
        state = { ...state, player: { ...state.player, direction: lastInput.value } };
      }

      if (simTime - lastBotDecisionAt >= difficultySettings.reactionDelayMs) {
        const botDirection = chooseBotDirection(state.bot, state.items, difficultySettings);
        state = { ...state, bot: { ...state.bot, direction: botDirection } };
        lastBotDecisionAt = simTime;
      }

      const { player, bot, playerCollided, botCollided } = stepSnakes(
        state.player,
        state.bot,
        state.grid,
      );

      let match = applyTimer(state.match, dtMs);
      match = endMatchOnCollision(match, player.size, bot.size, playerCollided, botCollided);
      match = endMatchOnTimer(match, player.size, bot.size);

      state = { ...state, player, bot, match };
      callbacks.onTick?.(state);

      if (match.state === "ended" && match.winner) {
        callbacks.onMatchRecord?.(buildMatchRecord(match, player.size, bot.size));
        callbacks.onMatchEnd?.(match.winner);
      }
    },
  });

  const enqueueDirection = (direction: Snake["direction"]) => {
    loop.enqueueInput(direction);
  };

  return {
    start: loop.start,
    stop: loop.stop,
    enqueueDirection,
    getState: () => state,
  };
};
