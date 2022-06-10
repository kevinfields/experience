import xpRemainingToNext from "./xpRemainingToNext";

export default function checkLevelUp(currentXp, gainedXp) {
  if (gainedXp >= xpRemainingToNext(currentXp)) {
    return true;
  } else {
    return false;
  }
}