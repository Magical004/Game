import type { ArenaTheme } from "../game/engine/types";
import type { RenderTheme } from "../game/engine/render";

export const THEMES: ArenaTheme[] = [
  {
    id: "default",
    name: "Neon Grid",
    backgroundStyle: "radial-gradient(circle at top, #18242a, #0b1317)",
    accentColor: "#5fd38d",
  },
  {
    id: "sunset",
    name: "Dusty Sunset",
    backgroundStyle: "linear-gradient(160deg, #2b1b1f, #7a3b2e)",
    accentColor: "#f7d154",
  },
  {
    id: "deepsea",
    name: "Deep Sea",
    backgroundStyle: "linear-gradient(180deg, #0a1c2f, #06131f)",
    accentColor: "#6ea8ff",
  },
];

export const getThemeById = (id: string) => THEMES.find((theme) => theme.id === id) ?? THEMES[0];

export const toRenderTheme = (theme: ArenaTheme, playerColor: string): RenderTheme => ({
  background:
    theme.id === "sunset" ? "#241417" : theme.id === "deepsea" ? "#081421" : "#0e1a1f",
  player: playerColor,
  bot: "#ff9f68",
  food: "#f7d154",
  poison: "#ff6b6b",
  powerup: "#6ea8ff",
  hud: theme.accentColor,
});
