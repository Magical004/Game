export interface HudState {
  remainingSec: number;
  winner?: string | null;
  itemTypes?: ("food" | "poison" | "powerup")[];
}

export interface Hud {
  root: HTMLElement;
  update: (state: HudState) => void;
}

export const createHud = (): Hud => {
  const root = document.createElement("div");
  root.className = "hud";

  const timer = document.createElement("div");
  timer.className = "hud-timer";
  root.appendChild(timer);

  const cues = document.createElement("div");
  cues.className = "hud-cues";
  root.appendChild(cues);

  const winner = document.createElement("div");
  winner.className = "hud-winner";
  root.appendChild(winner);

  const update = (state: HudState) => {
    timer.textContent = `Time: ${Math.ceil(state.remainingSec)}`;
    const types = state.itemTypes ?? [];
    cues.textContent = types.length > 0 ? `Items: ${types.join(", ")}` : "";
    winner.textContent = state.winner ? `Winner: ${state.winner}` : "";
  };

  return { root, update };
};
