import { createHmac } from "crypto";
import { TgUserData } from "../models";

const SECRET_KEY_CACHE = new Map<string, Buffer>();

function tgAuth(initData: string, botToken: string): TgUserData | undefined {
  try {
    const { d, h, u } = JSON.parse(atob(initData)) as { h: string; u: TgUserData; d: string };
    if (!h || !u || !d || typeof u !== "object") return;

    let secretKey = SECRET_KEY_CACHE.get(botToken);
    if (!secretKey) {
      secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
      SECRET_KEY_CACHE.set(botToken, secretKey);
    }

    const hash = createHmac("sha256", secretKey).update(d).digest("hex");
    return hash === h ? u : undefined;
  } catch (e) {
    return;
  }
}

export default tgAuth;
