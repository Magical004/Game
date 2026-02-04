import { createFixedLoop } from "./loop";
import type { MatchWinner, Snake } from "./types";
import { chooseBotDirection } from "../ai/basic-ai";
import { getDifficultySettings } from "../ai/difficulty";
import { stepSnakes } from "../rules/collision";
import { applyTimer, endMatchOnCollision, endMatchOnTimer } from "../rules/match-end";
import type { GameState } from "./state";
import type { MatchRecord } from "./types";
import { buildMatchRecord } from "../rules/match-end";
import { createRng, coordKey } from "./spawn";
import { spawnItem, applyItemToSnake } from "../items/items";
import { expirePowerUp } from "../items/powerups";

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
  const rng = createRng(state.rngSeed);
  const difficultySettings = getDifficultySettings(state.match.difficulty);
  let lastBotDecisionAt = 0;
  let lastItemSpawnAt = 0;
  let tickCount = 0;

  const loop = createFixedLoop<Snake["direction"]>({
    stepMs: 1000 / 8,
    update: (dtMs, inputs, simTime) => {
      tickCount++;
      if (tickCount === 1) {
        console.log("First game tick - starting match");
      }
      if (state.match.state === "ready") {
        state = { ...state, match: { ...state.match, state: "active", startedAt: Date.now() } };
        lastItemSpawnAt = simTime;
        console.log("Match transitioned to active state, simTime:", simTime);
      }
      if (state.match.state !== "active") {
        return;
      }

      const lastInput = inputs[inputs.length - 1];
      if (lastInput) {
        const currentDir = state.player.direction;
        const newDir = lastInput.value;
        const oppositeDirs: Record<Snake["direction"], Snake["direction"]> = {
          up: "down",
          down: "up",
          left: "right",
          right: "left",
        };
        if (oppositeDirs[currentDir] !== newDir) {
          state = { ...state, player: { ...state.player, direction: newDir } };
        }
      }

      if (simTime - lastBotDecisionAt >= difficultySettings.reactionDelayMs) {
        const botDirection = chooseBotDirection(
          state.bot,
          state.items,
          difficultySettings,
          state.grid.width,
          state.grid.height,
          state.player.segments,
        );
        state = { ...state, bot: { ...state.bot, direction: botDirection } };
        lastBotDecisionAt = simTime;
      }

      let { player, bot, playerCollided, botCollided } = stepSnakes(
        state.player,
        state.bot,
        state.grid,
      );

      let items = state.items.filter((item) => {
        if (item.type === "powerup" && item.expiresAt && simTime > item.expiresAt) {
          return false;
        }
        return true;
      });

      const playerHeadKey = coordKey(player.segments[0]);
      const botHeadKey = coordKey(bot.segments[0]);

      items.forEach((item) => {
        const itemKey = coordKey(item.position);
        if (itemKey === playerHeadKey) {
          player = applyItemToSnake(player, item);
        } else if (itemKey === botHeadKey) {
          bot = applyItemToSnake(bot, item);
        }
      });

      items = items.filter((item) => {
        const itemKey = coordKey(item.position);
        if (itemKey === playerHeadKey) {
          return false;
        }
        if (itemKey === botHeadKey) {
          return false;
        }
        return true;
      });

      player = expirePowerUp(player, Date.now());
      bot = expirePowerUp(bot, Date.now());

      if (simTime - lastItemSpawnAt >= 2000) {
        const blocked = [...player.segments, ...bot.segments, ...items.map((i) => i.position)];
        const spawnRoll = rng.nextFloat();
        if (spawnRoll < 0.7) {
          const food = spawnItem(rng, state.grid, blocked, "food");
          if (food) items.push(food);
        } else if (spawnRoll < 0.85) {
          const poison = spawnItem(rng, state.grid, blocked, "poison");
          if (poison) items.push(poison);
        } else {
          const powerup = spawnItem(rng, state.grid, blocked, "powerup");
          if (powerup) items.push(powerup);
        }
        lastItemSpawnAt = simTime;
      }

      let match = applyTimer(state.match, dtMs);
      match = endMatchOnCollision(match, player.size, bot.size, playerCollided, botCollided);
      match = endMatchOnTimer(match, player.size, bot.size);

      state = { ...state, player, bot, match, items };
      
      if (tickCount % 12 === 0) {
        console.log("Tick", tickCount, "- Player:", player.segments[0], "Bot:", bot.segments[0], "Items:", items.length, "Time:", match.remainingSec);
      }
      
      callbacks.onTick?.(state);

      if (match.state === "ended" && match.winner) {
        console.log("Match ended, winner:", match.winner);
        callbacks.onMatchRecord?.(buildMatchRecord(match, player.size, bot.size));
        callbacks.onMatchEnd?.(match.winner);
      }
    },
  });

  const enqueueDirection = (direction: Snake["direction"]) => {
    console.log("Enqueueing direction:", direction);
    loop.enqueueInput(direction);
  };

  return {
    start: () => {
      console.log("Starting match runner");
      loop.start();
      setTimeout(() => {
        console.log("Loop running:", loop.isRunning(), "Buffer size:", loop.getBufferSize());
      }, 100);
    },
    stop: loop.stop,
    enqueueDirection,
    getState: () => state,
  };
};
