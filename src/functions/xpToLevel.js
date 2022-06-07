/* TABLE
  starting with a 0-10 jump, the next jump can be calculated as 1.5x the last jump rounded up
  1: 0,
  2: 10,
  3: 25,
  4: 48,
  5: 82,
  6: 132,
  7: 208,
  8: 322,
  9: 493,
  10: 750,
  11: 1007,
  12: 1393,
  13: 1972,
  14: 2841,
  15: 4145,
  16: 6101,
  17: 9035,
  18: 13436,
  19: 20038,
  20: 29942 (30000 seems better)
*/
export default function xpToLevel(xp) {

  const levels = [0, 10, 25, 48, 82, 132, 208, 322, 493, 750, 1007, 1393, 1972, 2841, 4145, 6101, 9035, 13436, 20038, 30000];

  if (levels.includes(xp)) {
    return levels.indexOf(xp) + 1;
  }

  levels.push(xp);

  const sortedLevels = levels.sort((a, b) => a - b);
  
  return sortedLevels.indexOf(xp);
  
}