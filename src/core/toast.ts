export const toast = {
  info(msg: string, extras?: unknown){ console.info('toast', msg, extras); },
  warn(msg: string, extras?: unknown){ console.warn('toast', msg, extras); },
  error(msg: string, extras?: unknown){ console.error('toast', msg, extras); }
};
