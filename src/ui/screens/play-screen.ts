import type { RenderTheme } from "../../game/engine/render";
import { createRenderPipeline, renderGame } from "../../game/engine/render";
import type { GameState } from "../../game/engine/state";
import { createHud } from "../components/hud";

export interface PlayScreen {
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  update: (state: GameState, theme?: RenderTheme) => void;
}

export const createPlayScreen = (): PlayScreen => {
  const root = document.createElement("div");
  root.className = "play-screen";

  const canvas = document.createElement("canvas");
  canvas.className = "play-canvas";
  root.appendChild(canvas);

  const hud = createHud();
  root.appendChild(hud.root);

  const pipeline = createRenderPipeline(canvas);

  const update = (state: GameState, theme?: RenderTheme) => {
    pipeline.resize();
    pipeline.clear();
    pipeline.render((ctx, size) => {
      renderGame(ctx, size, state, theme);
    });
    hud.update({
      remainingSec: state.match.remainingSec,
      winner: state.match.winner,
      itemTypes: state.items.map((item) => item.type),
    });
  };

  return { root, canvas, update };
};
