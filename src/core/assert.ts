export function assert(cond: any, msg: string, extras?: unknown): asserts cond {
  if (!cond) {
    if (import.meta.env?.DEV) {
      throw new Error(msg);
    }
    console.error('ASSERT', msg, extras);
  }
}
