import { z } from "zod";
export const SpinCSVRow = z.object({
  freq_hz: z.number().positive(),
  on_axis_db: z.number(),
  listening_window_db: z.number().optional(),
  early_reflections_db: z.number().optional(),
  sound_power_db: z.number().optional(),
  di_listening_window_db: z.number().optional(),
  di_sound_power_db: z.number().optional()
});
export const Spinorama = z.object({
  id: z.string(), rows: z.array(SpinCSVRow), confidence_0_1: z.number().min(0).max(1)
});
export type Spinorama = z.infer<typeof Spinorama>;
