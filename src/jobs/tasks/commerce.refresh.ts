import { fetchCatalog, normalizeCatalog, saveCatalog } from "../../agents/commerce.agent";
export async function commerceRefresh(){
  const rows = await fetchCatalog();
  const items = normalizeCatalog(rows);
  await saveCatalog(items);
  return "commerce.refresh";
}
