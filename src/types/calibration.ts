import { z } from "zod";
export const FRPoint = z.object({ freq: z.number().positive(), db: z.number() });
export const Measurement = z.object({ name: z.string(), data: z.array(FRPoint) });
export const MeasurementSet = z.object({ channels: z.array(Measurement) });
