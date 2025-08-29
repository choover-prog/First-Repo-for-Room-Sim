import { ZodSchema } from "zod";
export function safeParse<T>(schema: ZodSchema<T>, input: unknown) {
  const r = schema.safeParse(input);
  return { ok: r.success, data: r.success ? r.data : undefined, error: r.success ? undefined : r.error };
}
