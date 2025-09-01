export const toast = {
  info(msg: string, extras?: unknown){ console.info('toast', msg, extras); },
  error(msg: string, extras?: unknown){ console.error('toast', msg, extras); }
};
