export const spinByEquipId = {};

export function setSpinForEquipment(equipId, spinSet) {
  if (!equipId || !spinSet) return;
  spinByEquipId[equipId] = spinSet;
}

export function getSpin(equipId) {
  return spinByEquipId[equipId];
}

export default {
  setSpinForEquipment,
  getSpin,
};
