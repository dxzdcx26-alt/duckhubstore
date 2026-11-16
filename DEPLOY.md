# Deploy DuckyHub → Cloudflare Pages

## สำคัญ: Cloudflare Pages Build Settings

ถ้า deploy ผ่าน **Cloudflare Dashboard** (ไม่ผ่าน GitHub Actions) ต้องตั้งค่าดังนี้:

| Setting | ค่าที่ถูกต้อง |
|---------|----------------|
| **Framework preset** | Vite (หรือ None) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Deploy command** | **ว่างไว้** หรือลบ `npx wrangler deploy` ออก |
| **Root directory** | `/` |

**ห้าม** ใส่ `npx wrangler deploy` เป็น Deploy command — โปรเจกต์นี้เป็น Pages ต้องใช้ output directory `dist` เท่านั้น

ถ้า Cloudflare ยังรัน `wrangler deploy` จะได้ error:
```
Missing entry-point to Worker script or to assets directory
```

---

## วิธีที่ 1: GitHub Actions (แนะนำ)

### Secrets ที่ต้องมี (repo → Settings → Secrets and variables → Actions)

| Name | ค่า |
|------|-----|
| `CLOUDFLARE_API_TOKEN` | Token จาก Cloudflare (Edit Cloudflare Workers / Pages + D1) |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID จาก Dashboard |

หลัง push ไป `main` → workflow `Deploy to Cloudflare Pages` จะ:
1. `npm ci`
2. `tsc --noEmit`
3. `npm run build` → ได้ `dist/`
4. `wrangler pages deploy dist --project-name=digitalhub-store-github-io`
5. Apply D1 migrations 0001 → 0002 → 0003

### สร้าง API Token
1. https://dash.cloudflare.com/profile/api-tokens
2. Create Token → ใช้ template **Edit Cloudflare Workers** หรือ Custom:
   - Account: Cloudflare Pages — Edit
   - Account: D1 — Edit
3. คัดลอก Token — **อย่าใส่ใน source code**

---

## วิธีที่ 2: Deploy จากเครื่องตัวเอง

```bash
npm ci
npm run build
npx wrangler pages deploy dist --project-name digitalhub-store-github-io
```

หรือใช้ script:
```bash
npm run deploy
```

---

## D1 Database

- Binding name: `DB`
- Database name: `digitalhub-store-db`
- Config: `wrangler.jsonc` → `pages_build_output_dir: "./dist"`

รัน migration ด้วยมือ (ถ้าต้องการ):
```bash
npm run cf:migrate
```

---

## หมายเหตุ V4.2

- ลบการพึ่งพา supabase / gafiw / otp24hr / google drive / wichx ออกแล้ว
- Auth ใช้ `/api/auth/register` + `/api/auth/session` (D1 + SHA-256)
- อย่าใช้ `wrangler deploy` (Workers) กับโปรเจกต์นี้ — ใช้ `wrangler pages deploy` เท่านั้น
