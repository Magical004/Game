import type { Difficulty, PlayerPreferences } from "../game/engine/types";

const DEFAULT_COLOR = "#5fd38d";
const DEFAULT_THEME = "default";
const DEFAULT_DIFFICULTY: Difficulty = "medium";

export const DEFAULT_PREFERENCES: PlayerPreferences = {
  id: "local-preferences",
  snakeColor: DEFAULT_COLOR,
  difficulty: DEFAULT_DIFFICULTY,
  themeId: DEFAULT_THEME,
  audioEnabled: true,
  musicEnabled: true,
};

const isHexColor = (value: string) => /^#?[0-9a-fA-F]{6}$/.test(value);

const normalizeHex = (value: string) => (value.startsWith("#") ? value : `#${value}`);

const sanitizeColor = (value: unknown) => {
  if (typeof value !== "string") {
    return DEFAULT_COLOR;
  }
  if (!isHexColor(value)) {
    return DEFAULT_COLOR;
  }
  return normalizeHex(value);
};

const sanitizeDifficulty = (value: unknown): Difficulty => {
  if (value === "easy" || value === "medium" || value === "hard") {
    return value;
  }
  return DEFAULT_DIFFICULTY;
};

const sanitizeBoolean = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

const sanitizeTheme = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0 ? value : DEFAULT_THEME;

export const validatePreferences = (prefs: Partial<PlayerPreferences>): PlayerPreferences => ({
  id: typeof prefs.id === "string" && prefs.id.length > 0 ? prefs.id : DEFAULT_PREFERENCES.id,
  snakeColor: sanitizeColor(prefs.snakeColor),
  difficulty: sanitizeDifficulty(prefs.difficulty),
  themeId: sanitizeTheme(prefs.themeId),
  audioEnabled: sanitizeBoolean(prefs.audioEnabled, DEFAULT_PREFERENCES.audioEnabled),
  musicEnabled: sanitizeBoolean(prefs.musicEnabled, DEFAULT_PREFERENCES.musicEnabled),
});

export const applyPreferencesUpdate = (
  current: PlayerPreferences,
  update: Partial<PlayerPreferences>,
): PlayerPreferences => validatePreferences({ ...current, ...update, id: current.id });
