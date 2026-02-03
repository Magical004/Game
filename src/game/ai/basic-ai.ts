import type { GridCoord, Item, Snake } from "../engine/types";
import type { DifficultySettings } from "./difficulty";

const distance = (a: GridCoord, b: GridCoord) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const directionFromDelta = (dx: number, dy: number): Snake["direction"] => {
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? "right" : "left";
  }
  return dy >= 0 ? "down" : "up";
};

export const chooseBotDirection = (
  bot: Snake,
  items: Item[],
  settings?: DifficultySettings,
): Snake["direction"] => {
  const head = bot.segments[0];
  const foodTargets = items.filter((item) => item.type === "food");
  if (foodTargets.length === 0) {
    return bot.direction;
  }
  const nearest = foodTargets.reduce((closest, current) =>
    distance(head, current.position) < distance(head, closest.position) ? current : closest,
  );
  const dx = nearest.position.x - head.x;
  const dy = nearest.position.y - head.y;
  const preferred = directionFromDelta(dx, dy);
  if (!settings) {
    return preferred;
  }
  if (Math.random() < settings.maxMistakeChance) {
    return bot.direction;
  }
  return preferred;
};
