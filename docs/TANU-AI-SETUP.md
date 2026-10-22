# Tanu online tutor activation

The UI and streaming transport alone do not enable AI. On 23 October 2026 the
existing Render service had no AI provider environment settings. No API key was
created, copied, committed, or configured during this change.

1. The owner creates a provider API key in their provider account and adds it
   directly to **Lugaish-server → Environment** in Render. Do not send keys in
   chat or put them in the frontend. Existing service:
   https://dashboard.render.com/web/srv-d8on3sc8aovs7384md50/env
2. Choose `NOVYRA_AI_PROVIDER=gemini` with `GEMINI_API_KEY`, or `openai` with
   `OPENAI_API_KEY`. Set `NOVYRA_MODEL_NAME` to an available pinned model ID.
3. Set approved positive `NOVYRA_DAILY_BUDGET_USD` and
   `NOVYRA_MONTHLY_BUDGET_USD`. Also set conservative current prices for that
   model: `NOVYRA_INPUT_USD_PER_MILLION` and `NOVYRA_OUTPUT_USD_PER_MILLION`.
   Configure provider-side spending limits too. This app does not purchase
   credits, change provider billing, or guarantee the provider's final invoice.
4. Set `NOVYRA_PAID_ENABLED=true` only after the owner has approved those limits.
   Save and deploy the existing service; do not create a replacement service.
5. Run `node scripts/check-tanu-config.mjs` in the backend environment if needed.
   It reports readiness and missing setting names, never key values.
6. In a real signed-in session, ask “HTML-এ h1 আর h2 কী?”, then “আরেকটা ছোট উদাহরণ
   দাও”. Verify a generated response, streamed text, and the follow-up context.
   Test Stop, retry, and a second browser opening an HTML lesson during the reply.
   Do not claim activation is verified until this real-provider test passes.

The backend handles streaming in the existing authenticated POST `/api/novyra/chat`
with `{stream:true}`; older clients still get JSON. The browser does not call AI
providers directly. It never automatically retries this POST. The provider request
has a 25-second total timeout, and the browser stream a 45-second timeout.
Closing/stopping a stream aborts the upstream request. Four concurrent chat
requests per server process and one per student per process are the defaults;
other routes remain available. This is capacity control, not a load-test SLA.

Daily and monthly estimated-cost reservations share one MongoDB document per UTC
month, so both caps are checked and incremented atomically, including across
server instances. Input bytes plus framing and all permitted output are reserved
before calling the provider. Reservations are not refunded on errors or Stop;
this intentionally underuses the budget. Set pricing conservatively, including
any provider-specific reasoning cost, and use provider billing limits as the
ultimate account safeguard. Existing student token/request quotas also apply.

Configured-provider failures in streaming chat produce a retryable error, rather
than silently presenting a template as a generated reply. Without configuration,
the prepared guide remains explicitly labelled as built-in help.

Protocol references used for implementation:
- https://developers.openai.com/api/reference/resources/chat/subresources/completions/streaming-events
- https://ai.google.dev/api/generate-content
