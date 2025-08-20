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

## Important!
Don't be afraid of the weight of the library. If tree shaking is enabled, then the code for the backend will not get into the frontend, and in the opposite direction!
> Just don't forget to add shaking =)

## Usage in the frontend
#### Telegram Mini Apps
```typescript jsx
import { encode } from "@dmaximyuk/signature/telegram"

const sign = encode("your_raw_init_data") // <= paste raw init data and get string or undefined
```

#### VK Mini Apps - example
```typescript jsx
const data = async () => new Promise<string | undefined>(async (resolve) => {
    try {
        let data: Record<string, string | number> | undefined;
        const support = await bridge.supportsAsync("VKWebAppGetLaunchParams");

        if (support) {
            try {
                data = await bridge.send("VKWebAppGetLaunchParams");
            } catch (err) { 
                console.log(err) 
            };
        }

        if (!support || !data) {
            const query = window.location.search.slice(1);
            const parce = '{"' + decodeURI(query
                .replace(/&/g, "\",\"")
                .replace(/=/g, "\":\"")
            ) + '"}';
            data = JSON.parse(parce);
        }

        if (!data) {
            resolve(undefined); 
            return;
        }

        const param = Object.keys(data).sort().reduce((param, key, index, array) => {
            if (key.startsWith("vk_")) { param += `${key}=${data![key]}&` }
            if (index === array.length - 1) { param += `sign=${data!["sign"]}` }
            return param;
        }, "").replace(",", "%2C");

        if (!param) { 
            return resolve(undefined) 
        }
        
        resolve(param);

    } catch { 
        resolve(undefined) 
    }
});

const initData = await data()
```

## Usage in the backend
```typescript
import { decode as telegramDecode } from "@dmaximyuk/signature/telegram"

const tgData = decode("tg", botToken, initData) // TgUserData | false
const vkData = decode("vk", vkSecret, initData) // VkUserData | false
```

## Warning!
The string must be passed in the headers