import { z } from "zod";
export const CatalogItem = z.object({
  sku: z.string(), brand: z.string(), model: z.string(), category: z.string(),
  price_usd: z.number().nonnegative().optional(),
  affiliate: z.record(z.string()).optional(),
  fulfillment: z.enum(["affiliate","local","distributor"]).optional(),
  prime: z.boolean().optional(), stocked: z.boolean().optional(),
  lead_time_days: z.number().int().nonnegative().optional(),
  lead_time_min_days: z.number().int().nonnegative().optional(),
  lead_time_max_days: z.number().int().nonnegative().optional(),
  special_order: z.boolean().optional()
});
export type CatalogItem = z.infer<typeof CatalogItem>;
