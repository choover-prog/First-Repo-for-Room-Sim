import { z } from "zod";
export const CommonBase = z.object({
  id: z.string(), brand: z.string(), model: z.string(),
  series: z.string().optional(), url: z.string().url().optional(),
  verified: z.boolean().default(false), source: z.string().optional(), notes: z.string().optional()
});
export const SpeakerSpec = z.object({
  form_factor: z.enum(["tower","bookshelf","center","sub","on-wall","in-wall","in-ceiling"]),
  alignment: z.enum(["sealed","ported","passive-radiator","horn","other"]).optional(),
  nominal_impedance_ohm: z.number().optional(),
  sensitivity_db_2p83v_m: z.number().optional(),
  low_freq_f3_hz: z.number().optional()
}).partial();
export const AmplifierSpec = z.object({
  channels: z.number().int().positive(),
  power_8ohm_wpc: z.number().optional(),
  power_4ohm_wpc: z.number().optional(),
  dsp: z.boolean().default(false)
}).partial();
export const Speaker = CommonBase.extend({ kind: z.literal("speaker"), spec: SpeakerSpec });
export const Amplifier = CommonBase.extend({ kind: z.literal("amplifier"), spec: AmplifierSpec });
export const AnyEquipment = z.discriminatedUnion("kind", [Speaker, Amplifier]);
export type AnyEquipment = z.infer<typeof AnyEquipment>;
