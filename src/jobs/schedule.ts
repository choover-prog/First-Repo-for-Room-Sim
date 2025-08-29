import { equipmentRefresh } from "./tasks/equipment.refresh";
import { spinoramaRefresh } from "./tasks/spinorama.refresh";
import { commerceRefresh } from "./tasks/commerce.refresh";
import { analyticsRollup } from "./tasks/analytics.rollup";
import { flags } from "../config/flags";
export type Job = { name: string; task: () => Promise<string> };
export const schedule: Job[] = [
  flags.agentEquipment && { name: "equipment.refresh", task: equipmentRefresh },
  flags.agentSpinorama && { name: "spinorama.refresh", task: spinoramaRefresh },
  flags.agentCommerce && { name: "commerce.refresh", task: commerceRefresh },
  flags.agentAnalytics && { name: "analytics.rollup", task: analyticsRollup }
].filter(Boolean) as Job[];
