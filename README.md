# Media-Room-Cal-Sim

Phase-4 adds autonomous loops for marketing, sales, support, calibration and finance.

## Environment
Copy `.env.example` to `.env` and fill in keys for:

- OpenAI
- Amazon PA-API
- Stripe
- QuickBooks

Feature flags:

- `VITE_FLAG_AI_CLOUD`
- `VITE_FLAG_PRICE_POLLER`
- `VITE_FLAG_JOBS_ENABLED`

## Admin Dashboard

Run `npm run dev` and visit `/admin?admin=1` for metrics and job status. Ledger exports are available from this panel.

## Development

`npm run dev` – start viewer

`npm run build` – build for production
