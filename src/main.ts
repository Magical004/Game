import { createMatchRunner } from "./game/engine/runner";
import { createMatchState } from "./game/engine/state";
import { createMainMenu } from "./ui/screens/main-menu";
import { createPlayScreen } from "./ui/screens/play-screen";
import { createCustomizeScreen } from "./ui/screens/customize-screen";
import { createReplayabilityScreen } from "./ui/screens/replayability-screen";
import { createStorage } from "./storage/storage";
import { applyPreferencesUpdate, DEFAULT_PREFERENCES, validatePreferences } from "./storage/preferences";
import { createAudioManager } from "./audio/audio-manager";
import { createLocalApi } from "./storage/local-api";
import { THEMES, getThemeById, toRenderTheme } from "./styles/themes";

const root = document.getElementById("app") ?? document.body;

const storage = createStorage({ key: "snake-duel", version: 1, historyCap: 10 });
const defaults = { preferences: DEFAULT_PREFERENCES, history: [], highScores: [] };
const api = createLocalApi(storage, defaults, THEMES, 10);
let preferences = validatePreferences(api.getSettings());
const audio = createAudioManager(preferences.audioEnabled, preferences.musicEnabled);

const mainMenu = createMainMenu();
const customize = createCustomizeScreen();
const replayability = createReplayabilityScreen();

const renderHome = () => {
  root.innerHTML = "";
  root.appendChild(mainMenu.root);
  root.appendChild(customize.root);
  customize.setPreferences(preferences);
};

const savePreferences = (next: typeof preferences) => {
  preferences = next;
  api.updateSettings(preferences);
  audio.setAudioEnabled(preferences.audioEnabled);
  audio.setMusicEnabled(preferences.musicEnabled);
};

customize.onColorChange((color) => {
  savePreferences(applyPreferencesUpdate(preferences, { snakeColor: color }));
});

mainMenu.onStart(() => {
  const playScreen = createPlayScreen();
  const arenaTheme = getThemeById(preferences.themeId);
  const theme = toRenderTheme(arenaTheme, preferences.snakeColor);
  const matchState = createMatchState({
    difficulty: preferences.difficulty,
    themeId: preferences.themeId,
  });
  const runner = createMatchRunner(matchState, {
    onTick: (state) => playScreen.update(state, theme),
    onMatchRecord: (record) => {
      api.recordMatch(record);
    },
  });

  root.innerHTML = "";
  root.appendChild(playScreen.root);
  playScreen.update(matchState, theme);
  runner.start();
});

mainMenu.onHistory(() => {
  root.innerHTML = "";
  root.appendChild(replayability.root);
  replayability.setPreferences(preferences, THEMES);
  replayability.setHistory(api.getMatchHistory());

  replayability.onDifficultyChange((difficulty) => {
    savePreferences(applyPreferencesUpdate(preferences, { difficulty }));
  });
  replayability.onThemeChange((themeId) => {
    savePreferences(applyPreferencesUpdate(preferences, { themeId }));
  });
  replayability.onAudioToggle((enabled) => {
    savePreferences(applyPreferencesUpdate(preferences, { audioEnabled: enabled }));
  });
  replayability.onMusicToggle((enabled) => {
    savePreferences(applyPreferencesUpdate(preferences, { musicEnabled: enabled }));
  });
  replayability.onBack(() => renderHome());
});

renderHome();
