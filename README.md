# @dmaximyuk/signature

Библиотека для работы с подписями Telegram и VKontakte, совместимая с Bun.js, Node.js и браузером.

## Установка

```bash
npm install @dmaximyuk/signature
# или
bun add @dmaximyuk/signature
```

## Использование

### Универсальная версия (рекомендуется)

```typescript
import { encode, decode, vkDecode, type TelegramResponse, type VKResponse } from '@dmaximyuk/signature';

// Encode для отправки данных на сервер
const encodedData = encode(initDataRaw);

// Decode с проверкой подписи (на сервере) или без проверки (в браузере)
const telegramData = decode({ token: 'bot-token' }, signature);
const vkData = vkDecode({ token: 'vk-token' }, signature);
```

### Для фронтенда (браузер)

```typescript
import { encode, decode, vkDecode, type TelegramResponse, type VKResponse } from '@dmaximyuk/signature/frontend';

// Encode для отправки данных на сервер
const encodedData = encode(initDataRaw);

// Decode для тестирования (без проверки подписи)
const decodedData = decode({ token: 'bot-token' }, encodedData);
```

### Для бэкенда (Node.js/Bun.js)

```typescript
import { decode, vkDecode, type TelegramResponse, type VKResponse } from '@dmaximyuk/signature/backend';

// Decode с проверкой подписи
const telegramData = decode({ token: 'bot-token' }, signature);
const vkData = vkDecode({ token: 'vk-token' }, signature);
```

## API

### Telegram

#### `encode(initDataRaw: string): string | undefined`
Кодирует данные Telegram для отправки на сервер.

#### `decode(params: { token: string }, signature: string): TelegramResponse | undefined`
Декодирует и проверяет подпись Telegram данных. В браузере пропускает проверку подписи (только для тестирования).

### VKontakte

#### `vkDecode(params: { token: string }, signature: string): VKResponse | undefined`
Декодирует и проверяет подпись VKontakte данных. В браузере пропускает проверку подписи (только для тестирования).

## Типы

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

interface VKResponse {
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

## Совместимость

- ✅ **Node.js** - полная поддержка
- ✅ **Bun.js** - полная поддержка  
- ✅ **Браузер** - encode + decode без проверки подписи
- ✅ **Vite** - полная поддержка
- ✅ **Webpack** - полная поддержка

## Примечания

- **В браузере**: `decode` функции работают без проверки подписи (только для тестирования)
- **На сервере**: `decode` функции с полной проверкой подписи
- **Один код**: нет дублирования функций, одна универсальная реализация