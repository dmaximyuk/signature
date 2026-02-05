export interface VKontakteUser {
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

export interface DecodeResult {
  userId: number;
  ts: number;
  params: VKontakteUser;
}

export interface DecodeOptions {
  token: string;
  maxAge?: number;
}

type DecodeFn = (sig: string | undefined) => DecodeResult | undefined;

let nodeHmac: typeof import("node:crypto").createHmac;

const getNodeHmac = () => {
  if (!nodeHmac) nodeHmac = require("node:crypto").createHmac;
  return nodeHmac;
};

export const decode = (options: DecodeOptions): DecodeFn => {
  if (!options?.token || typeof options.token !== "string" || options.token.length < 10) {
    throw new Error("VKontakte decode requires mini app token");
  }

  const hmac = getNodeHmac();
  const token = options.token;
  const maxAge = options.maxAge;

  return (sig) => {
    if (!sig) return;

    const p1 = sig.indexOf("|");
    if (p1 === -1) return;

    const p2 = sig.indexOf("|", p1 + 1);
    if (p2 === -1) return;

    const p3 = sig.indexOf("|", p2 + 1);
    if (p3 === -1) return;

    const userId = +sig.slice(p1 + 1, p2);
    const ts = +sig.slice(p2 + 1, p3);

    if (maxAge !== undefined && (Date.now() / 1000 | 0) - ts > maxAge) return;

    const sign = sig.slice(0, p1);
    const query = atob(sig.slice(p3 + 1));
    const computed = hmac("sha256", token).update(query).digest("base64url");

    if (sign !== computed) return;

    try {
      const params: Partial<VKontakteUser> = {};
      let keyStart = 0;
      let keyEnd = -1;
      let valueStart = -1;

      for (let i = 0; i <= query.length; i++) {
        const c = i < query.length ? query.charCodeAt(i) : 38;

        if (c === 61 && keyEnd === -1) {
          keyEnd = i;
          valueStart = i + 1;
        } else if (c === 38) {
          if (keyEnd !== -1) {
            const key = query.slice(keyStart, keyEnd);
            const value = query.slice(valueStart, i);
            (params as any)[key] = value.length && !isNaN(value as any) ? +value : value;
          }
          keyStart = i + 1;
          keyEnd = -1;
          valueStart = -1;
        }
      }

      return { userId, ts, params: params as VKontakteUser };
    } catch {
      return;
    }
  };
};
