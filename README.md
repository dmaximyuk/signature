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

## Usage in the backend
```typescript
import sign, { type TgUserData, type VkUserData } from "@dmaximyuk/signature"

const tgData = sign("tg", initData, botToken) // TgUserData | false
const vkData = sign("vk", initData, vkSecret) // VkUserData | false
```

## VK - Init Data Frontend:
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

## Telegram - Init Data Frontend:
```typescript jsx
function prepareAuthData(initData: string): string {
    const params = new URLSearchParams(initData);

    const authData = {
        h: params.get("hash") || "",
        u: {
            query_id: params.get("query_id") || "",
            auth_date: +(params.get("auth_date") || ""),
            user: JSON.parse(params.get("user") || ""),
        },
        d: Array.from(params.entries())
            .filter(([key]) => key !== "hash")
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}=${v}`)
            .join("\n"),
    };

    return btoa(JSON.stringify(authData));
}

const initData = prepareAuthData(tgSecret);
```

## Warning!
The string must be passed in the headers