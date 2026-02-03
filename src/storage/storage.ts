import type { HighScoreEntry, MatchRecord, PlayerPreferences } from "../game/engine/types";

export interface StorageData {
  preferences: PlayerPreferences;
  history: MatchRecord[];
  highScores: HighScoreEntry[];
}

export interface StorageBlob {
  version: number;
  data: StorageData;
}

export interface StorageAdapter {
  load: (defaults: StorageData) => StorageData;
  save: (data: StorageData) => void;
  clear: () => void;
}

export interface StorageOptions {
  key: string;
  version: number;
  historyCap?: number;
}

const getLocalStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage ?? null;
};

const normalizeHistory = (history: MatchRecord[], cap: number) => {
  if (history.length <= cap) {
    return history;
  }
  return history.slice(history.length - cap);
};

export const createStorage = ({ key, version, historyCap = 10 }: StorageOptions): StorageAdapter => {
  const load = (defaults: StorageData) => {
    const storage = getLocalStorage();
    if (!storage) {
      return { ...defaults, history: normalizeHistory(defaults.history, historyCap) };
    }
    try {
      const raw = storage.getItem(key);
      if (!raw) {
        return { ...defaults, history: normalizeHistory(defaults.history, historyCap) };
      }
      const parsed = JSON.parse(raw) as StorageBlob;
      if (!parsed || parsed.version !== version || !parsed.data) {
        return { ...defaults, history: normalizeHistory(defaults.history, historyCap) };
      }
      const history = Array.isArray(parsed.data.history) ? parsed.data.history : [];
      return {
        preferences: parsed.data.preferences ?? defaults.preferences,
        history: normalizeHistory(history, historyCap),
        highScores: Array.isArray(parsed.data.highScores) ? parsed.data.highScores : [],
      };
    } catch {
      return { ...defaults, history: normalizeHistory(defaults.history, historyCap) };
    }
  };

  const save = (data: StorageData) => {
    const storage = getLocalStorage();
    if (!storage) {
      return;
    }
    const blob: StorageBlob = {
      version,
      data: {
        ...data,
        history: normalizeHistory(data.history, historyCap),
      },
    };
    storage.setItem(key, JSON.stringify(blob));
  };

  const clear = () => {
    const storage = getLocalStorage();
    if (!storage) {
      return;
    }
    storage.removeItem(key);
  };

  return { load, save, clear };
};
