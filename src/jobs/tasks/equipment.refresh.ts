import { fetchEquipment, normalizeEquipment, saveEquipment } from "../../agents/equipment.agent";
export async function equipmentRefresh(){
  const rows = await fetchEquipment();
  const items = normalizeEquipment(rows);
  await saveEquipment(items);
  return "equipment.refresh";
}
