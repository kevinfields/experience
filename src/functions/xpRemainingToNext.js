import xpToLevel from "./xpToLevel";
import { LEVELS } from "../data/LEVELS";

export default function xpRemainingToNext(xp) {

  let currentLevel = xpToLevel(xp);

  if (LEVELS.length <= currentLevel) {
    return 0;
  }
  let nextLevelXp = LEVELS[currentLevel];
  return nextLevelXp - xp;

}