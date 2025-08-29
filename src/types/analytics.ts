import { z } from "zod";
export const AnalyticEvent = z.object({ type: z.string(), ts: z.number(), payload: z.record(z.any()) });
