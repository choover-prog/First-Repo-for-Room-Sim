import { fetchAnalytics, normalizeAnalytics, saveAnalytics } from "../../agents/analytics.agent";
export async function analyticsRollup(){
  const rows = await fetchAnalytics();
  const items = normalizeAnalytics(rows);
  await saveAnalytics(items);
  return "analytics.rollup";
}
