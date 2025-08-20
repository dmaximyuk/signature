# VKontakte / Telegram - Signature with Bun

## The reasons for the existence of this library
Native VK and Telegram solutions are slowed. We weren't trying to do anything new, we were just trying to unload the servers and speed up what was already working fine!
At the exit, you will receive either **false** or a **typed signature response**!

## NPM
[https://www.npmjs.com/package/@dmaximyuk/signature](https://www.npmjs.com/package/@dmaximyuk/signature)

## Installation
```bash
bun add @dmaximyuk/signature
```

## Performance ( Apple M4 Pro / 24/512gb )
##### 100_000 elements:
```
1. TG:         164.29ms / 100_000 elements | 0.001643ms / 1 element
2. VK:         139.85ms / 100_000 elements | 0.001399ms / 1 element
3. VK Default: 233.25ms / 100_000 elements | 0.002332ms / 1 element
```

## Usage in the frontend
```typescript jsx
import { encode } from "@dmaximyuk/signature"

const sign = encode("your_raw_signature") // string
```

## Usage in the backend
```typescript
import { decode } from "@dmaximyuk/signature"

const tgData = decode("tg", botToken, initData) // TgUserData | false
const vkData = decode("vk", vkSecret, initData) // VkUserData | false
```

## Warning!
The string must be passed in the headers