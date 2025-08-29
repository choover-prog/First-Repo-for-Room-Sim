import { z } from 'zod';

export const SpinCSVRow = z.object({
  freq_hz: z.number().positive(),
  on_axis_db: z.number(),
  listening_window_db: z.number().optional(),
  early_reflections_db: z.number().optional(),
  sound_power_db: z.number().optional(),
  di_listening_window_db: z.number().optional(),
  di_sound_power_db: z.number().optional()
});

export const SpinSet = z.object({
  id: z.string(),
  equip_id: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  rows: z.array(SpinCSVRow).min(64),
  confidence_0_1: z.number().min(0).max(1),
  source: z.string().optional(),
  verified: z.boolean().default(false)
});

export default {
  SpinCSVRow,
  SpinSet
};
