# @dmaximyuk/signature

Library for working with Telegram and VKontakte signatures: encode raw init/launch data into a compact string and verify signatures on the backend. Compatible with Bun.js, Node.js, and the browser.

## Installation

```bash
npm install @dmaximyuk/signature
# or
bun add @dmaximyuk/signature
```

## Usage

### Telegram

**Frontend (or any source):** turn raw `initData` (query string) into a compact string to send to the backend.

```typescript
import { telegramEncode, telegramDecode, type TelegramDecodeResult } from '@dmaximyuk/signature';

const rawInitData = new URLSearchParams(window.Telegram?.WebApp?.initData || '').toString();
const encoded = telegramEncode(rawInitData);
```

**Backend:** verify signature and extract user data.

```typescript
const validator = telegramDecode({ token: process.env.TG_BOT_TOKEN });
const result = validator(encoded);
if (result) {
  console.log(result.userId, result.user);
}
```

### VKontakte

**Frontend:** turn raw launch params (query string with `sign`) into a compact string.

```typescript
import { vkontakteEncode, vkontakteDecode, type VKontakteDecodeResult } from '@dmaximyuk/signature';

const rawLaunchParams = window.location.search.slice(1);
const encoded = vkontakteEncode(rawLaunchParams);
```

**Backend:** verify signature and extract data.

```typescript
const validator = vkontakteDecode({ token: process.env.VK_APP_TOKEN });
const result = validator(encoded);
if (result) {
  console.log(result.userId, result.params);
}
```

## Types

### Telegram

```typescript
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

interface TelegramDecodeResult {
  userId: number;
  authDate: number;
  queryId: string;
  user: TelegramUser;
}

interface TelegramDecodeOptions {
  token: string;
  maxAge?: number;
}
```

### VKontakte

```typescript
interface VKontakteUser {
  vk_user_id: number;
  vk_app_id: number;
  vk_ts: number;
  vk_is_app_user: number;
  vk_are_notifications_enabled: number;
  vk_is_favorite: number;
  vk_language: string;
  vk_platform: string;
  vk_ref: string;
}

interface VKontakteDecodeResult {
  userId: number;
  ts: number;
  params: VKontakteUser;
}

interface VKontakteDecodeOptions {
  token: string;
  maxAge?: number;
}
```

## Tests

Requires a `.env` file with (see `.env.example`):

- **Telegram:** `TG_BOT_TOKEN`, `TG_RAW_SECRET`
- **VKontakte:** `VK_APP_TOKEN`, `VK_RAW_SECRET` (VK tests are skipped if not set)

```bash
bun run test
```

Tests cover: valid signature from encode, full data from decode, rejection of invalid/tampered signatures and wrong token, plus encode/decode benchmarks.

## Benchmarks

**Telegram** (Apple M4 Pro, 48 GB, `bun test`):

| Operation | Total   | Per op   | Throughput   | n      |
|-----------|---------|----------|--------------|--------|
| encode    | 30.76ms | 0.0031ms | 325 125 ops/s | 10 000 |
| decode    | 119.42ms| 0.0012ms | 837 367 ops/s | 100 000 |

## Compatibility

- **Node.js** — full support (decode uses `node:crypto`)
- **Bun.js** — full support
- **Browser** — encode only; no signature verification (decode requires Node/Bun for HMAC)
