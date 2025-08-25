export function requiredWattsToHitSPL(targetDb, sensitivityDb, distanceMeters, speakers = 1) {
  const distanceLoss = 20 * Math.log10(distanceMeters);
  const neededGain = targetDb - sensitivityDb + distanceLoss;
  return Math.pow(10, neededGain / 10) / speakers;
}

export function headroomDb(availableWatts, requiredWatts) {
  if (!availableWatts || !requiredWatts) return 0;
  return 10 * Math.log10(availableWatts / requiredWatts);
}
