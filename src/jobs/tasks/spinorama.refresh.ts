import { fetchSpinorama, normalizeSpinorama, saveSpinorama } from "../../agents/spinorama.agent";
export async function spinoramaRefresh(){
  const rows = await fetchSpinorama();
  const items = normalizeSpinorama(rows);
  await saveSpinorama(items);
  return "spinorama.refresh";
}
