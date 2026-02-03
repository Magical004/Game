import type { PowerUpType, Snake } from "../engine/types";

const PRIORITY: Record<Exclude<PowerUpType, null>, number> = {
  shield: 3,
  "slow-time": 2,
  speed: 1,
};

export const resolvePowerUpPriority = (current: PowerUpType, incoming: PowerUpType): PowerUpType => {
  if (!incoming) {
    return current;
  }
  if (!current) {
    return incoming;
  }
  return PRIORITY[incoming] > PRIORITY[current] ? incoming : current;
};

export const applyPowerUp = (
  snake: Snake,
  powerUp: PowerUpType,
  durationMs: number,
  now: number,
): Snake => {
  const resolved = resolvePowerUpPriority(snake.activePowerUp, powerUp);
  if (!resolved) {
    return snake;
  }
  if (resolved !== powerUp && snake.activePowerUp) {
    return snake;
  }
  return {
    ...snake,
    activePowerUp: powerUp,
    powerUpExpiresAt: now + durationMs,
  };
};

export const expirePowerUp = (snake: Snake, now: number): Snake => {
  if (!snake.activePowerUp || snake.powerUpExpiresAt === null) {
    return snake;
  }
  if (now < snake.powerUpExpiresAt) {
    return snake;
  }
  return { ...snake, activePowerUp: null, powerUpExpiresAt: null };
};
