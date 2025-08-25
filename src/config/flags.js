export const flags = {
  aiCloud: (import.meta.env.VITE_FLAG_AI_CLOUD || 'false') === 'true',
  pricePoller: (import.meta.env.VITE_FLAG_PRICE_POLLER || 'false') === 'true',
  jobsEnabled: (import.meta.env.VITE_FLAG_JOBS_ENABLED || 'false') === 'true'
};
