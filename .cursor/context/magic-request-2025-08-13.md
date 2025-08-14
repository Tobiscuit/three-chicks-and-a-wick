# Magic Request — Day-Start Brief (2025-08-13)

## What works (E2E)
- Terraform-only backend; Amplify = hosting only
- Flow: AppSync startMagicRequest → Lambda (start) → SQS → previewWorker Λ → Gemini (JSON) → server-side HTML → Shopify (variant/cart) → DynamoDB; frontend polls getMagicRequestStatus
- Schema field names: `status, html, cartId, variantId, jobError, errorMessage`
- E2E verified: READY returns html + variantId + cartId

## How to test (backend only)
```bash
# Start job
APPSYNC_URL=$(terraform -chdir=/home/juan/development/three-chicks-and-a-wick/terraform output -raw graphql_url); APPSYNC_KEY=$(terraform -chdir=/home/juan/development/three-chicks-and-a-wick/terraform output -raw api_key); RESP=$(curl -sS -H "Content-Type: application/json" -H "x-api-key: $APPSYNC_KEY" --data-binary '{"query":"mutation Start($p:String!,$s:String!,$w:String!,$j:String!,$x:String!,$c:ID){ startMagicRequest(prompt:$p,size:$s,wick:$w,jar:$j,wax:$x,cartId:$c){ jobId status }}","variables":{"p":"sunlit citrus and ocean breeze","s":"The Spark (8oz)","w":"Cotton","j":"Standard Tin","x":"Soy","c":null}}' "$APPSYNC_URL"); echo "$RESP"; JOB_ID=$(echo "$RESP" | tr -d '\n' | sed -n 's/.*\"jobId\":\"\([^\"]*\)\".*/\1/p'); echo "JOB_ID=$JOB_ID"
```
```bash
# Poll until READY/ERROR
for i in {1..60}; do echo "poll $i"; R=$(curl -sS -H "Content-Type: application/json" -H "x-api-key: $APPSYNC_KEY" --data-binary '{"query":"query Q($id:ID!){ getMagicRequestStatus(jobId:$id){ status html cartId variantId jobError errorMessage }}","variables":{"id":"'"$JOB_ID"'"}}' "$APPSYNC_URL"); echo "$R"; S=$(echo "$R" | tr -d '\n' | sed -n 's/.*\"status\":\"\([^\"]*\)\".*/\1/p'); if [ "$S" = "READY" ] || [ "$S" = "ERROR" ]; then break; fi; sleep 2; done
```

## Infra & env assumptions
- Env (Lambda): `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-2.5-flash`, `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_API_TOKEN`, `PREVIEW_JOBS_TABLE`, `PREVIEW_JOBS_QUEUE_URL`
- Shopify: product handles like `custom-candle-spark-8oz` with options `Wick`, `Jar`, `Scent Tier`; available on Headless sales channel
- X-Ray enabled on worker; SQS visibility 360s; worker 3008MB/300s

## Key files
- Backend logic: `/terraform/lambda/index.js`
- Terraform: `/terraform/main.tf`, `/terraform/variables.tf`, `/terraform/schema.graphql`
- Frontend form: `/src/features/magic-request/components/MagicRequestForm.tsx`

## Gotchas
- Frontend must request `jobError` not `error`; surface `jobError || errorMessage`
- Gemini uses `application/json` and JSON-only prompt (server renders HTML)
- Variant/cart nulls usually mean Shopify variants/options not configured/available

## Next steps (optional)
- Finish `shareCandle` and `getCommunityCreations` handlers and UI
- Add GSI on DynamoDB for `isShared`/`createdAt` or `userId` for My Creations
- Provisioned Concurrency (1–2) on worker for demos
- Prompt tuning only after baseline stability

