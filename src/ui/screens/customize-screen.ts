import type { PlayerPreferences } from "../../game/engine/types";

export interface CustomizeScreen {
  root: HTMLElement;
  onColorChange: (handler: (color: string) => void) => void;
  setPreferences: (prefs: PlayerPreferences) => void;
}

export const createCustomizeScreen = (): CustomizeScreen => {
  const root = document.createElement("div");
  root.className = "customize-screen";

  const title = document.createElement("h2");
  title.textContent = "Customize";
  root.appendChild(title);

  const label = document.createElement("label");
  label.textContent = "Snake Color";
  root.appendChild(label);

  const input = document.createElement("input");
  input.type = "color";
  input.name = "snake-color";
  label.appendChild(input);

  const preview = document.createElement("div");
  preview.className = "color-preview";
  root.appendChild(preview);

  const onColorChange = (handler: (color: string) => void) => {
    input.addEventListener("input", () => {
      preview.style.background = input.value;
      handler(input.value);
    });
  };

  const setPreferences = (prefs: PlayerPreferences) => {
    input.value = prefs.snakeColor;
    preview.style.background = prefs.snakeColor;
  };

  return { root, onColorChange, setPreferences };
};
