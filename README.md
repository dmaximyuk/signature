# @dmaximyuk/signature

A library for working with Telegram and VKontakte signatures, compatible with Bun.js, Node.js and the browser.

## Installation

```bash
npm install @dmaximyuk/signature
# OR
bun add @dmaximyuk/signature
```

## Usage

```typescript
import { telegramEncode, telegramDecode, vkontakteDecode, type TelegramResponse, type VKontakteResponse } from '@dmaximyuk/signature';

// frontend (now available only telegram)
const encodedData = telegramDecode(initDataRaw);

// backend
const telegramData = telegramEncode({ token: 'tg-bot-token' })(encodedData);
const vkData = vkontakteDecode({ token: 'vk-token' })("signature");
```

## Types

```typescript
interface TelegramResponse {
  queryId: string;
  authDate: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
    is_premium: boolean;
    allows_write_to_pm: boolean;
    photo_url: string;
  };
}

interface VKontakteResponse {
  vk_app_id: number;
  vk_are_notifications_enabled: number;
  vk_is_app_user: number;
  vk_is_favorite: number;
  vk_language: string;
  vk_platform: string;
  vk_ref: string;
  vk_ts: number;
  vk_user_id: number;
}
```

## Compatibility

- ✅ **Node.js** - full support
- ✅ **Bun.js** - full support
- ✅ **Browser** - encode without signature verification
