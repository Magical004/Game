import type { ArenaTheme, Difficulty, MatchRecord, PlayerPreferences } from "../../game/engine/types";

export interface ReplayabilityScreen {
  root: HTMLElement;
  setPreferences: (prefs: PlayerPreferences, themes: ArenaTheme[]) => void;
  setHistory: (history: MatchRecord[]) => void;
  onDifficultyChange: (handler: (difficulty: Difficulty) => void) => void;
  onThemeChange: (handler: (themeId: string) => void) => void;
  onAudioToggle: (handler: (enabled: boolean) => void) => void;
  onMusicToggle: (handler: (enabled: boolean) => void) => void;
  onBack: (handler: () => void) => void;
}

export const createReplayabilityScreen = (): ReplayabilityScreen => {
  const root = document.createElement("div");
  root.className = "replayability-screen";

  const title = document.createElement("h2");
  title.textContent = "Replayability";
  root.appendChild(title);

  const difficultyLabel = document.createElement("label");
  difficultyLabel.textContent = "Difficulty";
  const difficultySelect = document.createElement("select");
  ["easy", "medium", "hard"].forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    difficultySelect.appendChild(option);
  });
  difficultyLabel.appendChild(difficultySelect);
  root.appendChild(difficultyLabel);

  const themeLabel = document.createElement("label");
  themeLabel.textContent = "Arena Theme";
  const themeSelect = document.createElement("select");
  themeLabel.appendChild(themeSelect);
  root.appendChild(themeLabel);

  const audioLabel = document.createElement("label");
  audioLabel.textContent = "Audio";
  const audioToggle = document.createElement("input");
  audioToggle.type = "checkbox";
  audioLabel.appendChild(audioToggle);
  root.appendChild(audioLabel);

  const musicLabel = document.createElement("label");
  musicLabel.textContent = "Music";
  const musicToggle = document.createElement("input");
  musicToggle.type = "checkbox";
  musicLabel.appendChild(musicToggle);
  root.appendChild(musicLabel);

  const historyTitle = document.createElement("h3");
  historyTitle.textContent = "Recent Matches";
  root.appendChild(historyTitle);

  const historyList = document.createElement("ul");
  historyList.className = "history-list";
  root.appendChild(historyList);

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.textContent = "Back";
  root.appendChild(backButton);

  const setPreferences = (prefs: PlayerPreferences, themes: ArenaTheme[]) => {
    difficultySelect.value = prefs.difficulty;
    themeSelect.innerHTML = "";
    themes.forEach((theme) => {
      const option = document.createElement("option");
      option.value = theme.id;
      option.textContent = theme.name;
      themeSelect.appendChild(option);
    });
    themeSelect.value = prefs.themeId;
    audioToggle.checked = prefs.audioEnabled;
    musicToggle.checked = prefs.musicEnabled;
  };

  const setHistory = (history: MatchRecord[]) => {
    historyList.innerHTML = "";
    history.forEach((record) => {
      const li = document.createElement("li");
      li.textContent = `${record.winner} • ${record.difficulty} • ${record.playerSize}-${record.botSize}`;
      historyList.appendChild(li);
    });
  };

  const onDifficultyChange = (handler: (difficulty: Difficulty) => void) => {
    difficultySelect.addEventListener("change", () => handler(difficultySelect.value as Difficulty));
  };

  const onThemeChange = (handler: (themeId: string) => void) => {
    themeSelect.addEventListener("change", () => handler(themeSelect.value));
  };

  const onAudioToggle = (handler: (enabled: boolean) => void) => {
    audioToggle.addEventListener("change", () => handler(audioToggle.checked));
  };

  const onMusicToggle = (handler: (enabled: boolean) => void) => {
    musicToggle.addEventListener("change", () => handler(musicToggle.checked));
  };

  const onBack = (handler: () => void) => {
    backButton.addEventListener("click", handler);
  };

  return {
    root,
    setPreferences,
    setHistory,
    onDifficultyChange,
    onThemeChange,
    onAudioToggle,
    onMusicToggle,
    onBack,
  };
};
