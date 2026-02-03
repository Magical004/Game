import type { Difficulty } from "../engine/types";

export interface DifficultySettings {
  reactionDelayMs: number;
  targetBias: number;
  maxMistakeChance: number;
}

const SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    reactionDelayMs: 220,
    targetBias: 0.6,
    maxMistakeChance: 0.35,
  },
  medium: {
    reactionDelayMs: 140,
    targetBias: 0.8,
    maxMistakeChance: 0.2,
  },
  hard: {
    reactionDelayMs: 80,
    targetBias: 1,
    maxMistakeChance: 0.05,
  },
};

export const getDifficultySettings = (difficulty: Difficulty): DifficultySettings => SETTINGS[difficulty];
