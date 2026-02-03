export interface MainMenu {
  root: HTMLElement;
  onStart: (handler: () => void) => void;
  onHistory: (handler: () => void) => void;
}

export const createMainMenu = (): MainMenu => {
  const root = document.createElement("div");
  root.className = "main-menu";

  const title = document.createElement("h1");
  title.textContent = "Snake Duel";
  root.appendChild(title);

  const startButton = document.createElement("button");
  startButton.type = "button";
  startButton.textContent = "Start Round";
  startButton.dataset.action = "start";
  root.appendChild(startButton);

  const historyButton = document.createElement("button");
  historyButton.type = "button";
  historyButton.textContent = "History";
  historyButton.dataset.action = "history";
  root.appendChild(historyButton);

  const onStart = (handler: () => void) => {
    startButton.addEventListener("click", handler);
  };

  const onHistory = (handler: () => void) => {
    historyButton.addEventListener("click", handler);
  };

  return { root, onStart, onHistory };
};
