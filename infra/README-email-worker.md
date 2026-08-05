# Cloudflare Email Worker (inbound → API)

This folder contains the **ahmadcodes-email** worker script and Wrangler config used with [Cloudflare Email Routing → Email Workers](https://developers.cloudflare.com/email-routing/email-workers/).

The worker parses inbound mail with [`postal-mime`](https://www.npmjs.com/package/postal-mime), POSTs JSON to `POST /mail/inbound` on your API, and **forwards** a copy to Gmail (or any address) so you keep a mailbox backup until you trust the CMS inbox.

## Prerequisites

- Cloudflare account with **ahmadcodes.com** using **Email Routing**
- [`wrangler` CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) logged in (`wrangler login`)
- API deployed with `INBOUND_MAIL_SECRET` set (same value you will bind as a Worker secret)

## One-time setup

1. **Install worker dependencies** (used when Wrangler bundles the script):

   ```bash
   cd infra && npm install
   ```

2. **Create the Worker** in the Cloudflare dashboard (optional; Wrangler can create on first deploy):

   - Workers & Pages → Create → name it **`ahmadcodes-email`**

3. **Bind secrets and vars** (from `infra/`, using this repo’s Wrangler config file):

   ```bash
   cd infra
   wrangler secret put INBOUND_MAIL_SECRET -c wrangler-email-worker.toml
   ```

   Use the **same** value as `INBOUND_MAIL_SECRET` in the API environment (Dokploy / `.env`).

4. **Set `FORWARD_TO`** (plain text var, not a secret) in `wrangler-email-worker.toml` under `[vars]`, or override when deploying:

   ```toml
   [vars]
   FORWARD_TO = "you@gmail.com"
   ```

   Optional: set `INBOUND_API_URL` if your API URL is not the default `https://api.ahmadcodes.com/mail/inbound`.

5. **Deploy**

   ```bash
   cd infra
   wrangler deploy -c wrangler-email-worker.toml
   ```

6. **Route mail to the worker**

   - Cloudflare Dashboard → **ahmadcodes.com** → **Email** → **Email Routing** → **Email Workers**
   - Route **`contact@ahmadcodes.com`** (or your chosen address) to the **`ahmadcodes-email`** worker  
   - Remove or adjust any **forward-only** rule that would bypass the worker for the same address (you typically want the worker to run first so it can `message.forward()` after processing)

## DNS

Email Routing already requires **MX** to Cloudflare; no extra DNS is needed for the worker beyond what Email Routing uses. Ensure the routed address exists as a **Custom address** under Email Routing.

## Troubleshooting

- **401 from API**: `INBOUND_MAIL_SECRET` mismatch between Worker secret and API env.
- **Worker logs**: Workers & Pages → **ahmadcodes-email** → **Logs** (or `wrangler tail -c wrangler-email-worker.toml`).
- Failures are **logged** in the worker; the script avoids throwing after the main path so Cloudflare can still deliver or forward per platform behavior—verify routing and `FORWARD_TO` in the dashboard if mail stops arriving.
