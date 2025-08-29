const store = new Map();

export function setSpinForEquipment(equipId, spinSet) {
  if (!equipId || !spinSet) return;
  store.set(equipId, spinSet);
}

export function getSpin(equipId) {
  return store.get(equipId);
}

export default {
  setSpinForEquipment,
  getSpin
};
