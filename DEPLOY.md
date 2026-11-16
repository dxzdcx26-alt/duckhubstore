# Deploy DuckyHub → Cloudflare Pages

## One-time setup

### 1) Cloudflare API Token
1. Open https://dash.cloudflare.com/profile/api-tokens
2. Create Token with Cloudflare Pages Edit + D1 Edit
3. Store as GitHub Secret only — never paste in chat

### 2) Account ID
From Cloudflare Dashboard Overview

### 3) GitHub Secrets
| Name | Value |
|------|-------|
| CLOUDFLARE_API_TOKEN | token |
| CLOUDFLARE_ACCOUNT_ID | account id |

### 4) Push to main
GitHub Actions will build + migrate D1 + deploy Pages automatically.

## Project
- Pages project: digitalhub-store-github-io
- D1: digitalhub-store-db / binding DB
- Output: dist
- Functions: functions/
