import xpToLevel from "./xpToLevel";
import { LEVELS } from "../data/LEVELS";

export default function xpRemainingToNext(xp) {

  let currentLevel = xpToLevel(xp);
  let nextLevelXp = LEVELS[currentLevel];
  return nextLevelXp - xp;

}