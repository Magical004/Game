import type { GridCoord } from "../engine/types";
import { coordKey, DeterministicRng } from "../engine/spawn";

export const resolveTeleportExit = (
  exits: GridCoord[],
  blocked: GridCoord[],
  rng: DeterministicRng,
): GridCoord | null => {
  if (exits.length === 0) {
    return null;
  }
  const blockedSet = new Set(blocked.map(coordKey));
  const available = exits.filter((exit) => !blockedSet.has(coordKey(exit)));
  if (available.length === 0) {
    return null;
  }
  return rng.pick(available) ?? null;
};
