import type {
  ArenaTheme,
  HighScoreEntry,
  MatchRecord,
  PlayerPreferences,
} from "../game/engine/types";
import type { StorageAdapter, StorageData } from "./storage";
import { addHighScore, addMatchRecord } from "./history";
import { validatePreferences } from "./preferences";

export interface LocalApi {
  getSettings: () => PlayerPreferences;
  updateSettings: (prefs: PlayerPreferences) => PlayerPreferences;
  listThemes: () => ArenaTheme[];
  getMatchHistory: (limit?: number) => MatchRecord[];
  recordMatch: (record: MatchRecord) => MatchRecord;
  getHighScores: () => HighScoreEntry[];
  recordHighScore: (entry: HighScoreEntry) => HighScoreEntry;
}

export const createLocalApi = (
  storage: StorageAdapter,
  defaults: StorageData,
  themes: ArenaTheme[],
  historyCap = 10,
): LocalApi => {
  const load = () => storage.load(defaults);
  const save = (data: StorageData) => storage.save(data);

  const getSettings = () => validatePreferences(load().preferences);

  const updateSettings = (prefs: PlayerPreferences) => {
    const data = load();
    const next = validatePreferences(prefs);
    save({ ...data, preferences: next });
    return next;
  };

  const listThemes = () => themes;

  const getMatchHistory = (limit = historyCap) => load().history.slice(-limit);

  const recordMatch = (record: MatchRecord) => {
    const data = load();
    const history = addMatchRecord(data.history, record, historyCap);
    save({ ...data, history });
    return record;
  };

  const getHighScores = () => load().highScores;

  const recordHighScore = (entry: HighScoreEntry) => {
    const data = load();
    const highScores = addHighScore(data.highScores, entry, historyCap);
    save({ ...data, highScores });
    return entry;
  };

  return {
    getSettings,
    updateSettings,
    listThemes,
    getMatchHistory,
    recordMatch,
    getHighScores,
    recordHighScore,
  };
};
